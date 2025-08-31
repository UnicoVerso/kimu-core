# Kimu Router Module

This module provides a routing service for kimu-core, allowing you to manage routes and navigation between components/extensions based on the URL.

## Features
- Centralized route configuration
- Navigation via the History API
- Callback on route change events
- API to register new routes dynamically

## Usage

```typescript
import { KimuRouterService } from './src/modules/router/router';

const router = KimuRouterService.getInstance();
router.configure([
  { path: '/', component: HomeComponent },
  { path: '/about', component: AboutComponent },
]);

router.onRouteChange((route) => {
  // Logic to handle route change
});

// To navigate
router.navigate('/about');
```

## Extension
- You can extend the system to support dynamic parameters, fallback, nested routes, etc.
- Extensions can register their own routes via `registerRoute`.

## Best practices
- Keep route configuration separated from rendering logic.
- Always document main routes and accepted parameters.

---
Author: UnicoVerso
