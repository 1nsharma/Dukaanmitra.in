import { Router } from 'express';
import { WhatsAppWebhookHandler } from '../../channels/whatsapp/webhook.handler';

export function createWhatsAppRoutes(webhookHandler: WhatsAppWebhookHandler): Router {
  const router = Router();

  router.get('/webhook', (req, res) => webhookHandler.handleVerification(req, res));
  router.post('/webhook', (req, res) => webhookHandler.handleIncoming(req, res));

  return router;
}
