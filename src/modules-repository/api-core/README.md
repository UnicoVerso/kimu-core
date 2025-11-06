# KIMU API Core Module

Modulo minimale per la gestione di richieste HTTP verso API esterne, basato su `fetch` nativo.

## Caratteristiche

- ✅ Zero dipendenze esterne
- ✅ Basato su fetch API nativa
- ✅ Promise-based (async/await)
- ✅ TypeScript-first con type safety completo
- ✅ Supporto per tutti i metodi HTTP (GET, POST, PUT, PATCH, DELETE)
- ✅ Gestione automatica di query parameters, headers, body
- ✅ Interceptor per request/response/error
- ✅ Timeout configurabile
- ✅ Gestione errori strutturata
- ✅ Supporto per diversi tipi di risposta (JSON, text, blob, arraybuffer)
- ✅ BaseURL globale configurabile
- ✅ Lightweight (~2KB minified)

## Installazione

Il modulo è incluso nel repository `kimu-modules`. Per installarlo:

```bash
# Usando kimu-cli (quando disponibile)
kimu install module api-core

# Manualmente
# Copia la cartella src/modules/api-core nel tuo progetto
```

## Utilizzo Base

### Inizializzazione

```typescript
import { KimuModuleManager } from '@kimu/core';
import ApiCoreModule from './modules/api-core/module';

// Inizializza il modulo
const moduleManager = KimuModuleManager.getInstance();
const apiModule = new ApiCoreModule();
await moduleManager.loadModule(apiModule);

// Ottieni il servizio
const api = moduleManager.getService('api-core');
```

### Configurazione Globale

```typescript
import { apiCoreService } from './modules/api-core/api-core-service';

// Configura baseURL e headers di default
apiCoreService.configure({
  baseURL: 'https://api.example.com',
  timeout: 10000, // 10 secondi
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'X-Custom-Header': 'value'
  }
});
```

### Richieste GET

```typescript
// GET semplice
const response = await api.get('/users');
console.log(response.data); // Array di utenti

// GET con query parameters
const response = await api.get('/users', {
  params: {
    page: 1,
    limit: 10,
    sort: 'name'
  }
});

// GET con headers custom
const response = await api.get('/users', {
  headers: {
    'Accept-Language': 'it-IT'
  }
});
```

### Richieste POST

```typescript
// POST con JSON body
const response = await api.post('/users', {
  name: 'Mario Rossi',
  email: 'mario@example.com',
  age: 30
});

// POST con FormData
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('title', 'My File');

const response = await api.post('/upload', formData);
```

### Altri Metodi HTTP

```typescript
// PUT - aggiorna risorsa
const response = await api.put('/users/123', {
  name: 'Mario Rossi Updated'
});

// PATCH - aggiorna parzialmente
const response = await api.patch('/users/123', {
  age: 31
});

// DELETE - elimina risorsa
const response = await api.delete('/users/123');
```

### Richiesta Generica

```typescript
const response = await api.request('/custom-endpoint', {
  method: 'POST',
  body: { key: 'value' },
  headers: { 'X-Custom': 'header' },
  params: { filter: 'active' },
  timeout: 5000,
  responseType: 'json'
});
```

## Gestione Errori

```typescript
try {
  const response = await api.get('/users');
  console.log(response.data);
} catch (error) {
  console.error('Error:', error.message);
  console.error('Status:', error.status);
  console.error('Status Text:', error.statusText);
  console.error('Response Data:', error.data);
}
```

## Interceptor

### Request Interceptor

```typescript
apiCoreService.configure({
  requestInterceptor: (config) => {
    // Aggiungi token dinamicamente
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    
    // Log della richiesta
    console.log('Making request:', config);
    
    return config;
  }
});
```

### Response Interceptor

```typescript
apiCoreService.configure({
  responseInterceptor: (response) => {
    // Log della risposta
    console.log('Response received:', response.status);
    
    // Trasforma i dati
    response.data = {
      ...response.data,
      receivedAt: new Date().toISOString()
    };
    
    return response;
  }
});
```

### Error Interceptor

```typescript
apiCoreService.configure({
  errorInterceptor: async (error) => {
    // Gestione errore 401: refresh token
    if (error.status === 401) {
      const newToken = await refreshToken();
      localStorage.setItem('token', newToken);
      
      // Puoi anche rilanciare una richiesta o modificare l'errore
      error.message = 'Session expired, please login again';
    }
    
    // Log errori
    console.error('API Error:', error);
    
    return error;
  }
});
```

## Timeout e Cancellazione

```typescript
// Timeout automatico
const response = await api.get('/slow-endpoint', {
  timeout: 3000 // 3 secondi
});

// Cancellazione manuale con AbortController
const controller = new AbortController();

const request = api.get('/data', {
  signal: controller.signal
});

// Cancella dopo 2 secondi
setTimeout(() => controller.abort(), 2000);

try {
  const response = await request;
} catch (error) {
  if (error.message.includes('timeout')) {
    console.log('Request was cancelled');
  }
}
```

## Tipi di Risposta

```typescript
// JSON (default)
const response = await api.get('/users', {
  responseType: 'json'
});

// Testo
const response = await api.get('/readme.txt', {
  responseType: 'text'
});
console.log(response.data); // stringa

// Blob (per file)
const response = await api.get('/image.png', {
  responseType: 'blob'
});
const imageUrl = URL.createObjectURL(response.data);

// ArrayBuffer (per dati binari)
const response = await api.get('/binary-data', {
  responseType: 'arraybuffer'
});
```

## Uso in Componenti KIMU

```typescript
import { KimuComponentElement } from '@kimu/core';
import { KimuModuleManager } from '@kimu/core';

export class UserListComponent extends KimuComponentElement {
  private api: any;
  private users: any[] = [];

  async onInit() {
    // Ottieni il servizio API
    this.api = KimuModuleManager.getInstance().getService('api-core');
    
    // Carica i dati
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      const response = await this.api.get('/users');
      this.users = response.data;
      this.onRender();
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }

  async createUser(userData: any) {
    try {
      const response = await this.api.post('/users', userData);
      this.users.push(response.data);
      this.onRender();
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  }
}
```

## TypeScript Support

Il modulo è completamente tipizzato:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Type-safe request
const response = await api.get<User[]>('/users');
response.data.forEach(user => {
  console.log(user.name); // Type-safe access
});

// Type-safe POST
const newUser: Omit<User, 'id'> = {
  name: 'Mario',
  email: 'mario@example.com'
};

const response = await api.post<User>('/users', newUser);
console.log(response.data.id); // Type-safe
```

## Best Practices

### 1. Configura baseURL globalmente
```typescript
apiCoreService.configure({
  baseURL: process.env.API_URL || 'https://api.example.com'
});
```

### 2. Usa interceptor per autenticazione
```typescript
apiCoreService.configure({
  requestInterceptor: (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    return config;
  }
});
```

### 3. Gestisci errori globalmente
```typescript
apiCoreService.configure({
  errorInterceptor: (error) => {
    if (error.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    } else if (error.status >= 500) {
      // Show error notification
      showNotification('Server error, please try again later');
    }
    return error;
  }
});
```

### 4. Crea wrapper service per API specifiche
```typescript
class UserService {
  private api = apiCoreService;

  async getUsers() {
    return this.api.get<User[]>('/users');
  }

  async getUser(id: number) {
    return this.api.get<User>(`/users/${id}`);
  }

  async createUser(user: Omit<User, 'id'>) {
    return this.api.post<User>('/users', user);
  }

  async updateUser(id: number, user: Partial<User>) {
    return this.api.patch<User>(`/users/${id}`, user);
  }

  async deleteUser(id: number) {
    return this.api.delete(`/users/${id}`);
  }
}
```

## Confronto con Altri Framework

| Feature | KIMU api-core | Angular HttpClient | Axios | Fetch nativo |
|---------|---------------|-------------------|-------|--------------|
| Bundle Size | ~2KB | ~40KB | ~13KB | 0KB (nativo) |
| Dependencies | 0 | RxJS required | 0 | 0 |
| TypeScript | ✅ Native | ✅ Native | ✅ Native | ⚠️ Basic |
| Interceptors | ✅ | ✅ | ✅ | ❌ |
| Timeout | ✅ | ✅ | ✅ | ⚠️ Manual |
| Query Params | ✅ Auto | ✅ Auto | ✅ Auto | ❌ Manual |
| Error Handling | ✅ Structured | ✅ Structured | ✅ Structured | ⚠️ Basic |
| Promise/Observable | Promise | Observable | Promise | Promise |

## Roadmap

- [ ] Support per retry automatico
- [ ] Caching integrato delle richieste
- [ ] Request deduplication
- [ ] Upload progress tracking
- [ ] Download progress tracking
- [ ] Request queue con priorità
- [ ] Mock/test utilities

## License

Questo modulo fa parte di KIMU-Core ed è distribuito sotto licenza MPL-2.0.

## Supporto

Per issue, feature request o domande:
- GitHub Issues: [kimu-core/issues](https://github.com/UnicoVerso/kimu-core/issues)
- Documentazione: [kimu-docs](https://github.com/UnicoVerso/kimu-docs)
