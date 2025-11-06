# API Axios - Quick Reference

## Import

```typescript
import { apiAxiosService } from '../../modules/api-axios/api-axios-service';
```

## Basic Methods

```typescript
// GET request
const response = await apiAxiosService.get(url, config);

// POST request
const response = await apiAxiosService.post(url, data, config);

// PUT request
const response = await apiAxiosService.put(url, data, config);

// PATCH request
const response = await apiAxiosService.patch(url, data, config);

// DELETE request
const response = await apiAxiosService.delete(url, config);

// Generic request with method
const response = await apiAxiosService.request(method, url, data, config);
```

## Common Use Cases

### With Query Parameters
```typescript
const response = await apiAxiosService.get('https://api.example.com/users', {
  params: { page: 1, limit: 10 }
});
// Calls: https://api.example.com/users?page=1&limit=10
```

### With Custom Headers
```typescript
const response = await apiAxiosService.get('https://api.example.com/data', {
  headers: {
    'Authorization': 'Bearer token123',
    'X-Custom-Header': 'value'
  }
});
```

### With Timeout
```typescript
const response = await apiAxiosService.get('https://api.example.com/data', {
  timeout: 5000 // 5 seconds
});
```

### With Retry
```typescript
const response = await apiAxiosService.request('GET', 'https://api.example.com/data', null, {
  retries: 3,
  retryDelay: 1000
});
```

### With Cache
```typescript
const response = await apiAxiosService.get('https://api.example.com/data', {
  useCache: true
});

// Configure cache TTL
apiAxiosService.setCacheTTL(10 * 60 * 1000); // 10 minutes

// Clear cache
apiAxiosService.clearCache();
```

### With Progress Tracking
```typescript
const response = await apiAxiosService.post('https://api.example.com/upload', formData, {
  onUploadProgress: (event) => {
    const percent = Math.round((event.loaded * 100) / event.total);
    console.log(`Upload: ${percent}%`);
  }
});
```

### With Cancellation
```typescript
const cancelToken = apiAxiosService.createCancelToken();

const promise = apiAxiosService.get('https://api.example.com/data', {
  axiosConfig: { cancelToken: cancelToken.token }
});

// Cancel if needed
cancelToken.cancel('User cancelled');
```

## Interceptors

### Request Interceptor
```typescript
apiAxiosService.addRequestInterceptor(async (config) => {
  config.headers = config.headers || {};
  config.headers['Authorization'] = 'Bearer token';
  return config;
});
```

### Response Interceptor
```typescript
apiAxiosService.addResponseInterceptor(async (response) => {
  console.log('Response:', response.status);
  return response;
});
```

### Error Interceptor
```typescript
apiAxiosService.addErrorInterceptor(async (error) => {
  if (error.status === 401) {
    // Handle unauthorized
  }
});
```

## TypeScript Types

```typescript
import type { ApiResponse, ApiError, ApiRequestConfig } from '../../modules/api-axios';

interface User {
  id: number;
  name: string;
}

const response = await apiAxiosService.get<User>('https://api.example.com/user/1');
// response.data is typed as User
```

## Error Handling

```typescript
try {
  const response = await apiAxiosService.get('https://api.example.com/data');
  console.log(response.data);
} catch (error: any) {
  console.error('Status:', error.status);
  console.error('Message:', error.message);
  console.error('Data:', error.data);
}
```

## Response Format

```typescript
{
  data: any,           // Response data
  status: number,      // HTTP status code
  statusText: string,  // HTTP status text
  headers: {},         // Response headers
  config: {}           // Original request config
}
```

## Migration from api-core

```typescript
// Simply replace the import
// From:
import { apiCoreService } from '../../modules/api-core/api-core-service';
// To:
import { apiAxiosService } from '../../modules/api-axios/api-axios-service';

// All basic methods work the same!
```
