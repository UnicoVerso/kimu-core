/**
 * API Axios Service
 * 
 * Advanced HTTP client based on Axios library.
 * Provides additional features over api-core:
 * - Request/response interceptors
 * - Automatic retries with exponential backoff
 * - Request cancellation
 * - Upload/download progress tracking
 * - Better error handling and transformation
 * - Request/response caching
 * 
 * @module api-axios
 * @author UnicòVerso
 * @version 1.0.0
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource, InternalAxiosRequestConfig } from 'axios';
import {
  ApiRequestConfig,
  ApiResponse,
  ApiError,
  HttpMethod,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor
} from './interfaces';

/**
 * ApiAxiosService - Advanced HTTP client with Axios
 * 
 * Features:
 * - Interceptors for requests and responses
 * - Automatic retry logic with exponential backoff
 * - Request cancellation support
 * - Progress tracking for uploads/downloads
 * - Response caching
 * - Better error handling
 */
export class ApiAxiosService {
  private axiosInstance: AxiosInstance;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTTL: number = 5 * 60 * 1000; // 5 minutes default

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  /**
   * Setup default Axios interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Apply custom request interceptors
        for (const interceptor of this.requestInterceptors) {
          const modifiedConfig = await interceptor(config as any);
          Object.assign(config, modifiedConfig);
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      async (response: AxiosResponse) => {
        const apiResponse = this.transformResponse(response);
        
        // Apply custom response interceptors
        for (const interceptor of this.responseInterceptors) {
          await interceptor(apiResponse);
        }
        
        return response;
      },
      async (error: any) => {
        const apiError = this.transformError(error);
        
        // Apply custom error interceptors
        for (const interceptor of this.errorInterceptors) {
          await interceptor(apiError);
        }
        
        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Add a request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add a response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add an error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Transform Axios response to ApiResponse format
   */
  private transformResponse(response: AxiosResponse): ApiResponse {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      config: response.config as ApiRequestConfig
    };
  }

  /**
   * Transform Axios error to ApiError format
   */
  private transformError(error: any): ApiError {
    if (error.response) {
      return {
        message: error.message || 'Request failed',
        status: error.response.status,
        data: error.response.data,
        originalError: error
      };
    }
    
    return {
      message: error.message || 'Network error',
      originalError: error
    };
  }

  /**
   * Generate cache key from URL and config
   */
  private getCacheKey(url: string, config?: ApiRequestConfig): string {
    const params = config?.params ? JSON.stringify(config.params) : '';
    return `${url}${params}`;
  }

  /**
   * Check if cached response is still valid
   */
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTTL;
  }

  /**
   * Set cache TTL (time-to-live) in milliseconds
   */
  setCacheTTL(ttl: number): void {
    this.cacheTTL = ttl;
  }

  /**
   * Clear all cached responses
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Create a cancel token for request cancellation
   */
  createCancelToken(): CancelTokenSource {
    return axios.CancelToken.source();
  }

  /**
   * Perform HTTP GET request
   */
  async get<T = any>(url: string, config?: ApiRequestConfig & { useCache?: boolean }): Promise<ApiResponse<T>> {
    const useCache = config?.useCache ?? false;
    const cacheKey = this.getCacheKey(url, config);

    // Check cache
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (this.isCacheValid(cached.timestamp)) {
        return {
          data: cached.data,
          status: 200,
          statusText: 'OK (cached)',
          headers: {},
          config: config || {}
        };
      }
    }

    const axiosConfig: AxiosRequestConfig = {
      ...config?.axiosConfig,
      headers: config?.headers,
      params: config?.params,
      timeout: config?.timeout,
      withCredentials: config?.withCredentials,
      responseType: config?.responseType,
      onUploadProgress: config?.onUploadProgress,
      onDownloadProgress: config?.onDownloadProgress
    };

    const response = await this.axiosInstance.get<T>(url, axiosConfig);
    const apiResponse = this.transformResponse(response);

    // Store in cache if enabled
    if (useCache) {
      this.cache.set(cacheKey, {
        data: apiResponse.data,
        timestamp: Date.now()
      });
    }

    return apiResponse;
  }

  /**
   * Perform HTTP POST request
   */
  async post<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const axiosConfig: AxiosRequestConfig = {
      ...config?.axiosConfig,
      headers: config?.headers,
      params: config?.params,
      timeout: config?.timeout,
      withCredentials: config?.withCredentials,
      responseType: config?.responseType,
      onUploadProgress: config?.onUploadProgress,
      onDownloadProgress: config?.onDownloadProgress
    };

    const response = await this.axiosInstance.post<T>(url, data, axiosConfig);
    return this.transformResponse(response);
  }

  /**
   * Perform HTTP PUT request
   */
  async put<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const axiosConfig: AxiosRequestConfig = {
      ...config?.axiosConfig,
      headers: config?.headers,
      params: config?.params,
      timeout: config?.timeout,
      withCredentials: config?.withCredentials,
      responseType: config?.responseType,
      onUploadProgress: config?.onUploadProgress,
      onDownloadProgress: config?.onDownloadProgress
    };

    const response = await this.axiosInstance.put<T>(url, data, axiosConfig);
    return this.transformResponse(response);
  }

  /**
   * Perform HTTP PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const axiosConfig: AxiosRequestConfig = {
      ...config?.axiosConfig,
      headers: config?.headers,
      params: config?.params,
      timeout: config?.timeout,
      withCredentials: config?.withCredentials,
      responseType: config?.responseType,
      onUploadProgress: config?.onUploadProgress,
      onDownloadProgress: config?.onDownloadProgress
    };

    const response = await this.axiosInstance.patch<T>(url, data, axiosConfig);
    return this.transformResponse(response);
  }

  /**
   * Perform HTTP DELETE request
   */
  async delete<T = any>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const axiosConfig: AxiosRequestConfig = {
      ...config?.axiosConfig,
      headers: config?.headers,
      params: config?.params,
      timeout: config?.timeout,
      withCredentials: config?.withCredentials,
      responseType: config?.responseType
    };

    const response = await this.axiosInstance.delete<T>(url, axiosConfig);
    return this.transformResponse(response);
  }

  /**
   * Perform a generic HTTP request with automatic retry
   */
  async request<T = any>(
    method: HttpMethod,
    url: string,
    data?: any,
    config?: ApiRequestConfig & { retries?: number; retryDelay?: number }
  ): Promise<ApiResponse<T>> {
    const retries = config?.retries ?? 0;
    const retryDelay = config?.retryDelay ?? 1000;

    let lastError: ApiError | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        switch (method) {
          case 'GET':
            return await this.get<T>(url, config);
          case 'POST':
            return await this.post<T>(url, data, config);
          case 'PUT':
            return await this.put<T>(url, data, config);
          case 'PATCH':
            return await this.patch<T>(url, data, config);
          case 'DELETE':
            return await this.delete<T>(url, config);
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }
      } catch (error: any) {
        lastError = error as ApiError;
        
        if (attempt < retries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        }
      }
    }

    throw lastError;
  }
}

// Singleton instance
export const apiAxiosService = new ApiAxiosService();
