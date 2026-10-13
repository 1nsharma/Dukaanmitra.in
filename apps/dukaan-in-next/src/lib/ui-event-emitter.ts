'use client';

// A generic type for a callback function.
type Callback<T> = (data: T) => void;

/**
 * Defines the shape of all possible events and their corresponding payload types.
 */
export interface UIEvents {
  'open-chat': void;
  'close-chat': void;
}

/**
 * A strongly-typed pub/sub event emitter.
 */
function createEventEmitter<T extends Record<string, any>>() {
  const events: { [K in keyof T]?: Array<Callback<T[K]>> } = {};

  return {
    on<K extends keyof T>(eventName: K, callback: Callback<T[K]>) {
      if (!events[eventName]) {
        events[eventName] = [];
      }
      events[eventName]?.push(callback);
    },
    off<K extends keyof T>(eventName: K, callback: Callback<T[K]>) {
      if (!events[eventName]) {
        return;
      }
      events[eventName] = events[eventName]?.filter(cb => cb !== callback);
    },
    emit<K extends keyof T>(eventName: K, data?: T[K]) {
      if (!events[eventName]) {
        return;
      }
      // Cast data to any to satisfy the callback signature for void payloads
      events[eventName]?.forEach(callback => callback(data as any));
    },
  };
}

// Create and export a singleton instance of the emitter.
export const uiEmitter = createEventEmitter<UIEvents>();
