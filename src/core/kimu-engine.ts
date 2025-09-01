import { TemplateResult } from 'lit';
import { KimuRender } from './kimu-render';
import { KimuAssetManager } from './kimu-asset-manager';

/**
 * The `KimuEngine` class provides core functionalities for rendering, template management,
 * and component loading in the Kimu framework. It acts as a bridge between the rendering engine
 * (Lit) and the asset manager, enabling dynamic and reactive UI updates.
 * 
 * Key functionalities:
 * - Injects styles into the Shadow DOM of components.
 * - Loads and compiles HTML templates into Lit rendering functions.
 * - Provides reactive rendering capabilities using Lit.
 * - Dynamically loads and registers custom components.
 */
export class KimuEngine {

  /** Cache for compiled templates to avoid recompilation */
  private static _templateCache = new Map<string, any>();
  
  /** Cache access tracking for LRU eviction */
  private static _cacheAccessTime = new Map<string, number>();
  
  /** Maximum cache size to prevent memory issues */
  private static _maxCacheSize = 50;

  /**
   * Safely evict oldest cache entries when limit is reached
   */
  private static _evictOldestEntries(): void {
    if (this._templateCache.size < this._maxCacheSize) return;
    
    // Get entries sorted by access time (oldest first)
    const entriesToEvict = Array.from(this._cacheAccessTime.entries())
      .sort(([, a], [, b]) => a - b)
      .slice(0, Math.floor(this._templateCache.size * 0.2)) // Evict 20%
      .map(([path]) => path);
    
    // Remove from both caches
    entriesToEvict.forEach(path => {
      this._templateCache.delete(path);
      this._cacheAccessTime.delete(path);
    });
    
    if (entriesToEvict.length > 0) {
      console.log(`[KimuEngine] Evicted ${entriesToEvict.length} old template cache entries`);
    }
  }

  /**
   * Configure cache settings
   */
  static configureCaching(maxSize: number = 50): void {
    this._maxCacheSize = maxSize;
  }

  /**
   * Clear all caches (for debugging/testing)
   */
  static clearCaches(): void {
    this._templateCache.clear();
    this._cacheAccessTime.clear();
  }

  /**
   * Preload critical assets to improve performance
   */
  static async preloadAssets(paths: string[]): Promise<void> {
    if (paths.length === 0) return;
    
    console.log(`[KimuEngine] Preloading ${paths.length} assets...`);
    
    // Preload in parallel but with limited concurrency to avoid overwhelming the browser
    const BATCH_SIZE = 5;
    const batches = [];
    
    for (let i = 0; i < paths.length; i += BATCH_SIZE) {
      batches.push(paths.slice(i, i + BATCH_SIZE));
    }
    
    for (const batch of batches) {
      const promises = batch.map(async (path) => {
        try {
          if (path.endsWith('.html')) {
            // Preload template
            await this.loadTemplate(path, true);
          } else if (path.endsWith('.css')) {
            // Preload style (just fetch to cache)
            await KimuAssetManager.fetchFile(path);
          } else {
            // Generic asset preload
            await KimuAssetManager.fetchFile(path);
          }
        } catch (error) {
          console.warn(`[KimuEngine] Failed to preload asset: ${path}`, error);
        }
      });
      
      await Promise.all(promises);
    }
    
    console.log(`[KimuEngine] Preloading completed`);
  }

  /**
   * Injects an inline style from a file into the Shadow DOM of a component.
   * 
   * @param component - The target component.
   * @param stylePath - Path to the style file.
   * @param styleId - Optional ID for the style element.
   */
  static async injectStyle(component: HTMLElement, stylePath: string, styleId: string | null = null): Promise<void> {
    return KimuAssetManager.injectStyle(component, stylePath, styleId);
  }

  /**
   * Loads and compiles an HTML template from a file into a Lit rendering function.
   * 
   * @param path - Path to the template file.
   * @param useCache - Whether to use template cache (default: true)
   * @returns A compiled Lit rendering function.
   * @throws Error if the template file is not found.
   */
  static async loadTemplate(path: string, useCache: boolean = true) {
    // Check cache first (if caching is enabled)
    if (useCache && this._templateCache.has(path)) {
      // Update access time for LRU
      this._cacheAccessTime.set(path, Date.now());
      return this._templateCache.get(path);
    }

    //console.log(`[KimuEngine] 🔄 Loading template: ${path}`);
    const template: string | null = await KimuAssetManager.fetchFile(path);
    if (!template) {
      throw new Error(`[KimuEngine] ⚠️ Template not found: ${template}`);
    }
    
    const compiledTemplate = KimuRender.loadTemplate(template);
    
    // Cache the compiled template (if caching is enabled)
    if (useCache) {
      // Check if we need to evict old entries first
      this._evictOldestEntries();
      
      this._templateCache.set(path, compiledTemplate);
      this._cacheAccessTime.set(path, Date.now());
    }
    
    return compiledTemplate;
  }

  /**
   * Compiles an HTML string into a dynamic Lit rendering function.
   * 
   * @param template - The HTML string to compile.
   * @returns A Lit rendering function.
   */
  static compileTemplate(template: string): (html: typeof import('lit').html, data: Record<string, any>) => TemplateResult {
    return KimuRender.compileTemplate(template);
  }

  /**
   * Performs reactive rendering using Lit.
   * 
   * @param component - The target component.
   * @param data - Data to be passed to the rendering function.
   * @param renderFn - The Lit rendering function.
   */
  static render(component: HTMLElement, data: Record<string, any>, renderFn: (html: any, data: Record<string, any>) => TemplateResult): void {
    KimuRender.render(component, data, renderFn);
  }

  /**
   * Loads a component from a specified path and registers it if not already registered.
   * 
   * @param tag - The tag name of the component.
   * @param path - Path to the component module.
   * @returns The loaded module.
   */
  static async loadComponent(tag: string, path: string): Promise<any> {
    if (customElements.get(tag)) {
      return; // Already registered
    }
    const module = await import(/* @vite-ignore */ path);
    return module;
  }

}
