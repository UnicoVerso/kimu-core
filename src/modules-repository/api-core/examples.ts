/**
 * KIMU API Core Module - Usage Examples
 * Demonstrates common use cases and patterns
 */

import { apiCoreService } from './api-core-service';

// ============================================
// 1. BASIC CONFIGURATION
// ============================================

export function configureApiService() {
  apiCoreService.configure({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}

// ============================================
// 2. SIMPLE GET REQUEST
// ============================================

export async function getUsersExample() {
  try {
    const response = await apiCoreService.get('/users');
    console.log('Users:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// ============================================
// 3. GET WITH QUERY PARAMETERS
// ============================================

export async function getPostsWithFiltersExample() {
  try {
    const response = await apiCoreService.get('/posts', {
      params: {
        userId: 1,
        _limit: 10
      }
    });
    console.log('Filtered posts:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

// ============================================
// 4. POST REQUEST WITH DATA
// ============================================

export async function createPostExample() {
  try {
    const newPost = {
      title: 'My New Post',
      body: 'This is the content of my post',
      userId: 1
    };

    const response = await apiCoreService.post('/posts', newPost);
    console.log('Created post:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// ============================================
// 5. PUT REQUEST (UPDATE)
// ============================================

export async function updatePostExample(postId: number) {
  try {
    const updatedPost = {
      id: postId,
      title: 'Updated Post Title',
      body: 'Updated content',
      userId: 1
    };

    const response = await apiCoreService.put(`/posts/${postId}`, updatedPost);
    console.log('Updated post:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

// ============================================
// 6. PATCH REQUEST (PARTIAL UPDATE)
// ============================================

export async function patchPostExample(postId: number) {
  try {
    const response = await apiCoreService.patch(`/posts/${postId}`, {
      title: 'Partially Updated Title'
    });
    console.log('Patched post:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error patching post:', error);
    throw error;
  }
}

// ============================================
// 7. DELETE REQUEST
// ============================================

export async function deletePostExample(postId: number) {
  try {
    const response = await apiCoreService.delete(`/posts/${postId}`);
    console.log('Deleted post:', response.status);
    return response;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

// ============================================
// 8. REQUEST WITH CUSTOM HEADERS
// ============================================

export async function requestWithCustomHeadersExample() {
  try {
    const response = await apiCoreService.get('/users/1', {
      headers: {
        'X-Custom-Header': 'custom-value',
        'Accept-Language': 'it-IT'
      }
    });
    console.log('User with custom headers:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error with custom headers:', error);
    throw error;
  }
}

// ============================================
// 9. REQUEST WITH TIMEOUT
// ============================================

export async function requestWithTimeoutExample() {
  try {
    const response = await apiCoreService.get('/users', {
      timeout: 3000 // 3 seconds
    });
    console.log('Users with timeout:', response.data);
    return response.data;
  } catch (error) {
    console.error('Timeout or error:', error);
    throw error;
  }
}

// ============================================
// 10. REQUEST WITH ABORT CONTROLLER
// ============================================

export async function requestWithAbortExample() {
  const controller = new AbortController();

  // Abort after 2 seconds
  setTimeout(() => {
    console.log('Aborting request...');
    controller.abort();
  }, 2000);

  try {
    const response = await apiCoreService.get('/users', {
      signal: controller.signal
    });
    console.log('Users:', response.data);
    return response.data;
  } catch (error) {
    console.error('Request aborted or error:', error);
    throw error;
  }
}

// ============================================
// 11. USING REQUEST INTERCEPTOR
// ============================================

export function setupRequestInterceptorExample() {
  apiCoreService.configure({
    requestInterceptor: (config) => {
      // Add authentication token
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`
        };
      }

      // Log request
      console.log(`[Request] ${config.method} ${config.params}`);

      return config;
    }
  });
}

// ============================================
// 12. USING RESPONSE INTERCEPTOR
// ============================================

export function setupResponseInterceptorExample() {
  apiCoreService.configure({
    responseInterceptor: (response) => {
      // Log response
      console.log(`[Response] ${response.status} - ${response.statusText}`);

      // Add metadata
      response.data = {
        ...response.data,
        _metadata: {
          receivedAt: new Date().toISOString(),
          status: response.status
        }
      };

      return response;
    }
  });
}

// ============================================
// 13. USING ERROR INTERCEPTOR
// ============================================

export function setupErrorInterceptorExample() {
  apiCoreService.configure({
    errorInterceptor: async (error) => {
      // Log error
      console.error(`[Error] ${error.status} - ${error.message}`);

      // Handle 401 Unauthorized
      if (error.status === 401) {
        console.log('Unauthorized, redirecting to login...');
        // window.location.href = '/login';
      }

      // Handle 500 Server Error
      if (error.status && error.status >= 500) {
        console.log('Server error, please try again later');
      }

      return error;
    }
  });
}

// ============================================
// 14. TYPED REQUESTS (TypeScript)
// ============================================

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export async function typedRequestsExample() {
  // Type-safe GET
  const usersResponse = await apiCoreService.get<User[]>('/users');
  usersResponse.data.forEach(user => {
    console.log(user.name); // Type-safe access
  });

  // Type-safe POST
  const newPost: Omit<Post, 'id'> = {
    userId: 1,
    title: 'New Post',
    body: 'Content'
  };

  const postResponse = await apiCoreService.post<Post>('/posts', newPost);
  console.log(postResponse.data.id); // Type-safe
}

// ============================================
// 15. ERROR HANDLING EXAMPLE
// ============================================

export async function errorHandlingExample() {
  try {
    const response = await apiCoreService.get('/invalid-endpoint');
    console.log(response.data);
  } catch (error: any) {
    // Access ApiError properties
    console.error('Error message:', error.message);
    console.error('HTTP status:', error.status);
    console.error('Status text:', error.statusText);
    console.error('Response data:', error.data);
    console.error('Original error:', error.originalError);
  }
}

// ============================================
// 16. COMPLETE EXAMPLE: USER SERVICE
// ============================================

export class UserService {
  private api = apiCoreService;

  constructor() {
    // Configure service
    this.api.configure({
      baseURL: 'https://jsonplaceholder.typicode.com'
    });
  }

  async getAll(): Promise<User[]> {
    const response = await this.api.get<User[]>('/users');
    return response.data;
  }

  async getById(id: number): Promise<User> {
    const response = await this.api.get<User>(`/users/${id}`);
    return response.data;
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const response = await this.api.post<User>('/users', user);
    return response.data;
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    const response = await this.api.patch<User>(`/users/${id}`, user);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  async search(query: string): Promise<User[]> {
    const response = await this.api.get<User[]>('/users', {
      params: { q: query }
    });
    return response.data;
  }
}

// ============================================
// 17. USAGE IN KIMU COMPONENT
// ============================================

/*
import { KimuComponentElement } from '@kimu/core';
import { KimuModuleManager } from '@kimu/core';

export class UserListComponent extends KimuComponentElement {
  private api: any;
  private users: User[] = [];
  private loading = false;
  private error: string | null = null;

  async onInit() {
    // Get API service
    this.api = KimuModuleManager.getInstance().getService('api-core');
    
    // Configure
    this.api.configure({
      baseURL: 'https://jsonplaceholder.typicode.com'
    });
    
    // Load data
    await this.loadUsers();
  }

  async loadUsers() {
    this.loading = true;
    this.error = null;
    this.onRender();

    try {
      const response = await this.api.get<User[]>('/users');
      this.users = response.data;
    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.loading = false;
      this.onRender();
    }
  }

  async createUser(userData: Omit<User, 'id'>) {
    try {
      const response = await this.api.post<User>('/users', userData);
      this.users.push(response.data);
      this.onRender();
    } catch (error: any) {
      console.error('Failed to create user:', error);
    }
  }

  async deleteUser(id: number) {
    try {
      await this.api.delete(`/users/${id}`);
      this.users = this.users.filter(u => u.id !== id);
      this.onRender();
    } catch (error: any) {
      console.error('Failed to delete user:', error);
    }
  }
}
*/
