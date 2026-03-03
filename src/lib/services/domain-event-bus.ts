
'use client';

/**
 * DomainEventBus: Decouples the Deterministic Core from side-effects.
 * Enables AI triggers, notifications, and analytics without bloating 
 * domain services.
 */

type DomainEvent = 
  | 'ledger.entry.created'
  | 'shop.status.updated'
  | 'auth.role.updated'
  | 'customer.created';

type Callback = (payload: any) => void;

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

  emit(event: DomainEvent, payload: any) {
    console.log(`[DomainEventBus] Emitting: ${event}`, payload);
    this.listeners.get(event)?.forEach(cb => cb(payload));
  }
}

export const eventBus = DomainEventBus.getInstance();
