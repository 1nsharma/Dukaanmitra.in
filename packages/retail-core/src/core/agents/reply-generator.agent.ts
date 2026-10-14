import { Job } from 'bull';
import { PrismaClient } from '@prisma/client';
import { EventRouter } from '../events/event-router';
import { BaseEvent, EventType, EventSource } from '../events/types';

export class ReplyGeneratorAgent {
  private prisma: PrismaClient;
  private eventRouter: EventRouter;

  constructor(prisma: PrismaClient, eventRouter: EventRouter) {
    this.prisma = prisma;
    this.eventRouter = eventRouter;
  }

  async process(job: Job<BaseEvent>): Promise<void> {
    const event = job.data;

    if (event.type === EventType.STOCK_MOVED) {
      return this.handleStockMoved(event);
    }

    if (event.type === EventType.STORE_ONBOARDED) {
      return this.handleOnboarding(event);
    }

    if (event.type !== EventType.CUSTOMER_UPDATED) {
      return;
    }

    const { phone, totalSales, totalOrders } = event.payload;
    const { saleId, parentEventId } = event.metadata || {};

    if (!saleId) {
      return;
    }

    const sale = await this.prisma.sale.findUnique({
      where: { id: saleId },
    });

    if (!sale || sale.source !== EventSource.WHATSAPP) {
      return;
    }

    const confidence = sale.confidence || 0.7;
    const message = this.generateReply(sale.amount, sale.mode, confidence, totalSales, totalOrders);

    await this.eventRouter.route({
      type: EventType.OUTBOUND_MESSAGE_READY,
      source: EventSource.SYSTEM,
      payload: {
        phone,
        message,
        confidence,
      },
      metadata: {
        parentEventId,
        saleId,
      },
    });
  }

  private generateReply(
    amount: number,
    mode: string,
    confidence: number,
    totalSales: number,
    totalOrders: number
  ): string {
    let reply = '';

    if (confidence < 0.8) {
      reply = `Mujhe lag raha hai ₹${amount.toFixed(2)} ka bill hai`;
      if (mode !== 'UNKNOWN') {
        reply += ` (${mode})`;
      }
      reply += '. Agar galat ho to bata dena 🙏';
    } else {
      reply = `✅ ₹${amount.toFixed(2)} ka bill save kar liya`;
      if (mode !== 'UNKNOWN') {
        reply += ` (${mode})`;
      }
    }

    if (totalOrders > 1) {
      const avgOrderValue = totalSales / totalOrders;
      reply += `\n\n📊 Aap tak total ${totalOrders} orders kar chuke hain (₹${totalSales.toFixed(2)})`;
      
      if (totalOrders >= 5 && avgOrderValue > 0) {
        reply += `\nAverage order: ₹${avgOrderValue.toFixed(2)}`;
      }
    }

    if (totalOrders === 1) {
      reply += '\n\n🎉 Pehla order! Dhanyavaad 🙏';
    }

    return reply;
  }

  /** Merchant-facing confirmation for stock changes made via any channel. */
  private async handleStockMoved(event: BaseEvent): Promise<void> {
    const p = event.payload as {
      storeId: string; sku: string; name: string; movementType: string;
      balance: number; lowStock: boolean; source: string; confidence?: number; phone?: string;
    };

    const store = await this.prisma.store.findUnique({ where: { id: p.storeId } });
    if (!store) return;

    const soft = (p.confidence ?? 1) < 0.8;
    const typeLabel: Record<string, string> = {
      PURCHASE_IN: 'stock mein add', SALE_OUT: 'stock se minus', ADJUSTMENT: 'stock update', PRICE_EDIT: 'rate update',
    };

    let message = soft
      ? `Mujhe lag raha hai "${p.name}" ka ${typeLabel[p.movementType] ?? 'update'} ho gaya — ab balance ${p.balance}. Galat ho to bata dena 🙏`
      : `✅ "${p.name}" — ${typeLabel[p.movementType] ?? 'update'} done. Ab stock: ${p.balance}`;

    if (p.lowStock) {
      message += `\n\n⚠️ "${p.name}" kam pad raha hai — reorder kar lijiye.`;
    }

    await this.eventRouter.route({
      type: EventType.OUTBOUND_MESSAGE_READY,
      source: EventSource.SYSTEM,
      payload: { phone: store.phone, message, confidence: p.confidence ?? 1 },
      metadata: { parentEventId: event.id, merchantNotice: true },
    });
  }

  /** Welcome message after UPI-simple onboarding completes. */
  private async handleOnboarding(event: BaseEvent): Promise<void> {
    const p = event.payload as { phone: string; storeName: string; productsSeeded?: number };

    await this.eventRouter.route({
      type: EventType.OUTBOUND_MESSAGE_READY,
      source: EventSource.SYSTEM,
      payload: {
        phone: p.phone,
        message:
          `🎉 Badhaai ho! "${p.storeName}" ready hai — bilkul UPI jaisa easy.\n\n` +
          `📦 Starter inventory${p.productsSeeded ? ` (${p.productsSeeded} items)` : ''} load ho chuki hai — sab edit/add/delete kar sakte hain:\n` +
          `• Voice note bhejiye: "5 kilo atta aa gaya"\n` +
          `• Photo bhejiye: bill / purchase invoice / shelf ki photo\n` +
          `• Ya app mein type kariye\n\n` +
          `Kuch bhi galat lage to bas bata dijiye, main sudhar dunga 🙏`,
        confidence: 1,
      },
      metadata: { parentEventId: event.id },
    });
  }
}
