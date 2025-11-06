/**
 * API Axios Module - Public API
 * 
 * Main entry point for the api-axios module.
 * 
 * @module api-axios
 */

export { ApiAxiosService, apiAxiosService } from './api-axios-service';
export type {
  ApiRequestConfig,
  ApiResponse,
  ApiError,
  HttpMethod,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor
} from './interfaces';
export { default as ApiAxiosModule } from './module';
