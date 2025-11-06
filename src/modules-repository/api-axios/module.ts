/**
 * API Axios Module
 * 
 * Advanced HTTP client module based on Axios library.
 * Provides enhanced features over the basic api-core module.
 * 
 * @module api-axios
 * @author UnicòVerso
 * @version 1.0.0
 */

import { KimuModule } from '../../core/kimu-module';
import { apiAxiosService } from './api-axios-service';

/**
 * ApiAxiosModule - Module wrapper for the Axios-based API service
 * 
 * This module provides an advanced HTTP client with features like:
 * - Request/response interceptors
 * - Automatic retry logic
 * - Request cancellation
 * - Progress tracking
 * - Response caching
 */
export default class ApiAxiosModule extends KimuModule {
  constructor(name = 'api-axios', version = '1.0.0', options?: any) {
    super(name, version, options);
  }

  /**
   * Returns the singleton instance of the API Axios service
   */
  getService() {
    return apiAxiosService;
  }
}

// Re-export for convenience
export { apiAxiosService } from './api-axios-service';
export { ApiAxiosService } from './api-axios-service';
export * from './interfaces';
