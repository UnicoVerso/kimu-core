/**
 * API Axios Service - Usage Examples
 * 
 * Collection of practical examples demonstrating various features
 * of the api-axios module.
 */

import { apiAxiosService } from './api-axios-service';
import type { ApiError } from './interfaces';

/**
 * Example 1: Simple GET request
 */
export async function exampleSimpleGet() {
  try {
    const response = await apiAxiosService.get('https://api.ipify.org?format=json');
    console.log('Your IP:', response.data.ip);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching IP:', error.message);
    throw error;
  }
}

/**
 * Example 2: GET with query parameters
 */
export async function exampleGetWithParams() {
  try {
    const response = await apiAxiosService.get('https://api.github.com/search/repositories', {
      params: {
        q: 'kimu',
        sort: 'stars',
        order: 'desc'
      }
    });
    console.log('Repositories found:', response.data.total_count);
    return response.data;
  } catch (error: any) {
    console.error('Error searching repositories:', error.message);
    throw error;
  }
}

/**
 * Example 3: POST request with data
 */
export async function examplePost() {
  try {
    const response = await apiAxiosService.post('https://jsonplaceholder.typicode.com/posts', {
      title: 'My Post',
      body: 'This is the content',
      userId: 1
    });
    console.log('Post created:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating post:', error.message);
    throw error;
  }
}

/**
 * Example 4: Request with retry logic
 */
export async function exampleWithRetry() {
  try {
    const response = await apiAxiosService.request(
      'GET',
      'https://api.ipify.org?format=json',
      null,
      {
        retries: 3,
        retryDelay: 1000
      }
    );
    console.log('IP (with retry):', response.data.ip);
    return response.data;
  } catch (error: any) {
    console.error('Failed after retries:', error.message);
    throw error;
  }
}

/**
 * Example 5: Cached GET request
 */
export async function exampleWithCache() {
  // First call - fetches from server
  console.log('First call (from server)...');
  const response1 = await apiAxiosService.get('https://api.ipify.org?format=json', {
    useCache: true
  });
  console.log('IP:', response1.data.ip);

  // Second call - returns cached data
  console.log('Second call (from cache)...');
  const response2 = await apiAxiosService.get('https://api.ipify.org?format=json', {
    useCache: true
  });
  console.log('IP:', response2.data.ip);

  return response2.data;
}

/**
 * Example 6: Request with custom headers
 */
export async function exampleWithHeaders() {
  try {
    const response = await apiAxiosService.get('https://api.github.com/user', {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    console.log('User:', response.data.login);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user:', error.message);
    throw error;
  }
}

/**
 * Example 7: Request with timeout
 */
export async function exampleWithTimeout() {
  try {
    const response = await apiAxiosService.get('https://api.ipify.org?format=json', {
      timeout: 5000 // 5 seconds
    });
    console.log('IP:', response.data.ip);
    return response.data;
  } catch (error: any) {
    if (error.message.includes('timeout')) {
      console.error('Request timed out!');
    }
    throw error;
  }
}

/**
 * Example 8: Upload with progress tracking
 */
export async function exampleUploadProgress() {
  const formData = new FormData();
  formData.append('file', new Blob(['test content'], { type: 'text/plain' }));

  try {
    const response = await apiAxiosService.post(
      'https://httpbin.org/post',
      formData,
      {
        onUploadProgress: (event) => {
          const percentComplete = Math.round((event.loaded * 100) / (event.total || 1));
          console.log(`Upload progress: ${percentComplete}%`);
        }
      }
    );
    console.log('Upload complete:', response.status);
    return response.data;
  } catch (error: any) {
    console.error('Upload failed:', error.message);
    throw error;
  }
}

/**
 * Example 9: Request cancellation
 */
export async function exampleCancellation() {
  const cancelToken = apiAxiosService.createCancelToken();

  // Start the request
  const requestPromise = apiAxiosService.get('https://api.github.com/users/torvalds', {
    axiosConfig: {
      cancelToken: cancelToken.token
    }
  });

  // Cancel after 100ms
  setTimeout(() => {
    console.log('Cancelling request...');
    cancelToken.cancel('User cancelled the request');
  }, 100);

  try {
    const response = await requestPromise;
    console.log('Request completed:', response.data.login);
    return response.data;
  } catch (error: any) {
    if (error.message.includes('cancel')) {
      console.log('Request was cancelled');
    }
    throw error;
  }
}

/**
 * Example 10: Using interceptors
 */
export function exampleInterceptors() {
  // Add request interceptor to add auth token
  apiAxiosService.addRequestInterceptor(async (config) => {
    console.log('Request interceptor: Adding auth token');
    config.headers = config.headers || {};
    config.headers['X-Custom-Token'] = 'my-token-123';
    return config;
  });

  // Add response interceptor to log responses
  apiAxiosService.addResponseInterceptor(async (response) => {
    console.log('Response interceptor: Status', response.status);
    return response;
  });

  // Add error interceptor to handle errors globally
  apiAxiosService.addErrorInterceptor(async (error) => {
    console.error('Error interceptor:', error.message);
    if (error.status === 401) {
      console.log('Unauthorized - redirecting to login');
    }
  });

  console.log('Interceptors configured');
}

/**
 * Example 11: TypeScript with generic types
 */
interface User {
  id: number;
  name: string;
  email: string;
}

export async function exampleWithTypes() {
  try {
    const response = await apiAxiosService.get<User>('https://jsonplaceholder.typicode.com/users/1');
    // response.data is typed as User
    console.log('User name:', response.data.name);
    console.log('User email:', response.data.email);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user:', error.message);
    throw error;
  }
}

/**
 * Example 12: Error handling with detailed information
 */
export async function exampleErrorHandling() {
  try {
    const response = await apiAxiosService.get('https://api.github.com/nonexistent');
    return response.data;
  } catch (error: any) {
    const apiError = error as ApiError;
    
    console.error('Error details:');
    console.error('- Message:', apiError.message);
    console.error('- Status:', apiError.status);
    console.error('- Response data:', apiError.data);
    console.error('- Original error:', apiError.originalError);
    
    throw error;
  }
}

/**
 * Example 13: Cache management
 */
export async function exampleCacheManagement() {
  // Set cache TTL to 10 minutes
  apiAxiosService.setCacheTTL(10 * 60 * 1000);

  // Make cached request
  const response1 = await apiAxiosService.get('https://api.ipify.org?format=json', {
    useCache: true
  });
  console.log('First call:', response1.data.ip);

  // Clear cache
  apiAxiosService.clearCache();
  console.log('Cache cleared');

  // This will fetch from server again
  const response2 = await apiAxiosService.get('https://api.ipify.org?format=json', {
    useCache: true
  });
  console.log('Second call (after clear):', response2.data.ip);
}
