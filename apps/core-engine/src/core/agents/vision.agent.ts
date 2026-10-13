/**
 * VisionAgent — shelf / product photo object detection + annotation.
 *
 * Pipeline (internal agent, no MCP):
 *   image → detector provider (injected; YOLO-family or vision LLM) → raw boxes
 *        → label→SKU matching against the store catalog
 *        → DETECTION_COMPLETED event (InventoryAgent adjusts counts)
 *        → auto-annotations persisted on the MediaAsset
 */

import { Job } from 'bull';
import { PrismaClient } from '@prisma/client';
import { EventRouter } from '../events/event-router';
import { BaseEvent, EventType, EventSource } from '../events/types';

export interface DetectionProvider {
  detect(imageUrl: string): Promise<{
    scene?: string;
    objects: Array<{
      label: string;                                  // model-level label
      box: { x: number; y: number; w: number; h: number }; // normalized 0..1
      confidence: number;
    }>;
  }>;
}

const MIN_DET_CONFIDENCE = 0.5;

export class VisionAgent {
  constructor(
    private prisma: PrismaClient,
    private eventRouter: EventRouter,
    private detector: DetectionProvider | null,
  ) {}

  async process(job: Job<BaseEvent>): Promise<void> {
    const event = job.data;
    if (event.type !== EventType.MEDIA_RECEIVED || event.payload.kind !== 'image') return;
    if (!this.detector) {
      console.warn('VisionAgent: no detector provider configured; skipping', event.payload.url);
      return;
    }

    const { url, phone, storeId } = event.payload as { url: string; phone?: string; storeId?: string };
    const resolvedStoreId = storeId ?? await this.storeIdForPhone(phone);

    const result = await this.detector.detect(url);
    const objects = (result.objects ?? []).filter((o) => o.confidence >= MIN_DET_CONFIDENCE);

    // Group identical labels → counts (e.g. 7x "maggi-packet")
    const grouped = new Map<string, typeof objects>();
    for (const o of objects) {
      const list = grouped.get(o.label) ?? [];
      list.push(o);
      grouped.set(o.label, list);
    }

    // Match labels to this store's catalog (name fuzzy match)
    const products = resolvedStoreId
      ? await this.prisma.product.findMany({ where: { storeId: resolvedStoreId, isActive: true } })
      : [];

    const detections = [...grouped.entries()].map(([label, objs]) => ({
      label,
      box: objs[0].box,
      confidence: Math.max(...objs.map((o) => o.confidence)),
      count: objs.length,
      matchedSku: this.matchSku(label, products)?.sku,
    }));

    const asset = await this.prisma.mediaAsset.create({
      data: {
        storeId: resolvedStoreId ?? '',
        kind: 'image',
        url,
        source: phone ? 'WHATSAPP' : 'APP',
        detections: detections as never,
        confidence: detections.length ? Math.min(...detections.map((d) => d.confidence)) : 0,
        processed: true,
        eventId: event.id,
      },
    });

    await this.eventRouter.route({
      type: EventType.DETECTION_COMPLETED,
      source: EventSource.SYSTEM,
      payload: {
        assetId: asset.id,
        detections,
        scene: result.scene,
        confidence: detections.length ? Math.min(...detections.map((d) => d.confidence)) : 0,
        storeId: resolvedStoreId,
        phone,
      },
      metadata: { parentEventId: event.id },
    });
  }

  /** "maggi-packet" → Product whose name/sku loosely matches. */
  private matchSku(
    label: string,
    products: Array<{ sku: string; name: string }>,
  ): { sku: string; name: string } | null {
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const target = norm(label);
    let best: { sku: string; name: string } | null = null;
    let bestScore = 0;

    for (const p of products) {
      const pn = norm(p.name), ps = norm(p.sku);
      let score = 0;
      if (ps === target || pn === target) score = 1;
      else if (pn.includes(target) || target.includes(pn)) score = 0.8;
      else if (ps.includes(target) || target.includes(ps)) score = 0.7;
      if (score > bestScore) { bestScore = score; best = p; }
    }
    return bestScore >= 0.7 ? best : null;
  }

  private async storeIdForPhone(phone?: string): Promise<string | null> {
    if (!phone) return null;
    const store = await this.prisma.store.findFirst({ where: { phone } });
    return store?.id ?? null;
  }
}
