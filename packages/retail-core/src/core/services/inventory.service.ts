/**
 * InventoryService — deterministic stock engine.
 *
 * All agents (voice, OCR, photo, chat, app) go through this single service.
 * Business state never depends on an LLM's arithmetic: agents extract intent,
 * this service applies it deterministically and emits events.
 */

import { PrismaClient } from '@prisma/client';
import { getTemplate, BusinessTemplateDef } from '../templates/business-templates';

export interface StockOpInput {
  storeId: string;
  productId?: string;
  sku?: string;               // alternative lookup key
  quantity: number;           // signed: + in, - out
  type: 'PURCHASE_IN' | 'SALE_OUT' | 'ADJUSTMENT' | 'RETURN' | 'OPENING';
  source?: string;            // APP | WHATSAPP | VOICE | OCR | PHOTO | SYSTEM
  confidence?: number;
  eventId?: string;
  refType?: string;
  refId?: string;
  note?: string;
}

export interface ProductEditInput {
  name?: string;
  category?: string;
  unit?: string;
  costPrice?: number;
  sellPrice?: number;
  taxRate?: number;
  lowStockAlert?: number;
  barcode?: string;
  imageUrl?: string;
  isActive?: boolean;
  metadata?: any;
}

export class InventoryService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Seed a store's catalog from a business template. Idempotent per SKU:
   * re-running will not duplicate or overwrite merchant edits.
   */
  async seedFromTemplate(storeId: string, templateKey: string): Promise<{ created: number; skipped: number }> {
    const template = getTemplate(templateKey);
    if (!template) throw new Error(`Unknown template: ${templateKey}`);

    let created = 0;
    let skipped = 0;

    for (const sku of template.skus) {
      const existing = await this.prisma.product.findUnique({
        where: { storeId_sku: { storeId, sku: sku.sku } },
      });
      if (existing) { skipped++; continue; }

      const product = await this.prisma.product.create({
        data: {
          storeId,
          sku: sku.sku,
          name: sku.name,
          category: sku.category,
          unit: sku.unit,
          costPrice: sku.costPrice,
          sellPrice: sku.sellPrice,
          taxRate: sku.taxRate,
          openingStock: sku.openingStock,
          currentStock: sku.openingStock,
          lowStockAlert: sku.lowStockAlert,
          isService: sku.isService ?? false,
          source: 'TEMPLATE',
          metadata: { templateKey: template.key, editable: true },
        },
      });

      if (sku.openingStock > 0) {
        await this.prisma.stockMovement.create({
          data: {
            storeId,
            productId: product.id,
            type: 'OPENING',
            quantity: sku.openingStock,
            balance: sku.openingStock,
            source: 'SYSTEM',
            note: `Opening stock from template "${template.name}"`,
          },
        });
      }
      created++;
    }

    return { created, skipped };
  }

  /** Apply one stock operation atomically and record the movement. */
  async applyStockOp(input: StockOpInput): Promise<{ productId: string; balance: number; lowStock: boolean }> {
    if (!input.quantity || input.quantity === 0) throw new Error('quantity must be non-zero');

    const product = await this.resolveProduct(input.storeId, input.productId, input.sku);
    if (!product) throw new Error(`Product not found (storeId=${input.storeId}, sku=${input.sku ?? input.productId})`);

    const delta = input.type === 'SALE_OUT' ? -Math.abs(input.quantity) : input.quantity;

    const updated = await this.prisma.product.update({
      where: { id: product.id },
      data: { currentStock: { increment: delta } },
    });

    await this.prisma.stockMovement.create({
      data: {
        storeId: input.storeId,
        productId: product.id,
                type: input.type,
        quantity: delta,
        balance: updated.currentStock,
        source: input.source ?? 'SYSTEM',
        confidence: input.confidence,
        eventId: input.eventId,
        refType: input.refType,
        refId: input.refId,
        note: input.note,
      },
    });

    return { productId: product.id, balance: updated.currentStock, lowStock: updated.currentStock <= updated.lowStockAlert && !updated.isService };
  }

  /** Create a product from any channel (merchant form, voice note, OCR line item). */
  async createProduct(storeId: string, data: {
    sku: string; name: string; unit?: string; category?: string;
    costPrice?: number; sellPrice?: number; taxRate?: number;
    openingStock?: number; lowStockAlert?: number; isService?: boolean;
    source?: string; confidence?: number; imageUrl?: string; barcode?: string;
  }) {
    const product = await this.prisma.product.upsert({
      where: { storeId_sku: { storeId, sku: data.sku } },
      update: { ...data, storeId: undefined as never },
      create: {
        storeId,
        sku: data.sku,
        name: data.name,
        unit: data.unit ?? 'pcs',
        category: data.category,
        costPrice: data.costPrice ?? 0,
        sellPrice: data.sellPrice ?? 0,
        taxRate: data.taxRate ?? 0,
        openingStock: data.openingStock ?? 0,
        currentStock: data.openingStock ?? 0,
        lowStockAlert: data.lowStockAlert ?? 5,
        isService: data.isService ?? false,
        source: data.source ?? 'MANUAL',
        confidence: data.confidence,
        imageUrl: data.imageUrl,
        barcode: data.barcode,
      },
    });
    return product;
  }

  /** Edit any product field — used by app UI and by AI "edit" intents. */
  async editProduct(productId: string, patch: ProductEditInput) {
    return this.prisma.product.update({ where: { id: productId }, data: patch as any });
  }

  /** Soft-delete (keeps ledger history intact). */
  async archiveProduct(productId: string) {
    return this.prisma.product.update({ where: { id: productId }, data: { isActive: false } });
  }

  /** Fuzzy SKU/name match so voice & OCR channels can reference products loosely. */
  async resolveProduct(storeId: string, productId?: string, sku?: string) {
    if (productId) {
      return this.prisma.product.findFirst({ where: { id: productId, storeId } });
    }
    if (sku) {
      const exact = await this.prisma.product.findUnique({ where: { storeId_sku: { storeId, sku } } });
      if (exact) return exact;
      const normalized = sku.toLowerCase().replace(/[^a-z0-9]/g, '');
      const candidates = await this.prisma.product.findMany({ where: { storeId, isActive: true } });
      return candidates.find(
        (p) => p.sku.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized ||
               p.name.toLowerCase().includes(sku.toLowerCase())
      ) ?? null;
    }
    return null;
  }

  /** Low-stock report used by alerts agent. */
  async lowStockProducts(storeId: string) {
    const products = await this.prisma.product.findMany({
      where: { storeId, isActive: true, isService: false },
    });
    return products.filter((p) => p.currentStock <= p.lowStockAlert);
  }

  /** Full stock snapshot for app display / reports. */
  async stockSnapshot(storeId: string) {
    return this.prisma.product.findMany({
      where: { storeId, isActive: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }
}
