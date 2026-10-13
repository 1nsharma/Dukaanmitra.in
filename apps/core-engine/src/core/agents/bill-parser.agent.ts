import { Job } from 'bull';
import { PrismaClient } from '@prisma/client';
import { EventRouter } from '../events/event-router';
import { BaseEvent, EventType, EventSource, WhatsAppMessageReceived } from '../events/types';

export class BillParserAgent {
  private prisma: PrismaClient;
  private eventRouter: EventRouter;

  constructor(prisma: PrismaClient, eventRouter: EventRouter) {
    this.prisma = prisma;
    this.eventRouter = eventRouter;
  }

  async process(job: Job<BaseEvent>): Promise<void> {
    const event = job.data;

    if (event.type !== EventType.WHATSAPP_MESSAGE_RECEIVED) {
      return;
    }

    const { phone, message, message_id } = event.payload;

    const parsedBill = this.parseBillFromText(message);

    if (parsedBill) {
      await this.eventRouter.route({
        type: EventType.BILL_PARSED,
        source: EventSource.WHATSAPP,
        payload: {
          amount: parsedBill.amount,
          mode: parsedBill.mode,
          confidence: parsedBill.confidence,
          phone: phone,
          originalMessageId: message_id,
        },
        metadata: {
          parentEventId: event.id,
        },
      });
    } else {
      console.log(`Could not parse bill from message: ${message}`);
    }
  }

  public parseBillFromText(text: string): { amount: number; mode: string; confidence: number } | null {
    const amountRegex = /(?:₹|rs\.?|rupees?)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i;
    const match = text.match(amountRegex);

    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      
      let mode = 'UNKNOWN';
      let confidence = 0.7;

      const lowerText = text.toLowerCase();
      if (lowerText.includes('cash')) {
        mode = 'CASH';
        confidence = 0.85;
      } else if (lowerText.includes('upi') || lowerText.includes('online')) {
        mode = 'UPI';
        confidence = 0.85;
      } else if (lowerText.includes('card')) {
        mode = 'CARD';
        confidence = 0.85;
      }

      if (lowerText.includes('sale') || lowerText.includes('sold') || lowerText.includes('payment')) {
        confidence += 0.1;
      }

      return {
        amount,
        mode,
        confidence: Math.min(confidence, 0.95),
      };
    }

    return null;
  }
}
