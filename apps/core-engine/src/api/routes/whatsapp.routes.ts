import { Router, Request, Response } from 'express';
import { WhatsAppWebhookHandler } from '../../channels/whatsapp/webhook.handler';
import { WhatsAppMunimService } from '../../core/agents/whatsapp-munim.agent';

export function createWhatsAppRoutes(webhookHandler: WhatsAppWebhookHandler): Router {
  const router = Router();
  const munimService = new WhatsAppMunimService();

  // Webhook verification & incoming message router
  router.get('/webhook', (req, res) => webhookHandler.handleVerification(req, res));
  router.post('/webhook', (req, res) => webhookHandler.handleIncoming(req, res));

  // ─── WhatsApp Munim Billing & Ledger Endpoints ──────────────────────────────

  /**
   * Parse natural language billing messages (Hindi, Hinglish, English) into structured intents.
   * e.g. "Ramesh ko 200 ka atta udhaar diya" -> intent: UDHAAR_ENTRY, customer: Ramesh, amount: 200
   */
  router.post('/munim/parse', (req: Request, res: Response) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Field "text" is required' });
      }
      const parsed = munimService.parseMunimMessage(text);
      res.status(200).json({ success: true, parsed });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Error parsing message' });
    }
  });

  /**
   * Generates a WhatsApp-native digital invoice slip with GST breakdown and UPI deep-link.
   */
  router.post('/munim/invoice', (req: Request, res: Response) => {
    try {
      const slip = munimService.generateInvoiceSlip(req.body);
      res.status(200).json({ success: true, slip });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Error generating invoice slip' });
    }
  });

  /**
   * Generates a respectful Udhaar payment reminder slip with 1-tap UPI payment link.
   */
  router.post('/munim/reminder', (req: Request, res: Response) => {
    try {
      const slip = munimService.generateReminderSlip(req.body);
      res.status(200).json({ success: true, slip });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Error generating reminder slip' });
    }
  });

  /**
   * Generates an interactive maker-checker confirmation slip for high-value entries.
   */
  router.post('/munim/confirm-slip', (req: Request, res: Response) => {
    try {
      const { proposalId, intent } = req.body;
      const slip = munimService.generateConfirmationSlip(proposalId || 'prop_default', intent);
      res.status(200).json({ success: true, slip });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Error generating confirmation slip' });
    }
  });

  router.get('/munim/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'active',
      module: 'WhatsApp Munim Billing & Ledger',
      supportedIntents: ['UDHAAR_ENTRY', 'JAMA_ENTRY', 'INSTANT_SALE', 'BALANCE_INQUIRY', 'DAILY_SUMMARY'],
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
