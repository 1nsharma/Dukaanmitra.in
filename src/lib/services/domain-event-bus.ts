
'use client';

/**
 * DomainEventBus: Decouples the Deterministic Core from side-effects.
 * Implements a standard Event Envelope for enterprise tracing.
 */

import crypto from 'crypto';

export type DomainEvent = 
  | 'ledger.entry.created'
  | 'shop.status.updated'
  | 'auth.role.updated'
  | 'customer.created';

export interface EventEnvelope {
    eventId: string;
    timestamp: number;
    correlationId: string;
    sourceModule: string;
    payload: any;
}

type Callback = (envelope: EventEnvelope) => void;

class DomainEventBus {
  private static instance: DomainEventBus;
  private listeners: Map<DomainEvent, Callback[]> = new Map();

  private constructor() {}

  static getInstance() {
    if (!DomainEventBus.instance) {
      DomainEventBus.instance = new DomainEventBus();
    }
    return DomainEventBus.instance;
  }

  on(event: DomainEvent, callback: Callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  emit(event: DomainEvent, sourceModule: string, payload: any, correlationId: string = crypto.randomUUID()) {
    const envelope: EventEnvelope = {
        eventId: crypto.randomUUID(),
        timestamp: Date.now(),
        correlationId,
        sourceModule,
        payload
    };
    
    console.log(`[DomainEventBus] Emitting: ${event}`, envelope);
    this.listeners.get(event)?.forEach(cb => cb(envelope));
  }
}

export const eventBus = DomainEventBus.getInstance();
