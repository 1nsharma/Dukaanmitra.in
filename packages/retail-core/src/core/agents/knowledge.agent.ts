/**
 * KnowledgeAgent — the store's memory.
 *
 * Captures everything the AI learns about a shop into KnowledgeDoc rows:
 * voice transcripts, OCR'd notes, supplier terms, customer preferences,
 * pricing policies, FAQs. Later used for retrieval-augmented replies.
 *
 * Internal in-process agent — not an MCP server.
 */

import { Job } from 'bull';
import { PrismaClient } from '@prisma/client';
import { EventRouter } from '../events/event-router';
import { BaseEvent, EventType } from '../events/types';

export class KnowledgeAgent {
  constructor(private prisma: PrismaClient, private eventRouter: EventRouter) {}

  async process(job: Job<BaseEvent>): Promise<void> {
    const event = job.data;
    if (event.type !== EventType.KNOWLEDGE_CAPTURED) return;

    const p = event.payload as {
      storeId: string; kind: string; title: string; content: string;
      tags?: string[]; source?: string;
    };

    // De-duplicate near-identical recent captures (same store+kind+content)
    const dup = await this.prisma.knowledgeDoc.findFirst({
      where: { storeId: p.storeId, kind: p.kind, content: p.content },
    });
    if (dup) return;

    await this.prisma.knowledgeDoc.create({
      data: {
        storeId: p.storeId,
        kind: p.kind ?? 'other',
        title: p.title ?? 'Untitled note',
        content: p.content,
        tags: p.tags ?? [],
        source: p.source ?? 'CHAT',
      },
    });
  }
}
