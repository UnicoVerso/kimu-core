# Kimu Router Module

This module provides a routing service for kimu-core, allowing you to manage routes and navigation between components/extensions based on the URL.

## Features
- Centralized route configuration
- Navigation via the History API
- Callback on route change events
- API to register new routes dynamically

## Post-Installation Setup

After installing the router module, you need to create a routes configuration file:

### 1. Create routes configuration file

Copy the example file to your config folder:
```bash
mkdir -p src/config/router
cp src/modules/router/router-config.ts.example src/config/router/router-config.ts
```

Or create `src/config/router/router-config.ts` manually:

```typescript
import { RouteConfig } from '../../modules/router/router';

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: 'app-home',
    name: 'home',
    meta: { title: 'Home' }
  },
  {
    path: '/about',
    component: 'app-about',
    name: 'about',
    meta: { title: 'About' }
  },
  // Add your routes here...
];
```

### 2. Initialize router in main.ts

```typescript
import { KimuModuleManager } from './core/kimu-module-manager';
import RouterModule from './modules/router/module';
import { routes } from './config/router/router-config';

const moduleManager = KimuModuleManager.getInstance();

// Option 1: Pass routes during initialization
const routerModule = new RouterModule('router', '1.0.0', { routes });
await moduleManager.loadModule(routerModule);

// Option 2: Configure after initialization
const router = moduleManager.getModule('router').getService();
router.configure(routes);
```

### 3. Navigate between routes

```typescript
const router = moduleManager.getModule('router').getService();

// Navigate to a route
router.navigate('/about');

// Listen for route changes
router.onRouteChange((route) => {
  console.log('Route changed to:', route.path);
  // Update UI, load components, etc.
});

// Get current route
const currentRoute = router.getCurrentRoute();
```

## Extension
- You can extend the system to support dynamic parameters, fallback, nested routes, etc.
- Extensions can register their own routes via `registerRoute`.

## Best practices
- Keep route configuration separated from rendering logic.
- Always document main routes and accepted parameters.

---
Author: UnicoVerso
