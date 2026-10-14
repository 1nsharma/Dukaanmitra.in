import { Job } from 'bull';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { BaseEvent, EventType, EventStatus } from '../../core/events/types';
import { EventStore } from '../../core/events/event-store';

export class WhatsAppSender {
  private prisma: PrismaClient;
  private eventStore: EventStore;
  private apiUrl: string;
  private accessToken: string;
  private phoneNumberId: string;

  constructor(
    prisma: PrismaClient,
    eventStore: EventStore,
    apiUrl: string,
    accessToken: string,
    phoneNumberId: string
  ) {
    this.prisma = prisma;
    this.eventStore = eventStore;
    this.apiUrl = apiUrl;
    this.accessToken = accessToken;
    this.phoneNumberId = phoneNumberId;
  }

  async process(job: Job<BaseEvent>): Promise<void> {
    const event = job.data;

    if (event.type !== EventType.OUTBOUND_MESSAGE_READY) {
      return;
    }

    const { phone, message } = event.payload;

    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: {
            body: message,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const messageId = response.data.messages[0].id;

      await this.prisma.whatsAppMessage.create({
        data: {
          messageId,
          phone,
          direction: 'OUTBOUND',
          content: message,
          contentType: 'text',
          status: 'SENT',
          eventId: event.id,
        },
      });

      if (event.id) {
        await this.eventStore.updateStatus(event.id, EventStatus.COMPLETED);
      }

      console.log(`Message sent to ${phone}: ${messageId}`);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      
      if (event.id) {
        await this.eventStore.updateStatus(event.id, EventStatus.FAILED);
      }
      
      throw error;
    }
  }
}
