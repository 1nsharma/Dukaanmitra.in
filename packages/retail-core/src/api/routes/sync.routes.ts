import { Router, Request, Response } from 'express';
import { SyncService } from '../../core/integration/sync.service';

export function createSyncRoutes(syncService: SyncService): Router {
  const router = Router();

  router.post('/run', async (req: Request, res: Response) => {
    const limit = Number(req.body?.limit ?? 100);
    if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
      res.status(400).json({ success: false, error: 'limit must be an integer between 1 and 1000' });
      return;
    }

    try {
      const result = await syncService.syncRecentData(limit);
      res.status(result.errors.length ? 207 : 200).json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Sync failed' });
    }
  });

  return router;
}
