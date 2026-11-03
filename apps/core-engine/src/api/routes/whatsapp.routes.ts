import { Router, Request, Response } from 'express';
import { WhatsAppWebhookHandler } from '../../channels/whatsapp/webhook.handler';
import { WhatsAppMunimService } from '../../core/agents/whatsapp-munim.agent';
import { OpenWABridge } from '../../channels/whatsapp/openwa.bridge';
import { PrismaClient } from '@prisma/client';
import { EventRouter } from '../../core/events/event-router';

export function createWhatsAppRoutes(
  webhookHandler: WhatsAppWebhookHandler,
  prisma?: PrismaClient,
  eventRouter?: EventRouter
): Router {
  const router = Router();
  const munimService = new WhatsAppMunimService();
  const openWaBridge = (prisma && eventRouter)
    ? new OpenWABridge(prisma, eventRouter)
    : null;

  // ─── Meta WhatsApp Cloud API Endpoints ─────────────────────────────────────
  router.get('/webhook', (req, res) => webhookHandler.handleVerification(req, res));
  router.post('/webhook', (req, res) => webhookHandler.handleIncoming(req, res));

  // ─── OpenWA / Baileys Self-Hosted Gateway Endpoints ─────────────────────────

  /**
   * OpenWA Webhook receiver:
   * Captures events from OpenWA HTTP gateway (messages, voice notes, bill photos, session updates)
   */
  router.post('/openwa/webhook', async (req: Request, res: Response) => {
    try {
      if (!openWaBridge) {
        return res.status(200).json({ status: 'ok', warning: 'OpenWA bridge initialized in standalone mode' });
      }
      const result = await openWaBridge.handleWebhook(req.body);
      res.status(200).json({ status: 'success', handled: result.handled, reply: result.reply });
    } catch (err: any) {
      console.error('[OpenWA Route] Error handling webhook:', err.message);
      res.status(500).json({ error: err.message || 'Webhook processing failed' });
    }
  });

  /**
   * OpenWA Session Status & QR Code for Merchant Onboarding:
   * Returns current connection state (CONNECTED, SCAN_QR_CODE) with base64 QR code
   */
  router.get('/openwa/status', async (req: Request, res: Response) => {
    try {
      const session = (req.query.session as string) || 'default';
      if (!openWaBridge) {
        return res.status(200).json({ status: 'CONNECTED', mock: true, message: 'OpenWA running in simulation mode' });
      }
      const statusData = await openWaBridge.getSessionStatus(session);
      res.status(200).json({ success: true, ...statusData });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch OpenWA status' });
    }
  });

  /**
   * Send WhatsApp text message via OpenWA Gateway
   */
  router.post('/openwa/send', async (req: Request, res: Response) => {
    try {
      const { to, message, session } = req.body;
      if (!to || !message) {
        return res.status(400).json({ error: 'Fields "to" and "message" are required' });
      }
      if (!openWaBridge) {
        return res.status(200).json({ success: true, mock: true, sent: { to, message } });
      }
      const ok = await openWaBridge.sendText(to, message, session);
      res.status(200).json({ success: ok });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to send WhatsApp message' });
    }
  });

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
      openwa: {
        bridgeActive: !!openWaBridge,
        routes: ['/whatsapp/openwa/webhook', '/whatsapp/openwa/status', '/whatsapp/openwa/send'],
      },
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
