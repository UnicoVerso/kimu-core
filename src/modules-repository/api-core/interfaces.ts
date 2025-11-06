/**
 * KIMU API Core Module - Type Definitions
 * Provides interfaces for HTTP API interactions
 */

/**
 * HTTP methods supported by the API service
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/**
 * Configuration options for API requests
 */
export interface ApiRequestOptions {
  /** HTTP method (default: GET) */
  method?: HttpMethod;
  /** Request headers */
  headers?: Record<string, string>;
  /** Request body (will be JSON stringified if object) */
  body?: any;
  /** Query parameters to append to URL */
  params?: Record<string, string | number | boolean>;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Response type expected */
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  /** Credentials mode for fetch */
  credentials?: RequestCredentials;
  /** Cache mode for fetch */
  cache?: RequestCache;
  /** Abort signal for cancellation */
  signal?: AbortSignal;
}

/**
 * Response structure returned by API calls
 */
export interface ApiResponse<T = any> {
  /** Response data */
  data: T;
  /** HTTP status code */
  status: number;
  /** HTTP status text */
  statusText: string;
  /** Response headers */
  headers: Headers;
  /** Original fetch Response object */
  raw: Response;
}

/**
 * Error structure for failed API calls
 */
export interface ApiError {
  /** Error message */
  message: string;
  /** HTTP status code (if available) */
  status?: number;
  /** HTTP status text (if available) */
  statusText?: string;
  /** Response data (if available) */
  data?: any;
  /** Original error object */
  originalError: Error;
}

/**
 * Global configuration for API service
 */
export interface ApiConfig {
  /** Base URL for all requests */
  baseURL?: string;
  /** Default timeout in milliseconds */
  timeout?: number;
  /** Default headers for all requests */
  headers?: Record<string, string>;
  /** Request interceptor function */
  requestInterceptor?: (config: ApiRequestOptions) => ApiRequestOptions | Promise<ApiRequestOptions>;
  /** Response interceptor function */
  responseInterceptor?: <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>;
  /** Error interceptor function */
  errorInterceptor?: (error: ApiError) => ApiError | Promise<ApiError>;
}
