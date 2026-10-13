import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

import { EventStore } from './core/events/event-store';
import { EventRouter } from './core/events/event-router';
import { BillParserAgent } from './core/agents/bill-parser.agent';
import { CustomerIntelligenceAgent } from './core/agents/customer-intelligence.agent';
import { ReplyGeneratorAgent } from './core/agents/reply-generator.agent';
import { InventoryAgent } from './core/agents/inventory.agent';
import { OnboardingAgent } from './core/agents/onboarding.agent';
import { VoiceAgent } from './core/agents/voice.agent';
import { OcrAgent } from './core/agents/ocr.agent';
import { VisionAgent } from './core/agents/vision.agent';
import { KnowledgeAgent } from './core/agents/knowledge.agent';
import { WhatsAppWebhookHandler } from './channels/whatsapp/webhook.handler';
import { WhatsAppSender } from './channels/whatsapp/sender';
import { createWhatsAppRoutes } from './api/routes/whatsapp.routes';
import { createAppRoutes } from './api/routes/app.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const prisma = new PrismaClient();
const eventStore = new EventStore(prisma);
const redisUrl = process.env.REDIS_URL || 'memory';
const eventRouter = new EventRouter(eventStore, redisUrl);

// ─── Agent manager ──────────────────────────────────────────
// All agents are internal in-process workers managed by the core system itself.
// No MCP servers for ordinary business flows — MCP is reserved ONLY for serious
// external integrations (e.g. a payment-gateway bridge) if ever needed.
const billParserAgent = new BillParserAgent(prisma, eventRouter);
const customerIntelligenceAgent = new CustomerIntelligenceAgent(prisma, eventRouter);
const replyGeneratorAgent = new ReplyGeneratorAgent(prisma, eventRouter);
const inventoryAgent = new InventoryAgent(prisma, eventRouter);
const onboardingAgent = new OnboardingAgent(prisma, eventRouter);
const knowledgeAgent = new KnowledgeAgent(prisma, eventRouter);

// Multi-modal providers are injected adapters; null = "not configured yet"
// and each agent degrades gracefully with a clear log line.
const sttProvider = null;        // e.g. new WhisperSttProvider(...)  — voice notes
const ocrProvider = null;        // e.g. new TesseractOcrProvider(...) — bill/invoice photos
const detectorProvider = null;   // e.g. new YoloDetectionProvider(...) — shelf detection/annotation
const voiceAgent = new VoiceAgent(prisma, eventRouter, sttProvider);
const ocrAgent = new OcrAgent(prisma, eventRouter, ocrProvider);
const visionAgent = new VisionAgent(prisma, eventRouter, detectorProvider);

const whatsappSender = new WhatsAppSender(
  prisma,
  eventStore,
  process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0',
  process.env.WHATSAPP_ACCESS_TOKEN || '',
  process.env.WHATSAPP_PHONE_NUMBER_ID || ''
);

const webhookHandler = new WhatsAppWebhookHandler(
  prisma,
  eventRouter,
  process.env.WHATSAPP_VERIFY_TOKEN || 'default_verify_token'
);

const billParserQueue = eventRouter.getQueue('bill_parser');
if (billParserQueue) {
  billParserQueue.process(async (job) => {
    await billParserAgent.process(job);
  });
}

const customerIntelligenceQueue = eventRouter.getQueue('customer_intelligence');
if (customerIntelligenceQueue) {
  customerIntelligenceQueue.process(async (job) => {
    await customerIntelligenceAgent.process(job);
  });
}

const replyGeneratorQueue = eventRouter.getQueue('reply_generator');
if (replyGeneratorQueue) {
  replyGeneratorQueue.process(async (job) => {
    await replyGeneratorAgent.process(job);
  });
}

const whatsappSenderQueue = eventRouter.getQueue('whatsapp_sender');
if (whatsappSenderQueue) {
  whatsappSenderQueue.process(async (job) => {
    await whatsappSender.process(job);
  });
}

const voiceQueue = eventRouter.getQueue('voice_agent');
if (voiceQueue) {
  voiceQueue.process(async (job) => { await voiceAgent.process(job); });
}

const ocrQueue = eventRouter.getQueue('ocr_agent');
if (ocrQueue) {
  // MEDIA_RECEIVED fans out to ocr_agent + vision_agent inside EventRouter;
  // OcrAgent ignores non-image events, VisionAgent likewise.
  ocrQueue.process(async (job) => { await ocrAgent.process(job); });
}

const visionQueue = eventRouter.getQueue('vision_agent');
if (visionQueue) {
  visionQueue.process(async (job) => { await visionAgent.process(job); });
}

const inventoryQueue = eventRouter.getQueue('inventory_agent');
if (inventoryQueue) {
  inventoryQueue.process(async (job) => { await inventoryAgent.process(job); });
}

const onboardingQueue = eventRouter.getQueue('onboarding_agent');
if (onboardingQueue) {
  onboardingQueue.process(async (job) => { await onboardingAgent.process(job); });
}

const knowledgeQueue = eventRouter.getQueue('knowledge_agent');
if (knowledgeQueue) {
  knowledgeQueue.process(async (job) => { await knowledgeAgent.process(job); });
}

app.use('/whatsapp', createWhatsAppRoutes(webhookHandler));
app.use('/api', createAppRoutes(eventRouter, prisma));

app.get('/api/info', (req, res) => {
  res.json({
    name: 'DukaanMitra',
    version: '1.0.0',
    description: 'Event-driven AI business manager for every business type — pre-generated editable inventory, multi-modal capture (voice/photo/OCR/detection/annotation), store knowledge base, UPI-simple onboarding. All agents internal; no MCP except serious external integrations.',
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 DukaanMitra server running on port ${PORT}`);
  console.log(`📱 Web UI: http://localhost:${PORT}`);
  console.log(`📱 WhatsApp webhook: http://localhost:${PORT}/whatsapp/webhook`);
  console.log(`🔌 API endpoint: http://localhost:${PORT}/api`);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

export { app, eventRouter, prisma };
