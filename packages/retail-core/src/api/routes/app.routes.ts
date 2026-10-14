import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { EventRouter } from '../../core/events/event-router';
import { InventoryService } from '../../core/services/inventory.service';
import { listTemplates, getTemplate } from '../../core/templates/business-templates';
import {
  EventType, EventSource, SaleAddSchema, InventoryIntentSchema, OnboardStartSchema, KnowledgeCapturedSchema,
} from '../../core/events/types';

export function createAppRoutes(eventRouter: EventRouter, prisma: PrismaClient): Router {
  const router = Router();
  const inventory = new InventoryService(prisma);

  router.post('/sales', async (req: Request, res: Response) => {
    try {
      const eventData = SaleAddSchema.parse({
        type: EventType.SALE_ADD,
        source: EventSource.APP,
        payload: req.body,
      });

      await eventRouter.route(eventData);

      res.status(201).json({
        success: true,
        message: 'Sale recorded successfully',
      });
    } catch (error) {
      console.error('Error recording sale:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // ─── Onboarding (UPI-simple) ───────────────────────────────────────────────

  /** List pre-generated business templates (kirana, pharmacy, salon, ...). */
  router.get('/templates', (_req: Request, res: Response) => {
    res.json({ success: true, templates: listTemplates() });
  });

  router.get('/templates/:key', (req: Request, res: Response) => {
    const template = getTemplate(req.params.key);
    if (!template) return res.status(404).json({ success: false, error: 'Unknown template' });
    res.json({ success: true, template });
  });

  /** Start onboarding — phone verified like UPI login; optional template pick. */
  router.post('/onboard', async (req: Request, res: Response) => {
    try {
      const event = OnboardStartSchema.parse({
        type: EventType.ONBOARD_START,
        source: EventSource.APP,
        payload: req.body,
      });
      await eventRouter.route(event);
      res.status(202).json({ success: true, message: 'Onboarding started' });
    } catch (error) {
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // ─── Inventory: pre-generated + fully editable via API or any AI channel ──

  router.get('/stores/:storeId/inventory', async (req: Request, res: Response) => {
    const snapshot = await inventory.stockSnapshot(req.params.storeId);
    res.json({ success: true, inventory: snapshot });
  });

  router.get('/stores/:storeId/low-stock', async (req: Request, res: Response) => {
    const items = await inventory.lowStockProducts(req.params.storeId);
    res.json({ success: true, items });
  });

  /** Emit a structured inventory intent (ADD/EDIT/STOCK_IN/STOCK_OUT/...). */
  router.post('/inventory/intent', async (req: Request, res: Response) => {
    try {
      const event = InventoryIntentSchema.parse({
        type: EventType.INVENTORY_INTENT,
        source: EventSource.APP,
        payload: { source: 'APP', confidence: 1, ...req.body },
      });
      await eventRouter.route(event);
      res.status(202).json({ success: true, message: 'Inventory intent queued' });
    } catch (error) {
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  /** Direct product edit (app UI). */
  router.patch('/products/:id', async (req: Request, res: Response) => {
    try {
      const product = await inventory.editProduct(req.params.id, req.body);
      res.json({ success: true, product });
    } catch (error) {
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  router.post('/products/:id/archive', async (req: Request, res: Response) => {
    await inventory.archiveProduct(req.params.id);
    res.json({ success: true });
  });

  /** Re-seed / extend catalog from a template (idempotent per SKU). */
  router.post('/stores/:storeId/seed', async (req: Request, res: Response) => {
    try {
      const result = await inventory.seedFromTemplate(req.params.storeId, req.body.templateKey);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // ─── Multi-modal capture entry points (app side) ──────────────────────────

  /** App uploads a photo/voice note -> MEDIA_RECEIVED -> OCR/Vision/Voice agents. */
  router.post('/media', async (req: Request, res: Response) => {
    try {
      const { storeId, kind, url, mimeType } = req.body;
      await eventRouter.route({
        type: EventType.MEDIA_RECEIVED,
        source: EventSource.APP,
        payload: { storeId, kind, url, mimeType },
      });
      res.status(202).json({ success: true, message: 'Media queued for processing' });
    } catch (error) {
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  /** Merchant annotation on a media asset (label a box in a shelf photo etc.). */
  router.post('/stores/:storeId/annotations', async (req: Request, res: Response) => {
    try {
      const { assetId, label, box, note, target = 'MEDIA', targetId } = req.body;
      const annotation = await prisma.annotation.create({
        data: { storeId: req.params.storeId, assetId, target, targetId, label, box, note, createdBy: 'MERCHANT' as never },
      });
      res.status(201).json({ success: true, annotation });
    } catch (error) {
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // ─── Store knowledge base ─────────────────────────────────────────────────

  router.post('/knowledge', async (req: Request, res: Response) => {
    try {
      const event = KnowledgeCapturedSchema.parse({
        type: EventType.KNOWLEDGE_CAPTURED,
        source: EventSource.APP,
        payload: { source: 'MANUAL', ...req.body },
      });
      await eventRouter.route(event);
      res.status(202).json({ success: true, message: 'Knowledge capture queued' });
    } catch (error) {
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  router.get('/stores/:storeId/knowledge', async (req: Request, res: Response) => {
    const docs = await prisma.knowledgeDoc.findMany({
      where: { storeId: req.params.storeId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, docs });
  });

  router.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return router;
}
