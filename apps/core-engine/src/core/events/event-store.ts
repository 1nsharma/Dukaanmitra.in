import { PrismaClient } from '@prisma/client';
import { BaseEvent, EventStatus } from './types';

export class EventStore {
  private prisma?: PrismaClient;
  private memoryEvents: Map<string, BaseEvent> = new Map();

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma;
  }

  async save(event: BaseEvent): Promise<BaseEvent> {
    if (this.prisma && process.env.DB_MODE !== 'memory' && process.env.DATABASE_URL) {
      try {
        const saved = await this.prisma.event.create({
          data: {
            type: event.type,
            source: event.source,
            payload: event.payload,
            metadata: event.metadata || {},
            status: event.status || EventStatus.PENDING,
          },
        });

        return {
          id: saved.id,
          type: saved.type as any,
          source: saved.source as any,
          payload: saved.payload as any,
          metadata: saved.metadata as any,
          status: saved.status as any,
          createdAt: saved.createdAt,
        };
      } catch (_err) {
        // Fall back gracefully to memory store
      }
    }

    const id = event.id || 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const memoryEvent: BaseEvent = {
      ...event,
      id,
      createdAt: new Date(),
      status: event.status || EventStatus.PENDING,
    };
    this.memoryEvents.set(id, memoryEvent);
    return memoryEvent;
  }

  async updateStatus(eventId: string, status: EventStatus): Promise<void> {
    if (this.prisma && process.env.DB_MODE !== 'memory' && process.env.DATABASE_URL) {
      try {
        await this.prisma.event.update({
          where: { id: eventId },
          data: { status },
        });
        return;
      } catch (_err) {
        // Fall back
      }
    }

    const evt = this.memoryEvents.get(eventId);
    if (evt) {
      evt.status = status;
    }
  }

  async getById(eventId: string): Promise<BaseEvent | null> {
    if (this.prisma && process.env.DB_MODE !== 'memory' && process.env.DATABASE_URL) {
      try {
        const event = await this.prisma.event.findUnique({
          where: { id: eventId },
        });

        if (!event) return null;

        return {
          id: event.id,
          type: event.type as any,
          source: event.source as any,
          payload: event.payload as any,
          metadata: event.metadata as any,
          status: event.status as any,
          createdAt: event.createdAt,
        };
      } catch (_err) {
        // Fall back
      }
    }

    return this.memoryEvents.get(eventId) || null;
  }

  async getByType(type: string, limit: number = 100): Promise<BaseEvent[]> {
    if (this.prisma && process.env.DB_MODE !== 'memory' && process.env.DATABASE_URL) {
      try {
        const events = await this.prisma.event.findMany({
          where: { type },
          orderBy: { createdAt: 'desc' },
          take: limit,
        });

        return events.map(event => ({
          id: event.id,
          type: event.type as any,
          source: event.source as any,
          payload: event.payload as any,
          metadata: event.metadata as any,
          status: event.status as any,
          createdAt: event.createdAt,
        }));
      } catch (_err) {
        // Fall back
      }
    }

    return Array.from(this.memoryEvents.values())
      .filter(e => e.type === type)
      .slice(0, limit);
  }
}