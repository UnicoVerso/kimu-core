# API Axios Module

Advanced HTTP client module for KIMU Framework based on the **Axios** library.

## Overview

The `api-axios` module provides an enhanced HTTP client with advanced features like interceptors, automatic retries, request cancellation, progress tracking, and response caching.

## Key Features

### ✨ Advanced Features Over api-core

1. **Request/Response Interceptors**
   - Modify requests before they are sent
   - Transform responses before they reach your code
   - Handle errors globally

2. **Automatic Retry Logic**
   - Configurable retry attempts
   - Exponential backoff strategy
   - Retry only on specific error conditions

3. **Request Cancellation**
   - Cancel pending requests
   - Avoid memory leaks from unmounted components
   - Manage concurrent requests

4. **Progress Tracking**
   - Upload progress callbacks
   - Download progress callbacks
   - Real-time feedback for large transfers

5. **Response Caching**
   - Cache GET requests
   - Configurable TTL (Time To Live)
   - Reduce network traffic and improve performance

6. **Better Error Handling**
   - Standardized error format
   - Original error preservation
   - Error interceptors for global handling

#### 📋 Feature Comparison: api-core vs api-axios

| Funzione                      | api-core | api-axios |
|-------------------------------|:--------:|:---------:|
| HTTP Methods                  |    ✅    |    ✅     |
| Query Parameters              |    ✅    |    ✅     |
| Custom Headers                |    ✅    |    ✅     |
| Timeout                       |    ✅    |    ✅     |
| Request Interceptors          |    ❌    |    ✅     |
| Response Interceptors         |    ❌    |    ✅     |
| Error Interceptors            |    ❌    |    ✅     |
| Automatic Retry               |    ❌    |    ✅     |
| Request Cancellation          |    ❌    |    ✅     |
| Progress Tracking             |    ❌    |    ✅     |
| Response Caching              |    ❌    |    ✅     |
| Bundle Size                   |  ~2KB    |  ~15KB    |
| Dependencies                  |    0     |  axios    |

**Legenda:** ✅ = supportato, ❌ = non supportato

## Installation

The module is already part of KIMU-Core. To use it:

```bash
npm install axios
```

## Basic Usage

### Import the Service

```typescript
import { apiAxiosService } from '../../modules/api-axios/api-axios-service';
```

### Simple GET Request

```typescript
const response = await apiAxiosService.get('https://api.example.com/data');
console.log(response.data);
```

### POST Request with Data

```typescript
const response = await apiAxiosService.post(
  'https://api.example.com/users',
  { name: 'John', email: 'john@example.com' }
);
console.log(response.data);
```

## Advanced Features

### Request with Retry

```typescript
const response = await apiAxiosService.request(
  'GET',
  'https://api.example.com/data',
  null,
  {
    retries: 3,           // Retry up to 3 times
    retryDelay: 1000      // Start with 1 second delay (exponential backoff)
  }
);
```

### Cached GET Request

```typescript
// First call - fetches from server
const response1 = await apiAxiosService.get(
  'https://api.example.com/data',
  { useCache: true }
);

// Second call - returns cached data (if within TTL)
const response2 = await apiAxiosService.get(
  'https://api.example.com/data',
  { useCache: true }
);
```

### Configure Cache TTL

```typescript
// Set cache to expire after 10 minutes
apiAxiosService.setCacheTTL(10 * 60 * 1000);

// Clear all cached data
apiAxiosService.clearCache();
```

### Request with Progress Tracking

```typescript
const response = await apiAxiosService.post(
  'https://api.example.com/upload',
  formData,
  {
    onUploadProgress: (event) => {
      const percentComplete = Math.round((event.loaded * 100) / event.total);
      console.log(`Upload: ${percentComplete}%`);
    },
    onDownloadProgress: (event) => {
      const percentComplete = Math.round((event.loaded * 100) / event.total);
      console.log(`Download: ${percentComplete}%`);
    }
  }
);
```

### Request Cancellation

```typescript
// Create a cancel token
const cancelToken = apiAxiosService.createCancelToken();

// Make a request with the cancel token
const requestPromise = apiAxiosService.get(
  'https://api.example.com/large-data',
  {
    axiosConfig: {
      cancelToken: cancelToken.token
    }
  }
);

// Cancel the request if needed
cancelToken.cancel('User cancelled the request');
```

### Request Interceptor

```typescript
// Add authentication token to all requests
apiAxiosService.addRequestInterceptor(async (config) => {
  const token = await getAuthToken();
  config.headers = config.headers || {};
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});
```

### Response Interceptor

```typescript
// Transform all responses
apiAxiosService.addResponseInterceptor(async (response) => {
  console.log('Response received:', response.status);
  // You can modify the response here
  return response;
});
```

### Error Interceptor

```typescript
// Handle errors globally
apiAxiosService.addErrorInterceptor(async (error) => {
  if (error.status === 401) {
    console.log('Unauthorized - redirecting to login');
    // Redirect to login page
  }
});
```

## Migration from api-core

The `api-axios` module maintains the same interface as `api-core` for basic operations, making migration simple:

```typescript
// Before (api-core)
import { apiCoreService } from '../../modules/api-core/api-core-service';
const response = await apiCoreService.get('https://api.example.com/data');

// After (api-axios) - same interface!
import { apiAxiosService } from '../../modules/api-axios/api-axios-service';
const response = await apiAxiosService.get('https://api.example.com/data');
```

## When to Use api-axios vs api-core

### Use **api-core** when:
- You need a minimal, zero-dependency solution
- Your requests are simple and don't need advanced features
- Bundle size is critical
- You want maximum control over the HTTP implementation

### Use **api-axios** when:
- You need request/response interceptors
- You want automatic retry logic
- You need request cancellation
- You want upload/download progress tracking
- Response caching would improve performance
- You're building a complex application with many API calls

## Performance Considerations

- **Bundle Size**: Axios adds ~13KB (minified + gzipped) to your bundle
- **Memory**: Caching consumes memory - use `clearCache()` periodically
- **Network**: Retries increase network traffic - use wisely

## Error Handling

All errors are transformed to the standard `ApiError` format:

```typescript
try {
  const response = await apiAxiosService.get('https://api.example.com/data');
} catch (error: ApiError) {
  console.error('Status:', error.status);
  console.error('Message:', error.message);
  console.error('Data:', error.data);
  console.error('Original:', error.originalError);
}
```

## TypeScript Support

Full TypeScript support with generic types:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const response = await apiAxiosService.get<User>('https://api.example.com/user/1');
// response.data is typed as User
console.log(response.data.name);
```

## Best Practices

1. **Use interceptors for cross-cutting concerns** (auth, logging, error handling)
2. **Enable caching for static or slowly-changing data**
3. **Use retry logic for non-critical requests**
4. **Cancel requests when components unmount**
5. **Track progress for large file uploads/downloads**
6. **Set appropriate timeouts** for different types of requests
7. **Clear cache periodically** to manage memory

## Dependencies

- `axios`: ^1.6.0 (peer dependency)

## License

This module is part of KIMU Framework and follows the same license (MPL-2.0).

## Author

**UnicòVerso** - Marco Di Pasquale

## Related

- [api-core](../api-core/README.md) - Minimal native HTTP client
- [KIMU Framework](https://github.com/UnicoVerso/kimu-core)
