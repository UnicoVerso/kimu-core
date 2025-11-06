/**
 * HTTP method types supported by the API service
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Configuration options for HTTP requests
 */
export interface ApiRequestConfig {
  /** HTTP headers to include in the request */
  headers?: Record<string, string>;
  /** Query parameters to append to the URL */
  params?: Record<string, string | number | boolean>;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Whether to include credentials (cookies) in the request */
  withCredentials?: boolean;
  /** Response type expected from the server */
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  /** Callback for upload progress */
  onUploadProgress?: (progressEvent: ProgressEvent) => void;
  /** Callback for download progress */
  onDownloadProgress?: (progressEvent: ProgressEvent) => void;
  /** Custom axios config to merge */
  axiosConfig?: any;
}

/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
  /** Response data from the server */
  data: T;
  /** HTTP status code */
  status: number;
  /** HTTP status text */
  statusText: string;
  /** Response headers */
  headers: Record<string, string>;
  /** Original request configuration */
  config: ApiRequestConfig;
}

/**
 * Error response structure for failed requests
 */
export interface ApiError {
  /** Error message */
  message: string;
  /** HTTP status code (if available) */
  status?: number;
  /** Response data from the server (if available) */
  data?: any;
  /** Original error object */
  originalError?: any;
}

/**
 * Interceptor function for requests
 */
export type RequestInterceptor = (config: ApiRequestConfig) => ApiRequestConfig | Promise<ApiRequestConfig>;

/**
 * Interceptor function for responses
 */
export type ResponseInterceptor = (response: ApiResponse) => ApiResponse | Promise<ApiResponse>;

/**
 * Interceptor function for errors
 */
export type ErrorInterceptor = (error: ApiError) => any;
