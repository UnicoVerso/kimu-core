/**
 * KIMU API Core Service
 * Lightweight HTTP client based on native fetch API
 * Zero dependencies, Promise-based, TypeScript-first
 */

import {
  ApiRequestOptions,
  ApiResponse,
  ApiError,
  ApiConfig
} from './interfaces';

/**
 * Main API service class for making HTTP requests
 */
export class ApiCoreService {
  private config: ApiConfig = {};

  /**
   * Configure the API service with global settings
   * @param config - Global configuration options
   */
  configure(config: ApiConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Make a GET request
   * @param url - Request URL (relative to baseURL if configured)
   * @param options - Request options
   * @returns Promise with response data
   */
  async get<T = any>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  /**
   * Make a POST request
   * @param url - Request URL
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise with response data
   */
  async post<T = any>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'POST', body: data });
  }

  /**
   * Make a PUT request
   * @param url - Request URL
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise with response data
   */
  async put<T = any>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'PUT', body: data });
  }

  /**
   * Make a PATCH request
   * @param url - Request URL
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise with response data
   */
  async patch<T = any>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'PATCH', body: data });
  }

  /**
   * Make a DELETE request
   * @param url - Request URL
   * @param options - Request options
   * @returns Promise with response data
   */
  async delete<T = any>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  /**
   * Make a generic HTTP request
   * @param url - Request URL
   * @param options - Request options
   * @returns Promise with response data
   */
  async request<T = any>(url: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      // Apply request interceptor if configured
      let finalOptions = options;
      if (this.config.requestInterceptor) {
        finalOptions = await this.config.requestInterceptor(options);
      }

      // Build final URL with baseURL and query params
      const finalUrl = this.buildUrl(url, finalOptions.params);

      // Build headers
      const headers = this.buildHeaders(finalOptions);

      // Build request body
      const body = this.buildBody(finalOptions.body, headers);

      // Setup timeout if specified
      const controller = new AbortController();
      const signal = finalOptions.signal || controller.signal;
      const timeout = finalOptions.timeout || this.config.timeout;
      
      let timeoutId: NodeJS.Timeout | undefined;
      if (timeout) {
        timeoutId = setTimeout(() => controller.abort(), timeout);
      }

      // Make fetch request
      const response = await fetch(finalUrl, {
        method: finalOptions.method || 'GET',
        headers,
        body,
        credentials: finalOptions.credentials,
        cache: finalOptions.cache,
        signal
      });

      // Clear timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Parse response
      const responseData = await this.parseResponse<T>(response, finalOptions.responseType);

      // Build API response object
      let apiResponse: ApiResponse<T> = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        raw: response
      };

      // Apply response interceptor if configured
      if (this.config.responseInterceptor) {
        apiResponse = await this.config.responseInterceptor(apiResponse);
      }

      // Check if response is ok
      if (!response.ok) {
        throw this.createError(
          `HTTP Error ${response.status}: ${response.statusText}`,
          response.status,
          response.statusText,
          responseData
        );
      }

      return apiResponse;

    } catch (error: any) {
      // Create API error
      let apiError: ApiError;
      
      if (error.name === 'AbortError') {
        apiError = this.createError('Request timeout', undefined, undefined, undefined, error);
      } else if (error.message?.includes('HTTP Error')) {
        apiError = error;
      } else {
        apiError = this.createError(
          error.message || 'Network error',
          undefined,
          undefined,
          undefined,
          error
        );
      }

      // Apply error interceptor if configured
      if (this.config.errorInterceptor) {
        apiError = await this.config.errorInterceptor(apiError);
      }

      throw apiError;
    }
  }

  /**
   * Build final URL with baseURL and query parameters
   */
  private buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
    let finalUrl = url;

    // Add baseURL if configured and URL is relative
    if (this.config.baseURL && !url.startsWith('http')) {
      finalUrl = `${this.config.baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
    }

    // Add query parameters
    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + queryString;
    }

    return finalUrl;
  }

  /**
   * Build request headers
   */
  private buildHeaders(options: ApiRequestOptions): HeadersInit {
    const headers: Record<string, string> = {
      ...this.config.headers,
      ...options.headers
    };

    // Auto-add Content-Type for JSON body if not specified
    if (options.body && typeof options.body === 'object' && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  /**
   * Build request body
   */
  private buildBody(body: any, _headers: HeadersInit): BodyInit | undefined {
    if (!body) {
      return undefined;
    }

    // If body is already a string, FormData, Blob, etc., return as-is
    if (typeof body === 'string' || body instanceof FormData || body instanceof Blob) {
      return body;
    }

    // Otherwise, stringify as JSON
    return JSON.stringify(body);
  }

  /**
   * Parse response based on response type
   */
  private async parseResponse<T>(response: Response, responseType?: string): Promise<T> {
    const type = responseType || 'json';

    switch (type) {
      case 'json':
        try {
          return await response.json();
        } catch {
          return null as T;
        }
      case 'text':
        return await response.text() as T;
      case 'blob':
        return await response.blob() as T;
      case 'arraybuffer':
        return await response.arrayBuffer() as T;
      default:
        return await response.json();
    }
  }

  /**
   * Create an API error object
   */
  private createError(
    message: string,
    status?: number,
    statusText?: string,
    data?: any,
    originalError?: Error
  ): ApiError {
    return {
      message,
      status,
      statusText,
      data,
      originalError: originalError || new Error(message)
    };
  }
}

/**
 * Singleton instance of API Core Service
 */
export const apiCoreService = new ApiCoreService();
