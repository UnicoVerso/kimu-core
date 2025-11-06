/**
 * KIMU API Core Module
 * Entry point for the API Core module
 */

import { KimuModule } from '../../core/kimu-module';
import { apiCoreService } from './api-core-service';

/**
 * API Core Module Class
 * Provides HTTP client functionality based on native fetch API
 */
export default class ApiCoreModule extends KimuModule {
  constructor(name = 'api-core', version = '1.0.0', options?: any) {
    super(name, version, options);
  }

  /**
   * Get the API Core service instance
   * @returns ApiCoreService singleton instance
   */
  getService() {
    return apiCoreService;
  }
}

// Re-export for convenience
export { apiCoreService } from './api-core-service';
export { ApiCoreService } from './api-core-service';
export * from './interfaces';
