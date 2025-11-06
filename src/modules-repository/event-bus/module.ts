/**
 * Event Bus Module for KIMU-Core
 * 
 * Provides global event bus for component communication.
 * 
 * @module EventBusModule
 */

import { KimuModule } from '../../core/kimu-module';
import { eventBusService } from './event-bus-service';

/**
 * EventBusModule - Module class for event bus integration
 */
export default class EventBusModule extends KimuModule {
  constructor(name = 'event-bus', version = '1.0.0', options?: any) {
    super(name, version, options);
  }

  /**
   * Get the event bus service instance
   */
  getService() {
    return eventBusService;
  }
}

// Re-export for convenience
export { eventBusService } from './event-bus-service';
export { EventBusService } from './event-bus-service';
