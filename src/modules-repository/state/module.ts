/**
 * State Management Module for KIMU-Core
 * 
 * Provides reactive state management with observers.
 * 
 * @module StateModule
 */

import { KimuModule } from '../../core/kimu-module';
import { stateService } from './state-service';

/**
 * StateModule - Module class for state management integration
 */
export default class StateModule extends KimuModule {
  constructor(name = 'state', version = '1.0.0', options?: any) {
    super(name, version, options);
  }

  /**
   * Get the state management service instance
   */
  getService() {
    return stateService;
  }
}

// Re-export for convenience
export { stateService } from './state-service';
export { StateService } from './state-service';
