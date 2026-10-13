import { Router, Request, Response } from 'express';
import { BaazarSyncClient } from '../../core/integration/baazarsync.client';

export function createBaazarSyncRoutes(client: BaazarSyncClient): Router {
  const router = Router();

  router.get('/health', async (_req: Request, res: Response) => {
    try {
      const data = await client.health();
      res.json({ ok: true, data });
    } catch (error) {
      res.status(502).json({ ok: false, error: error instanceof Error ? error.message : 'BaazarSync unavailable' });
    }
  });

  return router;
}
