import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { EventRouter } from '../../core/events/event-router';
import { OndcService } from '../../core/integration/ondc.service';

export function createOndcRoutes(prisma: PrismaClient, eventRouter?: EventRouter): Router {
  const router = Router();
  const ondcService = new OndcService(prisma, eventRouter);

  // 1. ONDC Protocol Discovery
  router.post('/search', async (req: Request, res: Response) => {
    try {
      const response = await ondcService.handleSearch(req.body);
      res.status(200).json(response);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Error processing search' });
    }
  });

  // 2. ONDC Selection & Quote
  router.post('/select', (req: Request, res: Response) => {
    try {
      const response = ondcService.handleSelect(req.body);
      res.status(200).json(response);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Error processing select' });
    }
  });

  // 3. ONDC Order Initialization
  router.post('/init', (req: Request, res: Response) => {
    try {
      const response = ondcService.handleInit(req.body);
      res.status(200).json(response);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Error processing init' });
    }
  });

  // 4. ONDC Order Confirmation
  router.post('/confirm', async (req: Request, res: Response) => {
    try {
      const response = await ondcService.handleConfirm(req.body);
      res.status(200).json(response);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Error processing confirm' });
    }
  });

  // 5. ONDC Order Status
  router.post('/status', (req: Request, res: Response) => {
    try {
      const { context, message } = req.body;
      const orderId = message?.order_id || 'ONDC-DEFAULT';
      const response = ondcService.handleStatus(context, orderId);
      res.status(200).json(response);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Error processing status' });
    }
  });

  // 6. ONDC Order Cancellation
  router.post('/cancel', (req: Request, res: Response) => {
    try {
      const { context, message } = req.body;
      const orderId = message?.order_id || 'ONDC-DEFAULT';
      const reasonCode = message?.cancellation_reason_id || '001';
      const response = ondcService.handleCancel(context, orderId, reasonCode);
      res.status(200).json(response);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Error processing cancel' });
    }
  });

  // 7. Store Catalog Synchronization
  router.post('/catalog/:storeId/sync', async (req: Request, res: Response) => {
    try {
      const syncResult = await ondcService.syncCatalog(req.params.storeId);
      res.status(200).json(syncResult);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Error syncing catalog' });
    }
  });

  // 8. ONDC Health & Compliance Verification
  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'active',
      network: 'ONDC Bharat Retail',
      protocol: 'Beckn v1.2.0',
      bpp_id: 'bpp.dukaanmitra.in',
      endpoints: ['search', 'select', 'init', 'confirm', 'status', 'cancel'],
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
