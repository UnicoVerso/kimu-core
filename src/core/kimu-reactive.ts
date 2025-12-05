/**
 * KIMU Reactive System
 * 
 * This module provides reactive property decorators and utilities for KIMU components.
 * Inspired by Lit, Vue 3, and modern reactive frameworks, it enables automatic re-rendering
 * when component properties change.
 * 
 * Key Features:
 * - @property decorator for reactive properties (like Lit)
 * - reactive() function for proxy-based reactivity (like Vue 3)
 * - Type-safe and TypeScript-friendly
 * - Automatic change detection and re-rendering
 * - Support for various data types (String, Number, Boolean, Array, Object)
 * 
 * Usage Examples:
 * 
 * ```typescript
 * // Using @property decorator
 * export class MyComponent extends KimuComponentElement {
 *   @property({ type: Number })
 *   counter = 0;
 * 
 *   increment() {
 *     this.counter++; // Auto re-render!
 *   }
 * }
 * 
 * // Using reactive() for objects
 * export class MyComponent extends KimuComponentElement {
 *   private state = reactive({
 *     count: 0,
 *     items: []
 *   });
 * 
 *   increment() {
 *     this.state.count++; // Auto re-render!
 *   }
 * }
 * ```
 */

/**
 * Options for the @property decorator
 */
export interface PropertyOptions {
  /**
   * The type of the property. Used for type conversion and validation.
   * Supported types: String, Number, Boolean, Array, Object
   */
  type?: StringConstructor | NumberConstructor | BooleanConstructor | ArrayConstructor | ObjectConstructor;
  
  /**
   * Whether the property should reflect to an attribute.
   * If true, changes to the property will update the corresponding HTML attribute.
   */
  reflect?: boolean;
  
  /**
   * Custom attribute name. If not specified, uses the property name converted to kebab-case.
   */
  attribute?: string | false;
  
  /**
   * Converter function for custom type conversion.
   */
  converter?: (value: any, type?: any) => any;
  
  /**
   * Whether to prevent the initial render when the property is set.
   */
  noRender?: boolean;
}

/**
 * Convert a property name to attribute name (camelCase to kebab-case)
 */
function toAttributeName(propertyName: string): string {
  return propertyName.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Default type converter for common types
 */
function defaultConverter(value: any, type?: any): any {
  if (type === String) {
    return value == null ? '' : String(value);
  }
  if (type === Number) {
    return value == null ? 0 : Number(value);
  }
  if (type === Boolean) {
    return value != null && value !== 'false';
  }
  if (type === Array) {
    return Array.isArray(value) ? value : [];
  }
  if (type === Object) {
    return typeof value === 'object' ? value : {};
  }
  return value;
}

/**
 * Reactive property decorator
 * 
 * Transforms a class property into a reactive property that automatically
 * triggers re-rendering when its value changes.
 * 
 * @param options - Configuration options for the reactive property
 * @returns Property decorator function
 * 
 * @example
 * ```typescript
 * export class Counter extends KimuComponentElement {
 *   @property({ type: Number })
 *   count = 0;
 * 
 *   @property({ type: String, reflect: true })
 *   label = 'Counter';
 * 
 *   @property({ type: Boolean, attribute: 'is-active' })
 *   isActive = false;
 * }
 * ```
 */
export function property(options: PropertyOptions = {}) {
  return function (target: any, propertyKey: string) {
    const privateKey = `__${propertyKey}`;
    const type = options.type;
    const converter = options.converter || defaultConverter;
    const reflect = options.reflect ?? false;
    const noRender = options.noRender ?? false;
    
    // Determine attribute name
    let attributeName: string | null = null;
    if (options.attribute !== false) {
      attributeName = typeof options.attribute === 'string' 
        ? options.attribute 
        : toAttributeName(propertyKey);
    }
    
    // Store reactive properties metadata on the constructor
    if (!target.constructor.__kimu_reactive_properties__) {
      target.constructor.__kimu_reactive_properties__ = new Map();
    }
    target.constructor.__kimu_reactive_properties__.set(propertyKey, {
      type,
      reflect,
      attribute: attributeName,
      converter,
      noRender
    });
    
    // Define the reactive property
    Object.defineProperty(target, propertyKey, {
      get() {
        return this[privateKey];
      },
      set(value: any) {
        const oldValue = this[privateKey];
        
        // Convert value if type is specified
        const newValue = type ? converter(value, type) : value;
        
        // Only update if value actually changed
        if (oldValue === newValue) {
          return;
        }
        
        this[privateKey] = newValue;
        
        // Reflect to attribute if enabled
        if (reflect && attributeName && this instanceof HTMLElement) {
          if (newValue == null || newValue === false) {
            this.removeAttribute(attributeName);
          } else if (type === Boolean) {
            this.setAttribute(attributeName, '');
          } else {
            this.setAttribute(attributeName, String(newValue));
          }
        }
        
        // Trigger re-render if component has refresh method
        if (!noRender && typeof this.refresh === 'function') {
          // Use requestAnimationFrame to batch multiple updates
          if (!this.__kimu_render_pending__) {
            this.__kimu_render_pending__ = true;
            requestAnimationFrame(() => {
              this.__kimu_render_pending__ = false;
              this.refresh();
            });
          }
        }
      },
      enumerable: true,
      configurable: true
    });
  };
}

/**
 * Creates a reactive proxy for an object
 * 
 * All property changes on the returned proxy will trigger re-rendering
 * of the component that owns it.
 * 
 * @param target - The object to make reactive
 * @param component - The component instance (optional, will be auto-detected)
 * @returns Reactive proxy of the target object
 * 
 * @example
 * ```typescript
 * export class TodoList extends KimuComponentElement {
 *   private state = reactive({
 *     todos: [],
 *     filter: 'all'
 *   });
 * 
 *   addTodo(text: string) {
 *     this.state.todos.push({ text, done: false }); // Auto re-render!
 *   }
 * 
 *   setFilter(filter: string) {
 *     this.state.filter = filter; // Auto re-render!
 *   }
 * }
 * ```
 */
export function reactive<T extends object>(target: T, component?: any): T {
  // Store the component reference
  const componentRef = component || null;
  
  const handler: ProxyHandler<T> = {
    get(obj: T, prop: string | symbol): any {
      const value = Reflect.get(obj, prop);
      
      // If the value is an object, make it reactive too (deep reactivity)
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return reactive(value, componentRef || (obj as any).__component);
      }
      
      return value;
    },
    
    set(obj: T, prop: string | symbol, value: any): boolean {
      const oldValue = Reflect.get(obj, prop);
      
      // Only update if value actually changed
      if (oldValue === value) {
        return true;
      }
      
      const result = Reflect.set(obj, prop, value);
      
      // Trigger re-render on the component
      const comp = componentRef || (obj as any).__component;
      if (comp && typeof comp.refresh === 'function') {
        // Use requestAnimationFrame to batch multiple updates
        if (!comp.__kimu_render_pending__) {
          comp.__kimu_render_pending__ = true;
          requestAnimationFrame(() => {
            comp.__kimu_render_pending__ = false;
            comp.refresh();
          });
        }
      }
      
      return result;
    },
    
    deleteProperty(obj: T, prop: string | symbol): boolean {
      const result = Reflect.deleteProperty(obj, prop);
      
      // Trigger re-render on the component
      const comp = componentRef || (obj as any).__component;
      if (comp && typeof comp.refresh === 'function') {
        comp.refresh();
      }
      
      return result;
    }
  };
  
  const proxy = new Proxy(target, handler);
  
  // Store component reference on the proxy for nested reactivity
  if (componentRef) {
    (proxy as any).__component = componentRef;
  }
  
  return proxy;
}

/**
 * Check if an object is a reactive proxy
 * 
 * @param obj - Object to check
 * @returns true if the object is a reactive proxy
 */
export function isReactive(obj: any): boolean {
  return obj && typeof obj === 'object' && '__component' in obj;
}

/**
 * Get the raw (non-reactive) version of a reactive object
 * 
 * @param proxy - Reactive proxy object
 * @returns Original non-reactive object
 */
export function toRaw<T>(proxy: T): T {
  // For now, we don't store the original object, so we return the proxy
  // In a more advanced implementation, we could use a WeakMap to track originals
  return proxy;
}

/**
 * Initialize reactive properties from attributes
 * 
 * This should be called in the connectedCallback of components that use @property
 * 
 * @param component - The component instance
 */
export function initReactiveProperties(component: any): void {
  const reactiveProps = component.constructor.__kimu_reactive_properties__;
  
  if (!reactiveProps) {
    return;
  }
  
  // Initialize properties from attributes
  reactiveProps.forEach((options: any, propertyKey: string) => {
    const attributeName = options.attribute;
    
    if (attributeName && component instanceof HTMLElement) {
      const attributeValue = component.getAttribute(attributeName);
      
      if (attributeValue !== null) {
        // Convert attribute value to property value
        const converter = options.converter || defaultConverter;
        (component as any)[propertyKey] = converter(attributeValue, options.type);
      }
    }
  });
}

/**
 * Setup attribute observation for reactive properties
 * 
 * This should be called in the component class to enable attribute reflection
 * 
 * @param component - The component instance
 * @returns Array of observed attributes
 */
export function getObservedAttributes(component: any): string[] {
  const reactiveProps = component.constructor.__kimu_reactive_properties__;
  
  if (!reactiveProps) {
    return [];
  }
  
  const attributes: string[] = [];
  
  reactiveProps.forEach((options: any) => {
    if (options.attribute) {
      attributes.push(options.attribute);
    }
  });
  
  return attributes;
}

/**
 * Handle attribute changes for reactive properties
 * 
 * This should be called from attributeChangedCallback
 * 
 * @param component - The component instance
 * @param name - Attribute name
 * @param oldValue - Old attribute value
 * @param newValue - New attribute value
 */
export function handleAttributeChange(
  component: any,
  name: string,
  _oldValue: string | null,
  newValue: string | null
): void {
  const reactiveProps = component.constructor.__kimu_reactive_properties__;
  
  if (!reactiveProps) {
    return;
  }
  
  // Find the property that corresponds to this attribute
  reactiveProps.forEach((options: any, propertyKey: string) => {
    if (options.attribute === name) {
      const converter = options.converter || defaultConverter;
      (component as any)[propertyKey] = newValue !== null 
        ? converter(newValue, options.type) 
        : null;
    }
  });
}
