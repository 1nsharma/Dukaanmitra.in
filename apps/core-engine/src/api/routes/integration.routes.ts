import { Router, Request, Response } from 'express';
import { EventRouter } from '../../core/events/event-router';
import { BaseEventSchema, EventSource } from '../../core/events/types';

export function createIntegrationRoutes(eventRouter: EventRouter): Router {
  const router = Router();

  router.post('/events', async (req: Request, res: Response) => {
    try {
      const event = BaseEventSchema.parse({
        ...req.body,
        source: req.body.source || EventSource.SYSTEM,
      });
      await eventRouter.route(event);
      res.status(202).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  return router;
}
