/**
 * VoiceAgent — converts voice notes into business actions.
 *
 * Pipeline (all internal, no MCP):
 *   audio → STT provider (whisper-family / bhashini for hi-IN) → transcript
 *        → VOICE_TRANSCRIBED event (bill text reuses BillParserAgent)
 *        → intent classification for inventory/knowledge commands
 *
 * The provider is injected so this repo stays provider-agnostic; without a
 * configured provider the agent emits nothing and logs clearly.
 */

import { Job } from 'bull';
import { PrismaClient } from '@prisma/client';
import { EventRouter } from '../events/event-router';
import { BaseEvent, EventType, EventSource } from '../events/types';

export interface SttProvider {
  transcribe(audioUrl: string, languageHint?: string): Promise<{
    transcript: string;
    language: string;
    confidence: number;
  }>;
}

interface VoiceCommand {
  intent: string;
  skuHint?: string;
  quantity?: number;
  price?: number;
}

/**
 * Deterministic first-pass command grammar for Hinglish/English voice notes.
 * LLM fallback can be layered on top when transcript doesn't match — but core
 * state changes always go through InventoryService with confidence scores.
 */
export function classifyVoiceCommand(transcript: string): VoiceCommand | null {
  const t = transcript.toLowerCase();

  const qtyMatch = t.match(/(\d+(?:\.\d+)?)\s*(kilo|kg|gram|litre|liter|l|piece|pcs|packet|pocket|dozen|bottle|)?/);
  const priceMatch = t.match(/(?:₹|rs\.?|rupye?|rupees?|rate|price|ke daam|daam)\s*(\d+(?:,\d+)?)/)
    ?? t.match(/(\d+(?:,\d+)?)\s*(?:ka|rs|₹)\s*(?:rate|daam|price)/);

  const quantity = qtyMatch ? parseFloat(qtyMatch[1]) : undefined;
  const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : undefined;

  // Stock in: "5 kilo atta aa gaya", "add 10 sugar packets", "stock mein daalo"
  if (/(aa gaya|aaya hai|arrived|stock in|add .* stock|daal do|daali|purchase|maal aaya)/.test(t)) {
    return { intent: 'STOCK_IN', quantity, price, skuHint: extractItemName(t) };
  }
  // Stock out / sold: "2 packet Maggi bech diya"
  if (/(bech diya|sold|nikal do|ghata do|stock out|deduct)/.test(t)) {
    return { intent: 'STOCK_OUT', quantity, price, skuHint: extractItemName(t) };
  }
  // Set price: "Maggi ka rate 40 kar do"
  if (price !== undefined && /(rate|daam|price|kar do|set)/.test(t)) {
    return { intent: 'EDIT_PRICE', price, skuHint: extractItemName(t) };
  }
  // New item: "naya item add karo Maggi masala 12 rupees"
  if (/(naya item|new item|add item|add karo)/.test(t)) {
    return { intent: 'ADD_PRODUCT', quantity, price, skuHint: extractItemName(t) };
  }
  // Queries
  if ((/(kitna baka|kitna bacha|stock|inventory|bacha hua)/.test(t))) {
    return { intent: 'STOCK_QUERY', skuHint: extractItemName(t) };
  }
  if (/(kam ho gaya|low stock|khatam)/.test(t)) {
    return { intent: 'LOW_STOCK_QUERY' };
  }
  return null;
}

function extractItemName(t: string): string | undefined {
  // strip verbs/numbers, keep the middle noun phrase heuristically
  const cleaned = t
    .replace(/\d+(\.\d+)?/g, ' ')
    .replace(/(kilo|kg|gram|litre|liter|piece|pcs|packet|dozen|bottle|ka|ki|ke|mein|ko|se|ne|ek|two|teen|char|paanch)\b/g, ' ')
    .replace(/(aa gaya|aaya hai|arrived|stock in|add|daal do|daali|purchase|maal|bech diya|sold|nikal do|ghata do|deduct|rate|daam|price|kar do|set|naya item|new item|kitna|bacha|inventory|low|khatam|ho gaya|query)/g, ' ')
    .replace(/[^a-z\s-]/g, ' ')
    .trim();
  return cleaned.length >= 3 ? cleaned.replace(/\s+/g, '-') : undefined;
}

export class VoiceAgent {
  constructor(
    private prisma: PrismaClient,
    private eventRouter: EventRouter,
    private stt: SttProvider | null,
  ) {}

  async process(job: Job<BaseEvent>): Promise<void> {
    const event = job.data;
    if (event.type !== EventType.MEDIA_RECEIVED || event.payload.kind !== 'audio') return;

    if (!this.stt) {
      console.warn('VoiceAgent: no STT provider configured; skipping media asset', event.payload.url);
      return;
    }

    const { url, phone, storeId } = event.payload as { url: string; phone?: string; storeId?: string };
    const result = await this.stt.transcribe(url, 'hi');

    const asset = storeId ? await this.prisma.mediaAsset.create({
      data: {
        storeId, kind: 'audio', url, source: 'VOICE_NOTE',
        transcript: result.transcript, confidence: result.confidence, processed: true,
        eventId: event.id,
      },
    }) : null;

    // 1) Emit transcription as a first-class event (BillParser handles bill-like text)
    await this.eventRouter.route({
      type: EventType.VOICE_TRANSCRIBED,
      source: EventSource.VOICE,
      payload: {
        phone: phone ?? '',
        transcript: result.transcript,
        language: result.language,
        sttConfidence: result.confidence,
        assetId: asset?.id,
        storeId,
      },
      metadata: { parentEventId: event.id },
    });

    // 2) Merchant-side commands → INVENTORY_INTENT (deterministic grammar first)
    const resolvedStoreId = storeId ?? await this.storeIdForPhone(phone);
    if (resolvedStoreId) {
      const cmd = classifyVoiceCommand(result.transcript);
      if (cmd) {
        await this.eventRouter.route({
          type: EventType.INVENTORY_INTENT,
          source: EventSource.VOICE,
          payload: {
            storeId: resolvedStoreId,
            intent: cmd.intent,
            sku: cmd.skuHint,
            quantity: cmd.quantity,
            price: cmd.price,
            source: 'VOICE',
            confidence: result.confidence,
            rawText: result.transcript,
          },
          metadata: { parentEventId: event.id },
        });
      } else {
        // Not a command → treat useful speech as store knowledge
        await this.eventRouter.route({
          type: EventType.KNOWLEDGE_CAPTURED,
          source: EventSource.VOICE,
          payload: {
            storeId: resolvedStoreId,
            kind: 'transcript',
            title: `Voice note ${new Date().toLocaleDateString('en-IN')}`,
            content: result.transcript,
            source: 'VOICE',
          },
          metadata: { parentEventId: event.id },
        });
      }
    }
  }

  private async storeIdForPhone(phone?: string): Promise<string | null> {
    if (!phone) return null;
    const store = await this.prisma.store.findFirst({ where: { phone } });
    return store?.id ?? null;
  }
}
