import Queue from 'bull';
import { BaseEvent, EventType, EventStatus } from './types';
import { EventStore } from './event-store';

export class EventRouter {
  private queues: Map<string, Queue.Queue>;
  private eventStore: EventStore;
  private redisUrl: string;

  constructor(eventStore: EventStore, redisUrl: string) {
    this.eventStore = eventStore;
    this.redisUrl = redisUrl;
    this.queues = new Map();
    this.initializeQueues();
  }

  private initializeQueues() {
    const queueNames = [
      'bill_parser',
      'customer_intelligence',
      'reply_generator',
      'whatsapp_sender',
      // Multi-modal capture agents (voice / photo / OCR / detection)
      'voice_agent',
      'ocr_agent',
      'vision_agent',
      // Business management agents
      'inventory_agent',
      'onboarding_agent',
      'knowledge_agent',
    ];

    for (const name of queueNames) {
      const queue = new Queue(name, this.redisUrl, {
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      });

      this.queues.set(name, queue);
    }
  }

  async route(event: BaseEvent): Promise<void> {
    const savedEvent = await this.eventStore.save(event);

    switch (event.type) {
      case EventType.WHATSAPP_MESSAGE_RECEIVED:
        await this.enqueue('bill_parser', savedEvent);
        break;

      case EventType.BILL_PARSED:
        await this.enqueue('customer_intelligence', savedEvent);
        break;

      case EventType.CUSTOMER_UPDATED:
        await this.enqueue('reply_generator', savedEvent);
        break;

      case EventType.OUTBOUND_MESSAGE_READY:
        await this.enqueue('whatsapp_sender', savedEvent);
        break;

      case EventType.SALE_ADD:
        await this.enqueue('customer_intelligence', savedEvent);
        break;

      // ── Multi-modal capture channels (voice / photo / OCR / vision) ──
      case EventType.VOICE_TRANSCRIBED:
        await this.enqueue('bill_parser', savedEvent);
        break;

      case EventType.MEDIA_RECEIVED:
        // media goes to OCR (documents/bills) and vision (shelf/product photos) in parallel
        await this.enqueue('ocr_agent', savedEvent);
        await this.enqueue('vision_agent', savedEvent);
        break;

      case EventType.OCR_COMPLETED:
        await this.enqueue('inventory_agent', savedEvent);
        break;

      case EventType.DETECTION_COMPLETED:
        await this.enqueue('inventory_agent', savedEvent);
        break;

      // ── Inventory & onboarding workflows ──
      case EventType.INVENTORY_INTENT:
        await this.enqueue('inventory_agent', savedEvent);
        break;

      case EventType.STOCK_MOVED:
        await this.enqueue('reply_generator', savedEvent);
        break;

      case EventType.ONBOARD_START:
        await this.enqueue('onboarding_agent', savedEvent);
        break;

      case EventType.STORE_ONBOARDED:
        await this.enqueue('inventory_agent', savedEvent); // seed template inventory
        await this.enqueue('reply_generator', savedEvent);
        break;

      case EventType.KNOWLEDGE_CAPTURED:
        await this.enqueue('knowledge_agent', savedEvent);
        break;

      default:
        console.warn(`No route defined for event type: ${event.type}`);
    }
  }

  async enqueue(queueName: string, event: BaseEvent): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.add(event, {
      jobId: event.id,
    });

    if (event.id) {
      await this.eventStore.updateStatus(event.id, EventStatus.PROCESSING);
    }
  }

  getQueue(name: string): Queue.Queue | undefined {
    return this.queues.get(name);
  }

  async close(): Promise<void> {
    for (const queue of this.queues.values()) {
      await queue.close();
    }
  }
}
