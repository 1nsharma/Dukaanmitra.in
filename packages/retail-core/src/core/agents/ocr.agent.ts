/**
 * OcrAgent — bill / invoice / price-tag photos → structured data.
 *
 * Pipeline (internal agent, no MCP):
 *   image → OCR provider (tesseract/GCV/LLM-vision; injected) → raw text
 *        → deterministic document classifier + line-item parser
 *        → OCR_COMPLETED event (InventoryAgent applies stock-in for invoices;
 *           BillParser-style totals feed customer flows for bills)
 *
 * Every extraction carries a confidence score; low-confidence results are
 * still stored but phrased softly in replies (existing UX principle).
 */

import { Job } from 'bull';
import { PrismaClient } from '@prisma/client';
import { EventRouter } from '../events/event-router';
import { BaseEvent, EventType, EventSource } from '../events/types';

export interface OcrProvider {
  recognize(imageUrl: string): Promise<{ text: string; confidence: number }>;
}

export interface ParsedLineItem {
  name: string;
  quantity?: number;
  unitPrice?: number;
  lineTotal?: number;
  confidence: number;
}

/** Deterministic doc-type classification from OCR text. */
export function classifyDocType(text: string): 'bill' | 'purchase_invoice' | 'price_tag' | 'shelf_label' | 'note' | 'unknown' {
  const t = text.toLowerCase();
  if (/(gst(in)?\s*no|tax invoice|invoice no|supplier)/.test(t)) return 'purchase_invoice';
  if (/(total\b|grand total|amount due|bill to)/.test(t) && /(date|item|qty)/.test(t)) return 'bill';
  if (/^(.{0,30})₹?\s?\d{1,6}$/m.test(t) && t.split('\n').length <= 3) return 'price_tag';
  if (/(mrp|best before|batch)/.test(t)) return 'shelf_label';
  if (t.trim().length > 0) return 'note';
  return 'unknown';
}

/** Parse "2 Maggi 14 28" style lines: qty, name, rate, total. */
export function parseLineItems(text: string): ParsedLineItem[] {
  const items: ParsedLineItem[] = [];
  const money = String.raw`(?:₹\s*)?(\d+(?:,\d+)*(?:\.\d{1,2})?)(?:\s*(?:₹|rs\.?))?`;
  const num = (s: string) => parseFloat(s.replace(/,/g, ''));

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || /^(total|grand|subtotal|gst|cgst|sgst|igst|date|invoice|bill)\b/i.test(line)) continue;

    // Pattern A: "<name> <qty> x <rate> = <total>" or "<qty> <name> <rate> <total>"
    let m = line.match(new RegExp(String.raw`^(.+?)\s+(\d+(?:\.\d+)?)\s*[x×*]\s*${money}\s*(?:=)?\s*${money}?`, 'i'));
    if (m) {
      items.push({ name: cleanName(m[1]), quantity: num(m[2]), unitPrice: num(m[3]), lineTotal: m[4] ? num(m[4]) : undefined, confidence: 0.9 });
      continue;
    }
    m = line.match(new RegExp(String.raw`^(\d+(?:\.\d+)?)\s+(.+?)\s+${money}\s+${money}$`, 'i'));
    if (m) {
      items.push({ name: cleanName(m[2]), quantity: num(m[1]), unitPrice: num(m[3]), lineTotal: num(m[4]), confidence: 0.85 });
      continue;
    }
    // Pattern B: "<name> ... ₹xx" single amount (treat as line total)
    m = line.match(new RegExp(String.raw`^(.+?)\s+${money}$`, 'i'));
    if (m && /[a-zA-Z\u0900-\u097F]/.test(m[1])) {
      items.push({ name: cleanName(m[1]), lineTotal: num(m[2]), quantity: 1, unitPrice: num(m[2]), confidence: 0.6 });
    }
  }
  return items;
}

function cleanName(s: string): string {
  return s.replace(/[^\w\s.&\u0900-\u097F-]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function extractTotal(text: string): number | undefined {
  const m = text.match(/(?:grand\s*total|total(?:\s*amount)?|amount\s*due)\D{0,10}(\d[\d,]*(?:\.\d{1,2})?)/i);
  return m ? parseFloat(m[1].replace(/,/g, '')) : undefined;
}

export function extractVendor(text: string): string | undefined {
  const first = text.split(/\r?\n/).map((l) => l.trim()).find((l) => l.length > 3);
  return first;
}

export class OcrAgent {
  constructor(
    private prisma: PrismaClient,
    private eventRouter: EventRouter,
    private ocr: OcrProvider | null,
  ) {}

  async process(job: Job<BaseEvent>): Promise<void> {
    const event = job.data;
    if (event.type !== EventType.MEDIA_RECEIVED || event.payload.kind !== 'image') return;
    if (!this.ocr) {
      console.warn('OcrAgent: no OCR provider configured; skipping', event.payload.url);
      return;
    }

    const { url, phone, storeId } = event.payload as { url: string; phone?: string; storeId?: string };
    const resolvedStoreId = storeId ?? await this.storeIdForPhone(phone);

    const result = await this.ocr.recognize(url);
    const docType = classifyDocType(result.text);
    const lineItems = ['bill', 'purchase_invoice', 'price_tag'].includes(docType) ? parseLineItems(result.text) : [];
    const total = extractTotal(result.text);

    const asset = await this.prisma.mediaAsset.create({
      data: {
        storeId: resolvedStoreId ?? '',
        kind: 'image',
        url,
        source: phone ? 'WHATSAPP' : 'APP',
        ocrText: result.text,
        parsed: { docType, lineItems, total } as never,
        confidence: result.confidence,
        processed: true,
        eventId: event.id,
      },
    });

    await this.eventRouter.route({
      type: EventType.OCR_COMPLETED,
      source: EventSource.SYSTEM,
      payload: {
        assetId: asset.id,
        ocrText: result.text,
        docType,
        lineItems,
        total,
        vendor: extractVendor(result.text),
        confidence: result.confidence,
        storeId: resolvedStoreId,
        phone,
      },
      metadata: { parentEventId: event.id },
    });

    // A customer-facing bill photo also behaves like the old WHATSAPP bill flow
    if ((docType === 'bill') && total !== undefined && phone) {
      await this.eventRouter.route({
        type: EventType.BILL_PARSED,
        source: EventSource.WHATSAPP,
        payload: { amount: total, mode: 'UNKNOWN', confidence: result.confidence, phone },
        metadata: { parentEventId: event.id, fromOcr: true },
      });
    }
  }

  private async storeIdForPhone(phone?: string): Promise<string | null> {
    if (!phone) return null;
    const store = await this.prisma.store.findFirst({ where: { phone } });
    return store?.id ?? null;
  }
}
