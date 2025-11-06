/**
 * State Management Service for KIMU-Core
 * 
 * Provides reactive state management with observers and computed properties.
 * Allows components to share and react to state changes.
 * 
 * @module StateService
 * @version 1.0.0
 */

export type StateListener<T = any> = (newValue: T, oldValue: T) => void;
export type ComputedGetter<T = any> = () => T;

/**
 * StateService - Reactive state management for KIMU applications
 * 
 * @example
 * ```typescript
 * import { stateService } from './modules/state/state-service';
 * 
 * // Set initial state
 * stateService.setState('user', { id: 1, name: 'John' });
 * 
 * // Watch for changes
 * stateService.watch('user', (newUser, oldUser) => {
 *   console.log('User changed:', newUser);
 * });
 * 
 * // Update state
 * stateService.setState('user', { id: 1, name: 'Jane' });
 * ```
 */
export class StateService {
  private state: Map<string, any> = new Map();
  private observers: Map<string, Set<StateListener>> = new Map();
  private computed: Map<string, ComputedGetter> = new Map();
  private computedCache: Map<string, any> = new Map();
  private debugMode: boolean = false;

  /**
   * Enable or disable debug mode for state logging
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Set a state value
   * 
   * @param key - State key
   * @param value - New value
   */
  setState<T = any>(key: string, value: T): void {
    const oldValue = this.state.get(key);
    
    // Check if value actually changed
    if (oldValue === value || this.deepEqual(oldValue, value)) {
      return;
    }

    this.state.set(key, value);

    if (this.debugMode) {
      console.log(`[State] Set: ${key}`, value);
    }

    // Notify observers
    this.notifyObservers(key, value, oldValue);

    // Invalidate computed properties that may depend on this key
    this.invalidateComputedCache();
  }

  /**
   * Get a state value
   * 
   * @param key - State key
   * @param defaultValue - Default value if key doesn't exist
   * @returns Current state value
   */
  getState<T = any>(key: string, defaultValue?: T): T | undefined {
    return this.state.has(key) ? this.state.get(key) : defaultValue;
  }

  /**
   * Update nested state properties
   * 
   * @param key - State key
   * @param updates - Partial updates to merge
   */
  updateState<T = any>(key: string, updates: Partial<T>): void {
    const current = this.getState<T>(key) || {} as T;
    const updated = { ...current, ...updates };
    this.setState(key, updated);
  }

  /**
   * Delete a state key
   * 
   * @param key - State key to delete
   */
  deleteState(key: string): void {
    const oldValue = this.state.get(key);
    this.state.delete(key);

    if (this.debugMode) {
      console.log(`[State] Deleted: ${key}`);
    }

    // Notify observers with undefined as new value
    this.notifyObservers(key, undefined, oldValue);
  }

  /**
   * Check if a state key exists
   * 
   * @param key - State key
   * @returns True if key exists
   */
  hasState(key: string): boolean {
    return this.state.has(key);
  }

  /**
   * Watch for state changes
   * 
   * @param key - State key to watch
   * @param listener - Callback when state changes
   * @returns Unwatch function
   */
  watch<T = any>(key: string, listener: StateListener<T>): () => void {
    if (!this.observers.has(key)) {
      this.observers.set(key, new Set());
    }

    this.observers.get(key)!.add(listener);

    if (this.debugMode) {
      console.log(`[State] Watching: ${key}`);
    }

    // Return unwatch function
    return () => this.unwatch(key, listener);
  }

  /**
   * Stop watching a state key
   * 
   * @param key - State key
   * @param listener - Listener to remove
   */
  unwatch(key: string, listener: StateListener): void {
    if (this.observers.has(key)) {
      this.observers.get(key)!.delete(listener);

      if (this.observers.get(key)!.size === 0) {
        this.observers.delete(key);
      }

      if (this.debugMode) {
        console.log(`[State] Unwatched: ${key}`);
      }
    }
  }

  /**
   * Define a computed property
   * 
   * @param key - Computed property key
   * @param getter - Function that computes the value
   */
  defineComputed<T = any>(key: string, getter: ComputedGetter<T>): void {
    this.computed.set(key, getter);
    this.computedCache.delete(key); // Invalidate cache

    if (this.debugMode) {
      console.log(`[State] Computed defined: ${key}`);
    }
  }

  /**
   * Get a computed property value (cached)
   * 
   * @param key - Computed property key
   * @returns Computed value
   */
  getComputed<T = any>(key: string): T | undefined {
    if (!this.computed.has(key)) {
      return undefined;
    }

    // Return cached value if available
    if (this.computedCache.has(key)) {
      return this.computedCache.get(key);
    }

    // Compute and cache
    const getter = this.computed.get(key)!;
    const value = getter();
    this.computedCache.set(key, value);

    if (this.debugMode) {
      console.log(`[State] Computed: ${key}`, value);
    }

    return value;
  }

  /**
   * Get all state as a plain object
   */
  getAll(): Record<string, any> {
    return Object.fromEntries(this.state.entries());
  }

  /**
   * Clear all state
   */
  clear(): void {
    this.state.clear();
    this.observers.clear();
    this.computed.clear();
    this.computedCache.clear();

    if (this.debugMode) {
      console.log('[State] Cleared all state');
    }
  }

  /**
   * Reset state to initial values
   * 
   * @param initialState - Initial state object
   */
  reset(initialState: Record<string, any> = {}): void {
    this.clear();
    Object.entries(initialState).forEach(([key, value]) => {
      this.setState(key, value);
    });
  }

  /**
   * Subscribe to multiple state keys
   * 
   * @param keys - Array of state keys
   * @param listener - Callback when any key changes
   * @returns Unsubscribe function
   */
  watchMultiple(keys: string[], listener: (key: string, newValue: any, oldValue: any) => void): () => void {
    const unwatchers = keys.map(key => 
      this.watch(key, (newValue, oldValue) => listener(key, newValue, oldValue))
    );

    return () => unwatchers.forEach(unwatch => unwatch());
  }

  // Private helpers

  private notifyObservers(key: string, newValue: any, oldValue: any): void {
    if (this.observers.has(key)) {
      const listeners = Array.from(this.observers.get(key)!);
      listeners.forEach(listener => {
        try {
          listener(newValue, oldValue);
        } catch (error) {
          console.error(`[State] Error in observer for "${key}":`, error);
        }
      });
    }
  }

  private invalidateComputedCache(): void {
    this.computedCache.clear();
  }

  private deepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== 'object' || typeof b !== 'object') return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!this.deepEqual(a[key], b[key])) return false;
    }

    return true;
  }
}

// Export singleton instance
export const stateService = new StateService();
