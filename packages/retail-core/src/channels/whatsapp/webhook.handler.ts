import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { EventRouter } from '../../core/events/event-router';
import { EventType, EventSource } from '../../core/events/types';

export class WhatsAppWebhookHandler {
  private prisma: PrismaClient;
  private eventRouter: EventRouter;
  private verifyToken: string;

  constructor(prisma: PrismaClient, eventRouter: EventRouter, verifyToken: string) {
    this.prisma = prisma;
    this.eventRouter = eventRouter;
    this.verifyToken = verifyToken;
  }

  async handleVerification(req: Request, res: Response): Promise<void> {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === this.verifyToken) {
      console.log('Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      console.error('Webhook verification failed');
      res.sendStatus(403);
    }
  }

  async handleIncoming(req: Request, res: Response): Promise<void> {
    const body = req.body;

    if (body.object !== 'whatsapp_business_account') {
      res.sendStatus(404);
      return;
    }

    try {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field !== 'messages') continue;

          const value = change.value;
          
          for (const message of value.messages || []) {
            await this.processMessage(message, value);
          }
        }
      }

      res.sendStatus(200);
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.sendStatus(500);
    }
  }

  private async processMessage(message: any, value: any): Promise<void> {
    const messageId = message.id;
    const phone = message.from;
    const messageType = message.type;

    const existing = await this.prisma.whatsAppMessage.findUnique({
      where: { messageId },
    });

    if (existing) {
      console.log(`Message ${messageId} already processed`);
      return;
    }

    await this.prisma.whatsAppMessage.create({
      data: {
        messageId,
        phone,
        direction: 'INBOUND',
        content: this.extractContent(message, messageType),
        contentType: messageType,
        status: 'RECEIVED',
      },
    });

    // Media messages (photo / voice note) go through the multi-modal pipeline:
    // MEDIA_RECEIVED → OcrAgent + VisionAgent (image) / VoiceAgent (audio).
    if (messageType === 'image' || messageType === 'audio' || messageType === 'video') {
      const mediaObj = message[messageType] ?? {};
      await this.eventRouter.route({
        type: EventType.MEDIA_RECEIVED,
        source: EventSource.WHATSAPP,
        payload: {
          phone,
          kind: messageType === 'audio' ? 'audio' : 'image',
          url: mediaObj.id ?? '',              // provider media id; resolved to URL by the agent's provider
          mimeType: mediaObj.mime_type,
          message_id: messageId,
        },
      });
      return;
    }

    await this.eventRouter.route({
      type: EventType.WHATSAPP_MESSAGE_RECEIVED,
      source: EventSource.WHATSAPP,
      payload: {
        phone,
        message: this.extractContent(message, messageType),
        image: messageType === 'image' ? message.image?.id : undefined,
        message_id: messageId,
      },
    });
  }

  private extractContent(message: any, type: string): string {
    switch (type) {
      case 'text':
        return message.text?.body || '';
      case 'image':
        return message.image?.caption || '[Image]';
      case 'audio':
        return message.audio?.voice ? '[Voice note]' : '[Audio]';
      case 'document':
        return message.document?.filename || '[Document]';
      default:
        return `[${type}]`;
    }
  }
}
