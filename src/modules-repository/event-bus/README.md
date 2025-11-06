# Event Bus Module

## Overview
The Event Bus module provides a global publish/subscribe mechanism for component communication in KIMU-Core applications. It enables loose coupling between components by allowing them to emit and listen to custom events without direct references.

## Features
- ✅ **Global event bus** - Centralized communication hub
- ✅ **Type-safe callbacks** - TypeScript support for event handlers
- ✅ **Auto-unsubscribe** - Subscription objects with cleanup
- ✅ **Once subscriptions** - Auto-unsubscribe after first event
- ✅ **Debug mode** - Optional logging for development
- ✅ **Error handling** - Isolated callback errors don't affect other subscribers
- ✅ **Event introspection** - Query registered events and subscriber counts

## Installation
The Event Bus module is included in KIMU-Core. No additional installation required.

## Usage

### Basic Example
```typescript
import { eventBusService } from './modules/event-bus/event-bus-service';

// Subscribe to an event
const subscription = eventBusService.on('user:login', (user) => {
  console.log('User logged in:', user);
});

// Emit an event
eventBusService.emit('user:login', { id: 1, name: 'John Doe' });

// Unsubscribe when done
subscription.unsubscribe();
```

### In a Component
```typescript
import { KimuComponent } from '../core/kimu-component';
import { KimuComponentElement } from '../core/kimu-component-element';
import { eventBusService } from '../modules/event-bus/event-bus-service';

@KimuComponent({
  tag: 'my-component',
  name: 'My Component',
  // ...
})
export class MyComponent extends KimuComponentElement {
  private subscriptions: any[] = [];

  onInit() {
    // Subscribe to events
    this.subscriptions.push(
      eventBusService.on('data:updated', this.handleDataUpdate.bind(this))
    );
    
    this.subscriptions.push(
      eventBusService.on('theme:changed', this.handleThemeChange.bind(this))
    );
  }

  handleDataUpdate(data: any) {
    console.log('Data updated:', data);
    this.onRender();
  }

  handleThemeChange(theme: string) {
    console.log('Theme changed:', theme);
    // Update UI based on theme
  }

  // Emit events
  saveData() {
    // ... save logic
    eventBusService.emit('data:saved', { timestamp: Date.now() });
  }

  // Clean up on component destroy
  disconnectedCallback() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    super.disconnectedCallback();
  }
}
```

### One-time Events
```typescript
// Subscribe only once
eventBusService.once('app:initialized', () => {
  console.log('App initialized!');
});

// This will trigger the callback and auto-unsubscribe
eventBusService.emit('app:initialized');
```

### Debug Mode
```typescript
// Enable debug logging
eventBusService.setDebugMode(true);

// All subscriptions, emissions, and unsubscriptions will be logged
eventBusService.on('test:event', () => {});
// Console: [EventBus] Subscribed to: test:event

eventBusService.emit('test:event', 'data');
// Console: [EventBus] Emitting: test:event ['data']
```

### Event Introspection
```typescript
// Get list of all registered events
const events = eventBusService.getEventList();
console.log('Active events:', events);

// Check subscriber count
const count = eventBusService.getSubscriberCount('user:login');
console.log(`Subscribers for user:login: ${count}`);

// Check if event has subscribers
if (eventBusService.hasSubscribers('data:updated')) {
  console.log('Someone is listening to data:updated');
}
```

## API Reference

### `eventBusService.on(event, callback)`
Subscribe to an event.
- **event**: `string` - Event name
- **callback**: `Function` - Handler function
- **Returns**: `EventSubscription` - Subscription object with `unsubscribe()` method

### `eventBusService.once(event, callback)`
Subscribe to an event once (auto-unsubscribe after first emission).
- **event**: `string` - Event name
- **callback**: `Function` - Handler function
- **Returns**: `EventSubscription` - Subscription object

### `eventBusService.emit(event, ...args)`
Emit an event to all subscribers.
- **event**: `string` - Event name
- **args**: `any[]` - Arguments to pass to callbacks

### `eventBusService.off(event, callback)`
Unsubscribe from an event.
- **event**: `string` - Event name
- **callback**: `Function` - Callback to remove

### `eventBusService.clear(event?)`
Remove all subscribers for a specific event or all events.
- **event**: `string` (optional) - Event name

### `eventBusService.setDebugMode(enabled)`
Enable or disable debug logging.
- **enabled**: `boolean` - Debug mode state

### `eventBusService.getEventList()`
Get list of all registered events.
- **Returns**: `string[]` - Array of event names

### `eventBusService.getSubscriberCount(event)`
Get number of subscribers for a specific event.
- **event**: `string` - Event name
- **Returns**: `number` - Subscriber count

### `eventBusService.hasSubscribers(event)`
Check if an event has any subscribers.
- **event**: `string` - Event name
- **Returns**: `boolean` - True if event has subscribers

## Event Naming Conventions
Use namespaced event names for better organization:
- `user:login`, `user:logout`, `user:updated`
- `data:loaded`, `data:saved`, `data:error`
- `ui:theme-changed`, `ui:modal-opened`, `ui:notification`
- `app:initialized`, `app:ready`, `app:shutdown`

## Best Practices

### 1. Always Unsubscribe
```typescript
class MyComponent extends KimuComponentElement {
  private subscriptions: any[] = [];

  onInit() {
    this.subscriptions.push(
      eventBusService.on('event', this.handler.bind(this))
    );
  }

  disconnectedCallback() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    super.disconnectedCallback();
  }
}
```

### 2. Use Namespaced Events
```typescript
// Good
eventBusService.emit('user:profile:updated', userData);
eventBusService.emit('notification:success', message);

// Avoid generic names
eventBusService.emit('update', data); // Too generic!
```

### 3. Document Event Payloads
```typescript
/**
 * Event: user:login
 * Payload: { id: number, name: string, email: string }
 */
eventBusService.emit('user:login', { id: 1, name: 'John', email: 'john@example.com' });
```

### 4. Handle Errors
```typescript
eventBusService.on('data:process', (data) => {
  try {
    processData(data);
  } catch (error) {
    eventBusService.emit('data:error', error);
  }
});
```

## Common Use Cases

### 1. Component Communication
```typescript
// Component A emits
eventBusService.emit('cart:item-added', { id: 123, name: 'Product' });

// Component B listens
eventBusService.on('cart:item-added', (item) => {
  updateCartCount();
});
```

### 2. State Synchronization
```typescript
// When state changes
eventBusService.emit('state:updated', newState);

// Components react to state changes
eventBusService.on('state:updated', (state) => {
  this.updateUI(state);
});
```

### 3. User Actions
```typescript
// Button click
eventBusService.emit('button:save-clicked', { form: 'userProfile' });

// Multiple handlers can react
eventBusService.on('button:save-clicked', validateForm);
eventBusService.on('button:save-clicked', showLoadingIndicator);
eventBusService.on('button:save-clicked', trackAnalytics);
```

## Performance Considerations
- Event bus is synchronous - handlers execute immediately
- Use wisely for frequently emitted events (e.g., scroll, mousemove)
- Consider debouncing or throttling for high-frequency events
- Always clean up subscriptions to prevent memory leaks

## License
This module is part of KIMU-Core and follows the same license (MPL-2.0).

## Version History
- **1.0.0** - Initial release with core event bus functionality
