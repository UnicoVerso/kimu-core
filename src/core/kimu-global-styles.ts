/**
 * KimuGlobalStyles manages global CSS files that should be injected into all extensions.
 * This allows modules (like the theme module) to register additional global styles
 * without hardcoding dependencies in the core framework.
 * 
 * Usage:
 * - Core always injects 'assets/kimu-style.css' as the base style
 * - Modules can register additional global CSS using registerGlobalStyle()
 * - All registered styles are automatically injected into every extension's shadow root
 */
export class KimuGlobalStyles {
  /** List of global CSS files to inject in all extensions */
  private static _globalStyles: Array<{ id: string; path: string }> = [
    // Default KIMU base styles - always included
    { id: 'kimu-style-default', path: 'assets/kimu-style.css' }
  ];

  /**
   * Register a global CSS file to be injected in all extensions.
   * This is useful for modules that want to provide global theming or styling.
   * 
   * @param id - Unique identifier for the style (e.g., 'theme-dark', 'theme-light')
   * @param path - Path to the CSS file relative to the base path
   * 
   * @example
   * // In a theme module
   * KimuGlobalStyles.registerGlobalStyle('theme-active', 'themes/theme-dark.css');
   */
  static registerGlobalStyle(id: string, path: string): void {
    // Check if already registered
    const existing = this._globalStyles.find(s => s.id === id);
    if (existing) {
      // Update path if already registered
      existing.path = path;
      console.log(`[KimuGlobalStyles] Updated global style: ${id} -> ${path}`);
    } else {
      // Add new global style
      this._globalStyles.push({ id, path });
      console.log(`[KimuGlobalStyles] Registered global style: ${id} -> ${path}`);
    }
  }

  /**
   * Unregister a global CSS file.
   * 
   * @param id - Unique identifier of the style to remove
   */
  static unregisterGlobalStyle(id: string): void {
    const index = this._globalStyles.findIndex(s => s.id === id);
    if (index !== -1) {
      this._globalStyles.splice(index, 1);
      console.log(`[KimuGlobalStyles] Unregistered global style: ${id}`);
    }
  }

  /**
   * Get all registered global styles.
   * Used internally by KimuComponentElement to inject styles into extensions.
   * 
   * @returns Array of registered global styles
   */
  static getGlobalStyles(): Array<{ id: string; path: string }> {
    return [...this._globalStyles]; // Return a copy to prevent external modifications
  }

  /**
   * Clear all registered styles (useful for testing or reset scenarios).
   * Note: This will also remove the default kimu-style.css.
   */
  static clearAllStyles(): void {
    this._globalStyles = [
      { id: 'kimu-style-default', path: 'assets/kimu-style.css' }
    ];
    console.log('[KimuGlobalStyles] Cleared all global styles, keeping only default');
  }

  /**
   * Get the number of registered global styles.
   */
  static getStyleCount(): number {
    return this._globalStyles.length;
  }

  /**
   * Check if a specific style ID is registered.
   */
  static hasStyle(id: string): boolean {
    return this._globalStyles.some(s => s.id === id);
  }

  /**
   * Update a specific global style in all currently loaded extensions.
   * This is useful when a theme changes and needs to be propagated to all extensions.
   * 
   * @param id - Style ID to update (e.g., 'kimu-theme-active')
   * 
   * Note: This method uses KimuEngine.injectStyle() to update styles in all shadow roots.
   * It requires KimuEngine to be imported dynamically to avoid circular dependencies.
   */
  static async updateStyleInAllExtensions(id: string): Promise<void> {
    const style = this._globalStyles.find(s => s.id === id);
    if (!style) {
      console.warn(`[KimuGlobalStyles] Style "${id}" not found, cannot update`);
      return;
    }

    // Find all custom elements (extensions) in the DOM
    const allCustomElements = document.querySelectorAll('*');
    const extensions: HTMLElement[] = [];

    allCustomElements.forEach((el) => {
      // Check if element is a custom element with shadow root
      if (el.tagName.includes('-') && (el as any).shadowRoot) {
        extensions.push(el as HTMLElement);
      }
    });

    if (extensions.length === 0) {
      console.log('[KimuGlobalStyles] No extensions found to update');
      return;
    }

    // Dynamically import KimuEngine to avoid circular dependency
    const { KimuEngine } = await import('./kimu-engine');

    // Update style in all extensions
    console.log(`[KimuGlobalStyles] Updating style "${id}" in ${extensions.length} extensions`);
    for (const ext of extensions) {
      try {
        await KimuEngine.injectStyle(ext, style.path, style.id);
      } catch (error) {
        console.warn(`[KimuGlobalStyles] Failed to update style in ${ext.tagName}:`, error);
      }
    }
  }
}
