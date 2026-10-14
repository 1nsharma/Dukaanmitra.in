import { z } from 'zod';

export enum EventType {
  WHATSAPP_MESSAGE_RECEIVED = 'WHATSAPP_MESSAGE_RECEIVED',
  BILL_PARSED = 'BILL_PARSED',
  CUSTOMER_UPDATED = 'CUSTOMER_UPDATED',
  OUTBOUND_MESSAGE_READY = 'OUTBOUND_MESSAGE_READY',
  SALE_ADD = 'SALE_ADD',

  // Multi-modal capture channels — voice, photo, OCR, object detection.
  // These are internal agents (in-process workers), NOT MCP servers.
  VOICE_TRANSCRIBED = 'VOICE_TRANSCRIBED',
  MEDIA_RECEIVED = 'MEDIA_RECEIVED',
  OCR_COMPLETED = 'OCR_COMPLETED',
  DETECTION_COMPLETED = 'DETECTION_COMPLETED',

  // Inventory & business management
  INVENTORY_INTENT = 'INVENTORY_INTENT',
  STOCK_MOVED = 'STOCK_MOVED',

  // Onboarding (UPI-simple) & store knowledge base
  ONBOARD_START = 'ONBOARD_START',
  STORE_ONBOARDED = 'STORE_ONBOARDED',
  KNOWLEDGE_CAPTURED = 'KNOWLEDGE_CAPTURED',
}

export enum EventSource {
  APP = 'APP',
  WHATSAPP = 'WHATSAPP',
  POS = 'POS',
  VOICE = 'VOICE',
  SYSTEM = 'SYSTEM',
}

export enum EventStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export const BaseEventSchema = z.object({
  id: z.string().optional(),
  type: z.nativeEnum(EventType),
  source: z.nativeEnum(EventSource),
  payload: z.record(z.any()),
  metadata: z.record(z.any()).optional(),
  status: z.nativeEnum(EventStatus).default(EventStatus.PENDING),
  createdAt: z.date().optional(),
});

export type BaseEvent = z.input<typeof BaseEventSchema>;

export const WhatsAppMessageReceivedSchema = BaseEventSchema.extend({
  type: z.literal(EventType.WHATSAPP_MESSAGE_RECEIVED),
  payload: z.object({
    phone: z.string(),
    message: z.string(),
    image: z.string().optional(),
    message_id: z.string(),
  }),
});

export type WhatsAppMessageReceived = z.infer<typeof WhatsAppMessageReceivedSchema>;

export const BillParsedSchema = BaseEventSchema.extend({
  type: z.literal(EventType.BILL_PARSED),
  payload: z.object({
    amount: z.number(),
    mode: z.string(),
    confidence: z.number(),
    phone: z.string(),
    originalMessageId: z.string().optional(),
  }),
});

export type BillParsed = z.infer<typeof BillParsedSchema>;

export const CustomerUpdatedSchema = BaseEventSchema.extend({
  type: z.literal(EventType.CUSTOMER_UPDATED),
  payload: z.object({
    customerId: z.string(),
    phone: z.string(),
    totalSales: z.number(),
    totalOrders: z.number(),
    lastOrderAt: z.date(),
  }),
});

export type CustomerUpdated = z.infer<typeof CustomerUpdatedSchema>;

export const OutboundMessageReadySchema = BaseEventSchema.extend({
  type: z.literal(EventType.OUTBOUND_MESSAGE_READY),
  payload: z.object({
    phone: z.string(),
    message: z.string(),
    confidence: z.number().optional(),
  }),
});

export type OutboundMessageReady = z.infer<typeof OutboundMessageReadySchema>;

export const SaleAddSchema = BaseEventSchema.extend({
  type: z.literal(EventType.SALE_ADD),
  payload: z.object({
    amount: z.number(),
    mode: z.string(),
    phone: z.string().optional(),
    confidence: z.number().optional(),
    storeId: z.string().optional(),
    items: z.array(z.object({
      sku: z.string(),
      name: z.string().optional(),
      quantity: z.number(),
      unitPrice: z.number().optional(),
    })).optional(),
  }),
});

export type SaleAdd = z.infer<typeof SaleAddSchema>;

// ─── Multi-modal capture events (voice / photo / OCR / detection) ────────────

export const VoiceTranscribedSchema = BaseEventSchema.extend({
  type: z.literal(EventType.VOICE_TRANSCRIBED),
  payload: z.object({
    phone: z.string(),
    transcript: z.string(),           // STT output (Hindi / Hinglish / English)
    language: z.string().optional(),
    durationSec: z.number().optional(),
    sttConfidence: z.number().optional(),
    assetId: z.string().optional(),
  }),
});
export type VoiceTranscribed = z.infer<typeof VoiceTranscribedSchema>;

export const MediaReceivedSchema = BaseEventSchema.extend({
  type: z.literal(EventType.MEDIA_RECEIVED),
  payload: z.object({
    phone: z.string().optional(),
    storeId: z.string().optional(),
    kind: z.enum(['image', 'audio', 'video']),
    url: z.string(),
    mimeType: z.string().optional(),
    message_id: z.string().optional(),
  }),
});
export type MediaReceived = z.infer<typeof MediaReceivedSchema>;

export const OcrCompletedSchema = BaseEventSchema.extend({
  type: z.literal(EventType.OCR_COMPLETED),
  payload: z.object({
    assetId: z.string(),
    ocrText: z.string(),
    docType: z.enum(['bill', 'purchase_invoice', 'price_tag', 'shelf_label', 'note', 'unknown']),
    lineItems: z.array(z.object({
      name: z.string(),
      quantity: z.number().optional(),
      unitPrice: z.number().optional(),
      lineTotal: z.number().optional(),
      confidence: z.number().optional(),
    })).optional(),
    total: z.number().optional(),
    vendor: z.string().optional(),
    confidence: z.number(),
  }),
});
export type OcrCompleted = z.infer<typeof OcrCompletedSchema>;

export const DetectionCompletedSchema = BaseEventSchema.extend({
  type: z.literal(EventType.DETECTION_COMPLETED),
  payload: z.object({
    assetId: z.string(),
    detections: z.array(z.object({
      label: z.string(),               // e.g. "maggi-packet", "shelf", "person"
      box: z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() }),
      confidence: z.number(),
      matchedSku: z.string().optional(), // resolved against store catalog
      count: z.number().optional(),
    })),
    scene: z.string().optional(),        // e.g. "shelf", "counter", "stock_room"
    confidence: z.number(),
  }),
});
export type DetectionCompleted = z.infer<typeof DetectionCompletedSchema>;

// ─── Inventory & business management events ──────────────────────────────────

export const InventoryIntentSchema = BaseEventSchema.extend({
  type: z.literal(EventType.INVENTORY_INTENT),
  payload: z.object({
    storeId: z.string(),
    intent: z.enum([
      'ADD_PRODUCT', 'EDIT_PRICE', 'EDIT_PRODUCT', 'STOCK_IN', 'STOCK_OUT',
      'ADJUST_STOCK', 'ARCHIVE_PRODUCT', 'STOCK_QUERY', 'LOW_STOCK_QUERY',
    ]),
    sku: z.string().optional(),
    productId: z.string().optional(),
    name: z.string().optional(),
    quantity: z.number().optional(),
    price: z.number().optional(),
    fields: z.record(z.any()).optional(),  // arbitrary edit patch
    source: z.enum(['VOICE', 'PHOTO', 'OCR', 'APP', 'WHATSAPP', 'CHAT']).default('CHAT'),
    confidence: z.number().optional(),
    rawText: z.string().optional(),
  }),
});
export type InventoryIntent = z.infer<typeof InventoryIntentSchema>;

export const StockMovedSchema = BaseEventSchema.extend({
  type: z.literal(EventType.STOCK_MOVED),
  payload: z.object({
    storeId: z.string(),
    productId: z.string(),
    sku: z.string(),
    name: z.string(),
    movementType: z.string(),
    delta: z.number(),
    balance: z.number(),
    lowStock: z.boolean(),
    source: z.string(),
    confidence: z.number().optional(),
  }),
});
export type StockMoved = z.infer<typeof StockMovedSchema>;

// ─── Onboarding & knowledge events ───────────────────────────────────────────

export const OnboardStartSchema = BaseEventSchema.extend({
  type: z.literal(EventType.ONBOARD_START),
  payload: z.object({
    phone: z.string(),
    storeName: z.string().optional(),
    templateKey: z.string().optional(),   // skip picker if merchant already said it
  }),
});
export type OnboardStart = z.infer<typeof OnboardStartSchema>;

export const StoreOnboardedSchema = BaseEventSchema.extend({
  type: z.literal(EventType.STORE_ONBOARDED),
  payload: z.object({
    storeId: z.string(),
    phone: z.string(),
    storeName: z.string(),
    templateKey: z.string(),
    productsSeeded: z.number().optional(),
  }),
});
export type StoreOnboarded = z.infer<typeof StoreOnboardedSchema>;

export const KnowledgeCapturedSchema = BaseEventSchema.extend({
  type: z.literal(EventType.KNOWLEDGE_CAPTURED),
  payload: z.object({
    storeId: z.string(),
    kind: z.enum(['policy', 'price_note', 'customer_pref', 'supplier', 'faq', 'transcript', 'recipe', 'other']),
    title: z.string(),
    content: z.string(),
    tags: z.array(z.string()).optional(),
    source: z.enum(['MANUAL', 'VOICE', 'OCR', 'CHAT', 'IMPORT']).default('CHAT'),
  }),
});
export type KnowledgeCaptured = z.infer<typeof KnowledgeCapturedSchema>;
