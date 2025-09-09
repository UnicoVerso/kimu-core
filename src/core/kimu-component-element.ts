import { KimuEngine } from './kimu-engine';
import { KimuExtensionManager } from './kimu-extension-manager';
import { KimuExtensionMeta } from './kimu-types';
import { KimuPathConfig } from './kimu-path-config';

/**
 * The `KimuComponentElement` class serves as the base class for all components and extensions
 * in the Kimu framework. It provides lifecycle hooks, metadata management, and utility methods
 * for rendering and managing resources.
 * 
 * Key functionalities:
 * - Provides lifecycle hooks (`onInit`, `onRender`, `onDestroy`) for component management.
 * - Manages metadata associated with the component.
 * - Handles template rendering and resource loading.
 * - Supports dependency injection and external asset management.
 * 
 * This class is designed to be extended by custom components and used with the `@KimuComponent` decorator.
 */
export abstract class KimuComponentElement extends HTMLElement {

  /** Global optimization settings - simplified */
  private static _optimizationSettings = {
    enableTemplateCache: true,
    enableFileCache: true,
    enableRenderDebouncing: true,
    enableErrorBoundaries: true,  // New: Safe error isolation
    cacheMaxSize: 50,             // New: Cache size limiting  
    enableAssetPreloading: false  // New: Asset preloading (opt-in)
  };

  /**
   * Configure global optimization settings for all components
   */
  static configureOptimizations(settings: Partial<typeof KimuComponentElement._optimizationSettings>) {
    Object.assign(this._optimizationSettings, settings);
    
    // Apply cache size settings to KimuEngine
    if (settings.cacheMaxSize !== undefined) {
      KimuEngine.configureCaching(settings.cacheMaxSize);
    }
  }

  /**
   * Get current optimization settings (for debugging)
   */
  static getOptimizationSettings() {
    return { ...this._optimizationSettings };
  }

  /**
   * Preload critical assets for better performance
   */
  static async preloadAssets(assetPaths: string[]): Promise<void> {
    if (!this._optimizationSettings.enableAssetPreloading) {
      console.warn('[KimuComponentElement] Asset preloading is disabled');
      return;
    }
    
    return KimuEngine.preloadAssets(assetPaths);
  }

  /**
   * Force refresh without optimizations (for debugging)
   */
  async forceRefresh(): Promise<void> {
    if (!this._renderFn) {
      console.warn('[KimuComponentElement] ⚠️ Template render function (_renderFn) not initialized for component:', this.tagName);
      return;
    }
    
    // Reset debouncing state
    this._renderScheduled = false;
    
    // Force render immediately
    const currentData = this.getData();
    await KimuEngine.render(this, currentData, this._renderFn!);
    this.onRender();
  }

  /** Private reference to the KimuApp singleton (lazy loaded) */
  private _app: any = null;
  /** Each component must provide data for rendering */
  getData(): Record<string, any> {
    return {};
  }

  /** Lifecycle: initialization */
  onInit(): void { }

  /** Called every time after a render or refresh */
  onRender(): void { }

  /** Debounce re-renders using requestAnimationFrame */
  private _renderScheduled = false;

  /** Lifecycle: destruction */
  onDestroy(): void { }

  /** Optional error handling hook - override in components that need custom error handling */
  onError?(error: Error): void;

  /** Hook for loading the template */
  private _renderFn?: (html: any, data: Record<string, any>) => any;

  /** Lifecycle: destruction (override for custom cleanup, calls onDestroy by default) */
  _onDestroyInternal(): void {
    this.onDestroy();
  }

  /**
   * Returns the KimuApp singleton, importing it dynamically only once.
   * Usage: await this.getApp() in your extension/component.
   */
  protected async getApp(): Promise<any> {
    if (this._app) {
      return this._app;
    }
    // Dynamically import KimuApp to avoid circular dependencies
    const { KimuApp } = await import('./kimu-app');
    this._app = KimuApp.getInstance();
    return this._app;
  }

  /**
   * Constructor for the Kimu component.
   * Initializes the shadow DOM and attaches it to the component.
   */
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    //console.log("\n\n###### META DATA: ", this.getMeta());
  }

  /** Shortcut for querying the DOM */
  $(selector: string): HTMLElement | null {
    return this.shadowRoot?.querySelector(selector) ?? null;
  }

  /** Retrieves metadata associated with the component */
  protected getMeta(): KimuExtensionMeta {
    return (this.constructor as any).__kimu_meta__ as KimuExtensionMeta;
  }

  /** 
   * Hook called automatically by the browser when the component is connected to the DOM.
   * Method automatically called by the browser when the component is connected.
   */
  async connectedCallback(): Promise<void> {
    const meta = this.getMeta();
    //console.log('[KimuComponentElement] Init tag:', this.tagName, 'meta:', meta);
    if (!meta || !meta.tag) {
      console.warn('[KimuComponentElement] ❌ No metadata found for the component:', this.tagName , " - meta:", meta);
      return;
    }

    // Reset debouncing state on connect
    this._renderScheduled = false;

    // Load dependencies - use Promise.all for parallel loading
    if (meta.dependencies?.length) {
      const manager = KimuExtensionManager.getInstance();
      await Promise.all(meta.dependencies.map(dep => manager.load(dep)));
    }

    // Inject default CSS for the component
    await KimuEngine.injectStyle(this, 'assets/kimu-style.css', 'kimu-style-ext-default');

    // Inject external styles (if present, just once)
    if (meta.style) {
      let styleId = `kimu-style-ext-${meta.tag}`;
      const cssPath = KimuPathConfig.resolvePath(`extensions/${meta.basePath}/${meta.style}`);
      await KimuEngine.injectStyle(this, cssPath, styleId);
    }
    
    // Compile the template on the first connection
    if (meta.template) {
      const templatePath = KimuPathConfig.resolvePath(`extensions/${meta.basePath}/${meta.template}`);
      // Use template caching based on global settings
      const useCache = KimuComponentElement._optimizationSettings.enableTemplateCache;
      this._renderFn = await KimuEngine.loadTemplate(templatePath, useCache);
    }
    
    // Initial render - wait for completion before calling onInit
    await this.refresh(); // Render the template with data and wait for completion
    // Call the initialization hook - DOM is now guaranteed to be ready
    this.onInit();   // Call once, after DOM is fully rendered
  }

  /** Forces a refresh of the interface component */
  async refresh(): Promise<void> {
    if (!this._renderFn) {
      console.warn('[KimuComponentElement] ⚠️ Template render function (_renderFn) not initialized for component:', this.tagName);
      return;
    }

    // Skip debouncing if disabled
    if (!KimuComponentElement._optimizationSettings.enableRenderDebouncing) {
      await this._doRender();
      return;
    }

    // Debounce renders using requestAnimationFrame - return Promise for proper awaiting
    if (this._renderScheduled) {
      return;
    }

    this._renderScheduled = true;
    
    return new Promise<void>((resolve) => {
      requestAnimationFrame(async () => {
        try {
          await this._doRender();
          resolve();
        } catch (error) {
          console.error('[KimuComponentElement] Render error:', error);
          resolve(); // Resolve anyway to prevent hanging
        } finally {
          this._renderScheduled = false;
        }
      });
    });
  }

  /**
   * Internal render method - simplified without snapshot optimization
   */
  private async _doRender(): Promise<void> {
    if (!KimuComponentElement._optimizationSettings.enableErrorBoundaries) {
      // Original behavior without error boundaries
      const currentData = this.getData();
      await KimuEngine.render(this, currentData, this._renderFn!);
      this.onRender();
      return;
    }

    // Safe rendering with error boundaries
    try {
      const currentData = this.getData();
      await KimuEngine.render(this, currentData, this._renderFn!);
      this.onRender();
    } catch (error) {
      console.error(`[${this.tagName}] Render error:`, error);
      console.error('Component data:', this.getData());
      
      // Fallback UI - safe and informative
      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = `
          <div style="
            color: #721c24; 
            background-color: #f8d7da; 
            border: 1px solid #f5c6cb; 
            padding: 10px; 
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
          ">
            <strong>⚠️ Component Error</strong><br>
            <em>${this.tagName}</em><br>
            ${error instanceof Error ? error.message : 'Unknown error'}
          </div>
        `;
      }
      
      // Call error hook if available
      if (typeof this.onError === 'function') {
        try {
          this.onError(error instanceof Error ? error : new Error(String(error)));
        } catch (hookError) {
          console.error(`[${this.tagName}] Error in onError hook:`, hookError);
        }
      }
    }
  }

  /** 
   * Hook called automatically when the component is disconnected from the DOM.
   * Method automatically called on logout.
  */
  disconnectedCallback(): void {
    // Clean up debouncing state
    this._renderScheduled = false;
    
    // Call the destruction hook
    this._onDestroyInternal();
  }

  /** Loads a resource from an external file */
  loadResource(file: string): Promise<any> {
    const path = this.getMeta()?.path;
    if (!path) throw new Error('Extension without valid path');
    const resourcePath = KimuPathConfig.resolvePath(`extensions/${path}/resources/${file}`);
    return fetch(resourcePath).then(r => r.json());
  }
  
  /** Loads an asset from an external file */
  loadAssetUrl(file: string): string {
    const path = this.getMeta()?.path;
    return KimuPathConfig.resolvePath(`extensions/${path}/assets/${file}`);
  }
}