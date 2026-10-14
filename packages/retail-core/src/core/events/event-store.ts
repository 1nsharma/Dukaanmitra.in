import { PrismaClient } from '@prisma/client';
import { BaseEvent, EventStatus } from './types';

export class EventStore {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async save(event: BaseEvent): Promise<BaseEvent> {
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
  }

  async updateStatus(eventId: string, status: EventStatus): Promise<void> {
    await this.prisma.event.update({
      where: { id: eventId },
      data: { status },
    });
  }

  async getById(eventId: string): Promise<BaseEvent | null> {
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
  }

  async getByType(type: string, limit: number = 100): Promise<BaseEvent[]> {
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
  }
}
