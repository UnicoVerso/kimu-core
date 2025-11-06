# State Management Module

## Overview
The State Management module provides reactive state management for KIMU-Core applications. It allows components to share and react to state changes with a simple, observable API.

## Features
- ✅ **Reactive state** - Automatic updates when state changes
- ✅ **Observer pattern** - Watch specific state keys for changes
- ✅ **Computed properties** - Derive values from state with caching
- ✅ **Deep change detection** - Prevents unnecessary updates
- ✅ **Multiple watchers** - Watch multiple keys at once
- ✅ **Debug mode** - Optional logging for development
- ✅ **Type-safe** - Full TypeScript support

## Installation
The State Management module is included in KIMU-Core. No additional installation required.

## Usage

### Basic Example
```typescript
import { stateService } from './modules/state/state-service';

// Set initial state
stateService.setState('counter', 0);

// Watch for changes
stateService.watch('counter', (newValue, oldValue) => {
  console.log(`Counter changed from ${oldValue} to ${newValue}`);
});

// Update state
stateService.setState('counter', 1);
// Console: Counter changed from 0 to 1
```

### In a Component
```typescript
import { KimuComponent } from '../core/kimu-component';
import { KimuComponentElement } from '../core/kimu-component-element';
import { stateService } from '../modules/state/state-service';

@KimuComponent({
  tag: 'counter-component',
  name: 'Counter Component',
  // ...
})
export class CounterComponent extends KimuComponentElement {
  private unwatchCounter?: () => void;

  onInit() {
    // Initialize state
    if (!stateService.hasState('counter')) {
      stateService.setState('counter', 0);
    }

    // Watch for changes
    this.unwatchCounter = stateService.watch('counter', (newValue) => {
      this.updateDisplay(newValue);
    });

    // Initial display
    this.updateDisplay(stateService.getState('counter', 0));
  }

  updateDisplay(count: number) {
    const display = this.$('#counter-display');
    if (display) {
      display.textContent = count.toString();
    }
  }

  increment() {
    const current = stateService.getState('counter', 0);
    stateService.setState('counter', current + 1);
  }

  decrement() {
    const current = stateService.getState('counter', 0);
    stateService.setState('counter', current - 1);
  }

  // Clean up on component destroy
  disconnectedCallback() {
    if (this.unwatchCounter) {
      this.unwatchCounter();
    }
    super.disconnectedCallback();
  }
}
```

### Complex State Objects
```typescript
// User state
interface User {
  id: number;
  name: string;
  email: string;
  preferences: {
    theme: string;
    language: string;
  };
}

// Set initial user
stateService.setState<User>('user', {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    theme: 'dark',
    language: 'en'
  }
});

// Update partial state
stateService.updateState('user', {
  name: 'Jane Doe'
});

// Watch for user changes
stateService.watch<User>('user', (newUser, oldUser) => {
  console.log('User updated:', newUser);
});
```

### Computed Properties
```typescript
// Define state
stateService.setState('firstName', 'John');
stateService.setState('lastName', 'Doe');

// Define computed property
stateService.defineComputed('fullName', () => {
  const first = stateService.getState('firstName', '');
  const last = stateService.getState('lastName', '');
  return `${first} ${last}`;
});

// Get computed value (cached)
const fullName = stateService.getComputed('fullName');
console.log(fullName); // "John Doe"

// Update state - computed will auto-invalidate
stateService.setState('firstName', 'Jane');
console.log(stateService.getComputed('fullName')); // "Jane Doe"
```

### Watch Multiple Keys
```typescript
// Watch multiple state keys at once
const unwatch = stateService.watchMultiple(
  ['theme', 'language', 'fontSize'],
  (key, newValue, oldValue) => {
    console.log(`${key} changed:`, newValue);
    updateUI();
  }
);

// Unsubscribe from all
unwatch();
```

### Debug Mode
```typescript
// Enable debug logging
stateService.setDebugMode(true);

stateService.setState('test', 'value');
// Console: [State] Set: test value

stateService.watch('test', () => {});
// Console: [State] Watching: test
```

## API Reference

### `stateService.setState(key, value)`
Set a state value and notify observers.
- **key**: `string` - State key
- **value**: `T` - New value

### `stateService.getState(key, defaultValue?)`
Get a state value.
- **key**: `string` - State key
- **defaultValue**: `T` (optional) - Default if key doesn't exist
- **Returns**: `T | undefined`

### `stateService.updateState(key, updates)`
Update nested state properties (merge).
- **key**: `string` - State key
- **updates**: `Partial<T>` - Partial updates to merge

### `stateService.deleteState(key)`
Delete a state key and notify observers.
- **key**: `string` - State key

### `stateService.hasState(key)`
Check if a state key exists.
- **key**: `string` - State key
- **Returns**: `boolean`

### `stateService.watch(key, listener)`
Watch for state changes.
- **key**: `string` - State key
- **listener**: `(newValue, oldValue) => void` - Callback
- **Returns**: `() => void` - Unwatch function

### `stateService.unwatch(key, listener)`
Stop watching a state key.
- **key**: `string` - State key
- **listener**: `Function` - Listener to remove

### `stateService.defineComputed(key, getter)`
Define a computed property.
- **key**: `string` - Computed property key
- **getter**: `() => T` - Function that computes value

### `stateService.getComputed(key)`
Get computed property value (cached).
- **key**: `string` - Computed property key
- **Returns**: `T | undefined`

### `stateService.watchMultiple(keys, listener)`
Watch multiple state keys.
- **keys**: `string[]` - Array of keys
- **listener**: `(key, newValue, oldValue) => void` - Callback
- **Returns**: `() => void` - Unwatch function

### `stateService.getAll()`
Get all state as plain object.
- **Returns**: `Record<string, any>`

### `stateService.clear()`
Clear all state and observers.

### `stateService.reset(initialState?)`
Reset state to initial values.
- **initialState**: `Record<string, any>` (optional)

### `stateService.setDebugMode(enabled)`
Enable or disable debug logging.
- **enabled**: `boolean`

## Best Practices

### 1. Initialize State Early
```typescript
class MyComponent extends KimuComponentElement {
  onInit() {
    // Initialize state if not exists
    if (!stateService.hasState('myData')) {
      stateService.setState('myData', { items: [] });
    }
  }
}
```

### 2. Always Unwatch
```typescript
class MyComponent extends KimuComponentElement {
  private unwatchers: Array<() => void> = [];

  onInit() {
    this.unwatchers.push(
      stateService.watch('data', this.handleDataChange.bind(this))
    );
  }

  disconnectedCallback() {
    this.unwatchers.forEach(unwatch => unwatch());
    super.disconnectedCallback();
  }
}
```

### 3. Use Type Safety
```typescript
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
}

// Type-safe state access
const user = stateService.getState<User>('user');
stateService.setState<boolean>('isAuthenticated', true);
```

### 4. Namespace State Keys
```typescript
// Good
stateService.setState('user:profile', userData);
stateService.setState('app:settings', settings);
stateService.setState('cart:items', items);

// Avoid
stateService.setState('data', someData); // Too generic!
```

### 5. Use Computed for Derived State
```typescript
// Define computed properties for derived values
stateService.defineComputed('cartTotal', () => {
  const items = stateService.getState('cart:items', []);
  return items.reduce((sum, item) => sum + item.price, 0);
});

// Get computed value (cached until state changes)
const total = stateService.getComputed('cartTotal');
```

## Common Use Cases

### 1. Global User State
```typescript
// Login
stateService.setState('user', { id: 1, name: 'John', role: 'admin' });
stateService.setState('isAuthenticated', true);

// Components react
stateService.watch('isAuthenticated', (isAuth) => {
  if (isAuth) {
    loadUserDashboard();
  } else {
    showLoginScreen();
  }
});

// Logout
stateService.setState('user', null);
stateService.setState('isAuthenticated', false);
```

### 2. Theme Management
```typescript
// Set theme
stateService.setState('theme', 'dark');

// All components react to theme changes
stateService.watch('theme', (theme) => {
  document.body.className = `theme-${theme}`;
});
```

### 3. Shopping Cart
```typescript
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Initialize cart
stateService.setState<CartItem[]>('cart', []);

// Add item
function addToCart(item: CartItem) {
  const cart = stateService.getState<CartItem[]>('cart', []);
  stateService.setState('cart', [...cart, item]);
}

// Watch cart changes
stateService.watch('cart', (cart) => {
  updateCartIcon(cart.length);
});

// Computed total
stateService.defineComputed('cartTotal', () => {
  const items = stateService.getState<CartItem[]>('cart', []);
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});
```

### 4. Form State
```typescript
// Form state
stateService.setState('form', {
  name: '',
  email: '',
  isValid: false,
  errors: {}
});

// Update field
function updateField(field: string, value: any) {
  stateService.updateState('form', { [field]: value });
}

// Validate
stateService.watch('form', (form) => {
  const isValid = validateForm(form);
  stateService.updateState('form', { isValid });
});
```

## Performance Considerations
- Deep equality check prevents unnecessary updates
- Computed properties are cached until state changes
- Watchers execute synchronously
- Always unwatch when components are destroyed to prevent memory leaks

## License
This module is part of KIMU-Core and follows the same license (MPL-2.0).

## Version History
- **1.0.0** - Initial release with reactive state management
