import { Router, Request, Response } from 'express';
import { CoreApiClient } from '../../core/integration/core-api.client';

export function createCoreApiRoutes(client: CoreApiClient): Router {
  const router = Router();

  router.get('/health', async (_req: Request, res: Response) => {
    try {
      const data = await client.health();
      res.json({ ok: true, data });
    } catch (error) {
      res.status(502).json({ ok: false, error: error instanceof Error ? error.message : 'CoreApi unavailable' });
    }
  });

  return router;
}
