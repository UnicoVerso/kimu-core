/**
 * KIMU Reactive System - Optimized & Minimal
 * 
 * Lightweight reactive property decorator for KIMU components.
 * Designed for simplicity, performance, and minimal bundle size.
 * 
 * Philosophy: KIMU is intentionally minimal. We focus on doing the essentials
 * perfectly, not everything adequately. For complex reactivity needs, use Vue/React.
 * 
 * Usage Example:
 * 
 * ```typescript
 * export class MyComponent extends KimuComponentElement {
 *   @property({ type: Number })
 *   counter = 0;
 * 
 *   @property({ type: String, reflect: true })
 *   label = 'Counter';
 * 
 *   increment() {
 *     this.counter++; // Auto re-render!
 *   }
 * }
 * ```
 */

/**
 * Options for the @property decorator
 */
export interface PropertyOptions {
  /**
   * The type of the property. Used for type conversion.
   * Supported types: String, Number, Boolean
   */
  type?: StringConstructor | NumberConstructor | BooleanConstructor;
  
  /**
   * Whether the property should reflect to an attribute.
   * If true, changes to the property will update the corresponding HTML attribute.
   */
  reflect?: boolean;
}

/**
 * Convert property name to attribute name (camelCase to kebab-case)
 */
const toKebab = (str: string): string => str.replace(/([A-Z])/g, '-$1').toLowerCase();

/**
 * Convert value to specified type
 * @param value - Value to convert
 * @param type - Target type constructor
 * @returns Converted value
 */
function convert(value: any, type?: any): any {
  if (!type) return value;
  if (type === Number) return value == null ? 0 : Number(value) || 0;
  if (type === Boolean) return value !== null && value !== 'false' && value !== false;
  if (type === String) return value == null ? '' : String(value);
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
 * }
 * ```
 */
export function property(options: PropertyOptions = {}) {
  return function (target: any, propertyKey: string) {
    const privateKey = `__${propertyKey}`;
    const { type, reflect = false } = options;
    const attrName = toKebab(propertyKey);
    
    // Store metadata for attribute observation
    const ctor = target.constructor;
    if (!ctor.__kimu_reactive_props__) {
      ctor.__kimu_reactive_props__ = new Map();
      ctor.__kimu_attr_to_prop__ = new Map(); // Inverse map for O(1) lookup
    }
    ctor.__kimu_reactive_props__.set(propertyKey, { type, reflect, attribute: attrName });
    ctor.__kimu_attr_to_prop__.set(attrName, { propertyKey, type }); // Store inverse mapping
    
    // Define the reactive property with optimized getter/setter
    Object.defineProperty(target, propertyKey, {
      get() {
        return this[privateKey];
      },
      set(value: any) {
        const oldValue = this[privateKey];
        const newValue = type ? convert(value, type) : value;
        
        // Early return if value hasn't changed
        if (oldValue === newValue) return;
        
        this[privateKey] = newValue;
        
        // Reflect to attribute if enabled (optimized conditionals)
        if (reflect && this instanceof HTMLElement) {
          if (newValue == null || newValue === false) {
            this.removeAttribute(attrName);
          } else {
            this.setAttribute(attrName, type === Boolean ? '' : String(newValue));
          }
        }
        
        // Batched re-render using RAF (prevents multiple renders in same frame)
        // Call refresh directly - it already handles RAF batching internally
        if (typeof this.refresh === 'function') {
          this.refresh();
        }
      },
      enumerable: true,
      configurable: true
    });
  };
}


/**
 * Initialize reactive properties from attributes
 * 
 * This should be called in the connectedCallback of components that use @property
 * 
 * @param component - The component instance
 */
export function initReactiveProperties(component: any): void {
  const props = component.constructor.__kimu_reactive_props__;
  if (!props) return;
  
  // Initialize properties from attributes
  props.forEach((options: any, propertyKey: string) => {
    const attrValue = component.getAttribute(options.attribute);
    if (attrValue !== null) {
      (component as any)[propertyKey] = convert(attrValue, options.type);
    }
  });
}

/**
 * Get observed attributes for reactive properties
 * 
 * @param componentClass - The component class
 * @returns Array of observed attributes
 */
export function getObservedAttributes(componentClass: any): string[] {
  const props = componentClass.__kimu_reactive_props__;
  if (!props) return [];
  
  return Array.from(props.values())
    .map((opts: any) => opts.attribute)
    .filter(Boolean);
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
  const attrMap = component.constructor.__kimu_attr_to_prop__;
  if (!attrMap) return;
  
  // O(1) lookup using inverse map
  const propInfo = attrMap.get(name);
  if (propInfo) {
    component[propInfo.propertyKey] = newValue !== null 
      ? convert(newValue, propInfo.type) 
      : null;
  }
}

