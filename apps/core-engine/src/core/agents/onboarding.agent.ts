/**
 * OnboardingAgent — UPI-simple merchant onboarding.
 *
 * Flow (all via WhatsApp or the app, no forms):
 *   1. Merchant sends ONBOARD_START (phone verified like a UPI login)
 *   2. Agent replies with business-type choices (pre-generated templates)
 *   3. Merchant picks one by number/voice/photo of their shop board
 *   4. Store is created + starter inventory is seeded (fully editable)
 *   5. STORE_ONBOARDED event → InventoryAgent seeds, ReplyAgent welcomes
 *
 * Internal in-process agent — managed by the core system, not an MCP server.
 */

import { Job } from 'bull';
import { PrismaClient } from '@prisma/client';
import { EventRouter } from '../events/event-router';
import { BaseEvent, EventType, EventSource } from '../events/types';
import { BUSINESS_TEMPLATES, getTemplate } from '../templates/business-templates';

export class OnboardingAgent {
  constructor(private prisma: PrismaClient, private eventRouter: EventRouter) {}

  async process(job: Job<BaseEvent>): Promise<void> {
    const event = job.data;
    if (event.type !== EventType.ONBOARD_START) return;

    const { phone, storeName, templateKey } = event.payload as {
      phone: string; storeName?: string; templateKey?: string;
    };

    // Idempotent: already onboarded?
    const existing = await this.prisma.store.findFirst({ where: { phone } });
    if (existing) {
      await this.eventRouter.route({
        type: EventType.OUTBOUND_MESSAGE_READY,
        source: EventSource.SYSTEM,
        payload: {
          phone,
          message: `Aapki dukaan "${existing.name}" pehle se onboard hai ✅ Ab bill photo bhejiye ya voice note — main sambhal lunga.`,
          confidence: 1,
        },
        metadata: { parentEventId: event.id },
      });
      return;
    }

    // If template unknown, ask for choice (simple numbered list, like UPI app picker)
    const chosen = templateKey ? getTemplate(templateKey) : undefined;
    if (!chosen) {
      const lines = BUSINESS_TEMPLATES.map((t, i) => `${i + 1}. ${t.name}`);
      await this.eventRouter.route({
        type: EventType.OUTBOUND_MESSAGE_READY,
        source: EventSource.SYSTEM,
        payload: {
          phone,
          message:
            `Namaste 🙏 DukaanMitra mein swagat hai!\n\n` +
            (storeName ? `"${storeName}" ke liye — ` : '') +
            `Apni dukaan ka type chuniye (bas number bhejiye, ya bolein):\n\n${lines.join('\n')}\n\n` +
            `Chunne ke baad inventory khud ready ho jayegi — sab kuch edit kar sakte hain. Bilkul UPI jaisa easy!`,
          confidence: 1,
        },
        metadata: { parentEventId: event.id, awaiting: 'TEMPLATE_CHOICE' },
      });
      return;
    }

    await this.createStore(phone, storeName ?? `${chosen.name}`, chosen.key, event);
  }

  /** Called when merchant confirms a template (by number, name, voice, or photo). */
  async confirmTemplate(phone: string, templateKey: string, storeName?: string): Promise<void> {
    const template = getTemplate(templateKey);
    if (!template) throw new Error(`Unknown template: ${templateKey}`);
    await this.createStore(phone, storeName ?? template.name, templateKey, {
      id: undefined, metadata: undefined,
    } as unknown as BaseEvent);
  }

  private async createStore(phone: string, storeName: string, templateKey: string, parent: BaseEvent): Promise<void> {
    const template = getTemplate(templateKey)!;

    const store = await this.prisma.store.create({
      data: {
        name: storeName,
        phone,
        templateId: undefined, // template registry is code-first; DB row optional
        type: template.storeType,
        onboardedAt: new Date(),
        settings: { templateKey, workflows: template.workflows },
      },
    });

    await this.eventRouter.route({
      type: EventType.STORE_ONBOARDED,
      source: EventSource.SYSTEM,
      payload: {
        storeId: store.id,
        phone,
        storeName: store.name,
        templateKey,
        productsSeeded: template.skus.length,
      },
      metadata: { parentEventId: parent?.id },
    });
  }
}
