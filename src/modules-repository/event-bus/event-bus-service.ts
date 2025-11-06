/**
 * Event Bus Service for KIMU-Core
 * 
 * Provides a global publish/subscribe mechanism for component communication.
 * Components can emit and listen to custom events without direct coupling.
 * 
 * @module EventBusService
 * @version 1.0.0
 */

export type EventCallback = (...args: any[]) => void;

export interface EventSubscription {
  event: string;
  callback: EventCallback;
  unsubscribe: () => void;
}

/**
 * EventBusService - Global event bus for component communication
 * 
 * @example
 * ```typescript
 * import { eventBusService } from './modules/event-bus/event-bus-service';
 * 
 * // Subscribe to an event
 * const subscription = eventBusService.on('user:login', (user) => {
 *   console.log('User logged in:', user);
 * });
 * 
 * // Emit an event
 * eventBusService.emit('user:login', { id: 1, name: 'John' });
 * 
 * // Unsubscribe
 * subscription.unsubscribe();
 * ```
 */
export class EventBusService {
  private events: Map<string, Set<EventCallback>> = new Map();
  private debugMode: boolean = false;

  /**
   * Enable or disable debug mode for event logging
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Subscribe to an event
   * 
   * @param event - Event name (e.g., 'user:login', 'data:updated')
   * @param callback - Function to call when event is emitted
   * @returns Subscription object with unsubscribe method
   */
  on(event: string, callback: EventCallback): EventSubscription {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    
    this.events.get(event)!.add(callback);
    
    if (this.debugMode) {
      console.log(`[EventBus] Subscribed to: ${event}`);
    }

    return {
      event,
      callback,
      unsubscribe: () => this.off(event, callback)
    };
  }

  /**
   * Subscribe to an event only once (auto-unsubscribe after first emit)
   * 
   * @param event - Event name
   * @param callback - Function to call when event is emitted
   * @returns Subscription object
   */
  once(event: string, callback: EventCallback): EventSubscription {
    const wrappedCallback = (...args: any[]) => {
      callback(...args);
      this.off(event, wrappedCallback);
    };

    return this.on(event, wrappedCallback);
  }

  /**
   * Unsubscribe from an event
   * 
   * @param event - Event name
   * @param callback - Callback to remove
   */
  off(event: string, callback: EventCallback): void {
    if (this.events.has(event)) {
      this.events.get(event)!.delete(callback);
      
      // Clean up empty event sets
      if (this.events.get(event)!.size === 0) {
        this.events.delete(event);
      }

      if (this.debugMode) {
        console.log(`[EventBus] Unsubscribed from: ${event}`);
      }
    }
  }

  /**
   * Emit an event to all subscribers
   * 
   * @param event - Event name
   * @param args - Arguments to pass to callbacks
   */
  emit(event: string, ...args: any[]): void {
    if (this.debugMode) {
      console.log(`[EventBus] Emitting: ${event}`, args);
    }

    if (this.events.has(event)) {
      const callbacks = Array.from(this.events.get(event)!);
      callbacks.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`[EventBus] Error in event handler for "${event}":`, error);
        }
      });
    }
  }

  /**
   * Remove all subscribers for a specific event or all events
   * 
   * @param event - Event name (optional, if not provided clears all)
   */
  clear(event?: string): void {
    if (event) {
      this.events.delete(event);
      if (this.debugMode) {
        console.log(`[EventBus] Cleared event: ${event}`);
      }
    } else {
      this.events.clear();
      if (this.debugMode) {
        console.log('[EventBus] Cleared all events');
      }
    }
  }

  /**
   * Get list of all registered events
   */
  getEventList(): string[] {
    return Array.from(this.events.keys());
  }

  /**
   * Get number of subscribers for a specific event
   */
  getSubscriberCount(event: string): number {
    return this.events.get(event)?.size || 0;
  }

  /**
   * Check if an event has any subscribers
   */
  hasSubscribers(event: string): boolean {
    return this.getSubscriberCount(event) > 0;
  }
}

// Export singleton instance
export const eventBusService = new EventBusService();
