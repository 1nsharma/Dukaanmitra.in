import express, { Request, Response } from 'express';
import cors from 'cors';
import qrcode from 'qrcode';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.OPENWA_PORT || 3008;
const CORE_ENGINE_WEBHOOK = process.env.CORE_WEBHOOK_URL || 'http://localhost:3000/whatsapp/openwa/webhook';

app.use(cors());
app.use(express.json());

interface SessionState {
  id: string;
  status: 'CONNECTED' | 'SCAN_QR_CODE' | 'STARTING' | 'STOPPED';
  qrCode?: string;
  phone?: string;
}

const sessions = new Map<string, SessionState>();

// Initialize default session
sessions.set('default', {
  id: 'default',
  status: 'SCAN_QR_CODE',
});

// Generate initial demo QR code for zero-setup instant merchant testing
(async () => {
  try {
    const defaultQr = await qrcode.toDataURL('DUKAANMITRA_WHATSAPP_CONNECT_DEMO_QR');
    const def = sessions.get('default');
    if (def) def.qrCode = defaultQr;
  } catch (e) {}
})();

/**
 * Health check & Info
 */
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    gateway: 'DukaanMitra OpenWA Gateway',
    version: '1.0.0',
    port: PORT,
    coreEngineWebhook: CORE_ENGINE_WEBHOOK,
    activeSessions: Array.from(sessions.keys()),
  });
});

/**
 * OpenWA Compatible Session Status Endpoint:
 * GET /api/sessions/:sessionId
 */
app.get('/api/sessions/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId) || {
    id: sessionId,
    status: 'STOPPED',
  };
  res.json(session);
});

/**
 * OpenWA Compatible QR Code Retrieval Endpoint:
 * GET /api/:sessionId/auth/qr
 */
app.get('/api/:sessionId/auth/qr', async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  let session = sessions.get(sessionId);
  if (!session) {
    session = { id: sessionId, status: 'SCAN_QR_CODE' };
    sessions.set(sessionId, session);
  }

  try {
    const rawQr = `dukaanmitra:session:${sessionId}:${Date.now()}`;
    const qrDataUrl = await qrcode.toDataURL(rawQr);
    session.qrCode = qrDataUrl;

    if (req.query.format === 'image') {
      const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
      const img = Buffer.from(base64Data, 'base64');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length,
      });
      return res.end(img);
    }

    res.json({ qr: qrDataUrl });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

/**
 * Simulate / Trigger WhatsApp Pairing Success
 */
app.post('/api/sessions/:sessionId/pair-success', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const phone = req.body.phone || '919876543210';
  const session = sessions.get(sessionId) || { id: sessionId, status: 'CONNECTED' };
  session.status = 'CONNECTED';
  session.phone = phone;
  session.qrCode = undefined;
  sessions.set(sessionId, session);

  res.json({ success: true, session });
});

/**
 * OpenWA Compatible Send Text Message Endpoint:
 * POST /api/sendText
 */
app.post('/api/sendText', (req: Request, res: Response) => {
  const { chatId, text, session: sessionId = 'default' } = req.body;
  if (!chatId || !text) {
    return res.status(400).json({ error: 'Missing chatId or text' });
  }

  console.log(`[OpenWA Gateway] Outbound message to ${chatId} (Session: ${sessionId}): "${text}"`);
  res.json({
    id: `wamid_DM_${Date.now()}`,
    status: 'SENT',
    to: chatId,
    text,
    timestamp: Date.now(),
  });
});

/**
 * Simulate Incoming Customer Message:
 * Useful for local testing, tests, and CLI demos
 * POST /api/simulate/inbound
 */
app.post('/api/simulate/inbound', async (req: Request, res: Response) => {
  const { from = '919876543210@c.us', body, type = 'chat', pushname = 'Demo Customer', mediaUrl } = req.body;

  const webhookPayload = {
    event: 'message',
    session: 'default',
    payload: {
      id: `wamid_IN_${Date.now()}`,
      timestamp: Math.floor(Date.now() / 1000),
      from,
      to: '918888888888@c.us',
      body,
      type,
      hasMedia: type !== 'chat',
      mediaUrl,
      sender: { pushname },
    },
  };

  try {
    const coreRes = await axios.post(CORE_ENGINE_WEBHOOK, webhookPayload);
    res.json({ success: true, deliveredToCore: true, coreResponse: coreRes.data });
  } catch (err: any) {
    res.status(502).json({
      success: false,
      error: `Core engine webhook failed: ${err.message}`,
      payload: webhookPayload,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 DukaanMitra OpenWA Gateway listening on port ${PORT}`);
  console.log(`📡 Inbound Webhook forwarder target: ${CORE_ENGINE_WEBHOOK}`);
  console.log(`📱 QR Pairing URL: http://localhost:${PORT}/api/default/auth/qr?format=image`);
});
