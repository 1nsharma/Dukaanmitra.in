/**
 * InventoryAgent — the "AI everywhere" inventory manager.
 *
 * Consumes INVENTORY_INTENT / OCR_COMPLETED / DETECTION_COMPLETED /
 * STORE_ONBOARDED events and applies them through the deterministic
 * InventoryService. This is an internal in-process agent (Bull worker),
 * NOT an MCP server — agents are managed by the core system itself.
 */

import { Job } from 'bull';
import { PrismaClient } from '@prisma/client';
import { EventRouter } from '../events/event-router';
import { InventoryService } from '../services/inventory.service';
import { BaseEvent, EventType, EventSource } from '../events/types';

export class InventoryAgent {
  private prisma: PrismaClient;
  private eventRouter: EventRouter;
  private inventory: InventoryService;

  constructor(prisma: PrismaClient, eventRouter: EventRouter) {
    this.prisma = prisma;
    this.eventRouter = eventRouter;
    this.inventory = new InventoryService(prisma);
  }

  async process(job: Job<BaseEvent>): Promise<void> {
    const event = job.data;

    switch (event.type) {
      case EventType.INVENTORY_INTENT:
        return this.handleIntent(event);
      case EventType.OCR_COMPLETED:
        return this.handleOcr(event);
      case EventType.DETECTION_COMPLETED:
        return this.handleDetection(event);
      case EventType.STORE_ONBOARDED:
        return this.handleOnboarded(event);
      default:
        return;
    }
  }

  /** Template seeding on onboarding — pre-generated, editable inventory. */
  private async handleOnboarded(event: BaseEvent): Promise<void> {
    const { storeId, templateKey } = event.payload;
    const result = await this.inventory.seedFromTemplate(storeId, templateKey);

    await this.eventRouter.route({
      type: EventType.INVENTORY_INTENT, // reuse as generic system notice carrier
      source: EventSource.SYSTEM,
      payload: {
        storeId,
        intent: 'ADD_PRODUCT',
        note: `template_seeded`,
        seeded: result,
      },
      metadata: { parentEventId: event.id, systemNotice: true },
    });
  }

  /** Direct inventory intents from app / chat / voice (already parsed). */
  private async handleIntent(event: BaseEvent): Promise<void> {
    const p = event.payload as {
      storeId: string; intent: string; sku?: string; productId?: string; name?: string;
      quantity?: number; price?: number; fields?: Record<string, unknown>;
      source?: string; confidence?: number; systemNotice?: boolean; note?: string; seeded?: unknown;
    };

    // Ignore our own system notices to avoid loops.
    if (event.metadata?.systemNotice) return;

    const source = (p.source ?? 'APP').toUpperCase();
    const confidence = p.confidence;

    switch (p.intent) {
      case 'STOCK_IN':
      case 'PURCHASE_IN': {
        const res = await this.inventory.applyStockOp({
          storeId: p.storeId, productId: p.productId, sku: p.sku,
          quantity: Math.abs(p.quantity ?? 1), type: 'PURCHASE_IN',
          source, confidence, eventId: event.id, refType: 'EVENT', refId: event.id,
        });
        await this.emitStockMoved(res, p, 'PURCHASE_IN', event);
        break;
      }
      case 'STOCK_OUT': {
        const res = await this.inventory.applyStockOp({
          storeId: p.storeId, productId: p.productId, sku: p.sku,
          quantity: Math.abs(p.quantity ?? 1), type: 'SALE_OUT',
          source, confidence, eventId: event.id, refType: 'EVENT', refId: event.id,
        });
        await this.emitStockMoved(res, p, 'SALE_OUT', event);
        break;
      }
      case 'ADJUST_STOCK': {
        const product = await this.inventory.resolveProduct(p.storeId, p.productId, p.sku);
        if (!product) throw new Error('Product not found for adjustment');
        const delta = (p.quantity ?? 0) - product.currentStock;
        const res = await this.inventory.applyStockOp({
          storeId: p.storeId, productId: product.id, quantity: delta,
          type: 'ADJUSTMENT', source, confidence, eventId: event.id,
        });
        await this.emitStockMoved(res, { ...p, storeId: p.storeId, sku: product.sku }, 'ADJUSTMENT', event);
        break;
      }
      case 'EDIT_PRICE': {
        const product = await this.inventory.resolveProduct(p.storeId, p.productId, p.sku);
        if (!product) throw new Error('Product not found for price edit');
        await this.inventory.editProduct(product.id, { sellPrice: p.price });
        await this.emitStockMoved(
          { productId: product.id, balance: product.currentStock, lowStock: false },
          { ...p, storeId: p.storeId, sku: product.sku }, 'PRICE_EDIT', event,
        );
        break;
      }
      case 'EDIT_PRODUCT': {
        const product = await this.inventory.resolveProduct(p.storeId, p.productId, p.sku);
        if (!product) throw new Error('Product not found for edit');
        await this.inventory.editProduct(product.id, (p.fields ?? {}) as never);
        break;
      }
      case 'ADD_PRODUCT': {
        const sku = p.sku ?? (p.name ?? 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32);
        await this.inventory.createProduct(p.storeId, {
          sku,
          name: p.name ?? sku,
          costPrice: 0,
          sellPrice: p.price ?? 0,
          openingStock: p.quantity ?? 0,
          source,
          confidence,
        });
        break;
      }
      case 'ARCHIVE_PRODUCT': {
        const product = await this.inventory.resolveProduct(p.storeId, p.productId, p.sku);
        if (product) await this.inventory.archiveProduct(product.id);
        break;
      }
      default:
        console.warn(`Unknown inventory intent: ${p.intent}`);
    }
  }

  /** Purchase-invoice OCR → stock-in line items with per-line confidence. */
  private async handleOcr(event: BaseEvent): Promise<void> {
    const p = event.payload as {
      assetId: string; docType: string; lineItems?: Array<{ name: string; quantity?: number; unitPrice?: number; confidence?: number }>;
      total?: number; confidence: number; storeId?: string; phone?: string;
    };

    const storeId = p.storeId ?? await this.storeIdForPhone(p.phone);
    if (!storeId || !p.lineItems?.length) return;

    for (const line of p.lineItems) {
      const product = await this.inventory.resolveProduct(storeId, undefined, line.name);
      if (product) {
        const res = await this.inventory.applyStockOp({
          storeId, productId: product.id,
          quantity: Math.abs(line.quantity ?? 1), type: 'PURCHASE_IN',
          source: 'OCR', confidence: line.confidence ?? p.confidence,
          eventId: event.id, refType: 'MEDIA', refId: p.assetId,
        });
        await this.emitStockMoved(res, { ...p, storeId, sku: product.sku, name: product.name }, 'PURCHASE_IN', event);
      } else {
        // Unknown item on invoice → create it (editable later), flagged low-confidence
        await this.inventory.createProduct(storeId, {
          sku: line.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32),
          name: line.name,
          sellPrice: line.unitPrice ?? 0,
          openingStock: line.quantity ?? 0,
          source: 'OCR',
          confidence: line.confidence ?? p.confidence,
        });
      }
    }
  }

  /** Shelf-photo detections → count-based stock adjustments + annotations. */
  private async handleDetection(event: BaseEvent): Promise<void> {
    const p = event.payload as {
      assetId: string;
      detections: Array<{ label: string; box: { x: number; y: number; w: number; h: number }; confidence: number; matchedSku?: string; count?: number }>;
      scene?: string; storeId?: string; phone?: string;
    };

    const storeId = p.storeId ?? await this.storeIdForPhone(p.phone);
    if (!storeId) return;

    for (const det of p.detections ?? []) {
      // Persist annotation for every detection (audit + training data)
      await this.prisma.annotation.create({
        data: {
          storeId,
          assetId: p.assetId,
          target: 'MEDIA',
          label: det.label,
          box: det.box as never,
          createdBy: 'AI',
          confidence: det.confidence,
        },
      });

      if (det.matchedSku && (det.count ?? 1) > 0) {
        const product = await this.inventory.resolveProduct(storeId, undefined, det.matchedSku);
        if (product) {
          const delta = det.count! - product.currentStock;
          if (delta !== 0) {
            const res = await this.inventory.applyStockOp({
              storeId, productId: product.id, quantity: delta, type: 'ADJUSTMENT',
              source: 'PHOTO', confidence: det.confidence,
              eventId: event.id, refType: 'MEDIA', refId: p.assetId,
              note: `Shelf count via photo (${p.scene ?? 'unknown scene'})`,
            });
            await this.emitStockMoved(res, { ...p, storeId, sku: product.sku, name: product.name }, 'ADJUSTMENT', event);
          }
        }
      }
    }
  }

  private async emitStockMoved(
    res: { productId: string; balance: number; lowStock: boolean },
    p: { storeId: string; productId?: string; sku?: string; name?: string },
    movementType: string,
    event: BaseEvent,
  ): Promise<void> {
    const product = await this.prisma.product.findUnique({ where: { id: res.productId } });

    await this.eventRouter.route({
      type: EventType.STOCK_MOVED,
      source: EventSource.SYSTEM,
      payload: {
        storeId: p.storeId,
        productId: res.productId,
        sku: product?.sku ?? p.sku ?? '',
        name: product?.name ?? p.name ?? '',
        movementType,
        delta: 0,
        balance: res.balance,
        lowStock: res.lowStock,
        source: (event.payload as { source?: string })?.source ?? 'SYSTEM',
        confidence: (event.payload as { confidence?: number })?.confidence,
      },
      metadata: { parentEventId: event.id },
    });
  }

  private async storeIdForPhone(phone?: string): Promise<string | null> {
    if (!phone) return null;
    const store = await this.prisma.store.findFirst({ where: { phone } });
    return store?.id ?? null;
  }
}
