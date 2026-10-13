import Queue from 'bull';
import { BaseEvent, EventType, EventStatus } from './types';
import { EventStore } from './event-store';

export interface IQueue {
  name?: string;
  process(handler: (job: Queue.Job<BaseEvent>) => Promise<void>): void;
  add(data: BaseEvent, opts?: { jobId?: string }): Promise<any>;
  close(): Promise<void>;
}

export class InMemoryQueue implements IQueue {
  private handlers: Array<(job: Queue.Job<BaseEvent>) => Promise<void>> = [];

  constructor(public name: string) {}

  process(handler: (job: Queue.Job<BaseEvent>) => Promise<void>): void {
    this.handlers.push(handler);
  }

  async add(data: BaseEvent, opts?: { jobId?: string }): Promise<any> {
    const job = { id: opts?.jobId || String(Date.now()), data };
    setImmediate(async () => {
      for (const handler of this.handlers) {
        try {
          await handler(job as unknown as Queue.Job<BaseEvent>);
        } catch (err) {
          console.error(`[InMemoryQueue:${this.name}] Handler error:`, err);
        }
      }
    });
    return job;
  }

  async close(): Promise<void> {
    this.handlers = [];
  }
}

export class EventRouter {
  private queues: Map<string, IQueue>;
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

    const useMemory = !this.redisUrl || this.redisUrl === 'memory' || process.env.QUEUE_MODE === 'memory';

    for (const name of queueNames) {
      if (useMemory) {
        this.queues.set(name, new InMemoryQueue(name));
      } else {
        try {
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
          queue.on('error', (_err) => {
            // Quietly absorb Redis connection retry errors when Redis is not running
          });
          this.queues.set(name, queue as unknown as IQueue);
        } catch {
          this.queues.set(name, new InMemoryQueue(name));
        }
      }
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

      // Multi-modal capture channels (voice / photo / OCR / vision)
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

      // Inventory & onboarding workflows
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

  getQueue(name: string): IQueue | undefined {
    return this.queues.get(name);
  }

  async close(): Promise<void> {
    for (const queue of this.queues.values()) {
      await queue.close();
    }
  }
}