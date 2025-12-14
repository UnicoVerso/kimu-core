/**
 * Theme Service for KIMU-Core
 * 
 * Provides theme management with CSS-based themes, custom CSS variables,
 * persistent storage, and system preference detection.
 * 
 * @module ThemeService
 * @version 2.0.0
 */

import { KimuGlobalStyles } from '../../core/kimu-global-styles';
import themesConfigDefault from './themes-config-default.json';

// Try to load themes configuration from user's config folder
// If not found, fallback to default configuration
let themesConfig: any;
try {
  // User should copy themes-config.json.example to src/config/theme/themes-config.json
  // This path is relative to the installed module location: src/modules/theme/
  themesConfig = require('../../config/theme/themes-config.json');
} catch (error) {
  console.warn(
    '\n⚠️  KIMU Theme Module: No custom themes configuration found!\n\n' +
    'Expected location: src/config/theme/themes-config.json\n\n' +
    'To create a custom configuration:\n' +
    '1. Create config folder: mkdir -p src/config/theme\n' +
    '2. Copy the example: cp src/modules/theme/themes-config.json.example src/config/theme/themes-config.json\n' +
    '3. Edit src/config/theme/themes-config.json to customize your themes\n\n' +
    'Using default themes (light, dark) as fallback.\n'
  );
  // Use default configuration as fallback
  themesConfig = themesConfigDefault;
}

// ThemeMode can be any theme name loaded from config, plus 'auto' for system preference
export type ThemeMode = 'auto' | string;

export interface ThemeColors {
  background: string;
  backgroundEnd: string;
  text: string;
  border: string;
}

export interface CssTheme {
  name: string;
  mode: 'light' | 'dark';
  cssPath: string;
  description?: string;
  icon?: string;
  colors?: ThemeColors;
}

export type ThemeChangeListener = (themeName: string, mode: ThemeMode) => void;

/**
 * ThemeService - Centralized theme management with CSS-based themes
 * 
 * @example
 * ```typescript
 * import { themeService } from './modules/theme/theme-service';
 * 
 * // Set theme mode
 * themeService.setMode('dark');
 * themeService.setMode('ocean');
 * themeService.setMode('cozy');
 * 
 * // Register a custom CSS theme
 * themeService.registerCssTheme({
 *   name: 'custom',
 *   mode: 'dark',
 *   cssPath: '/themes/custom.css'
 * });
 * 
 * // Listen to theme changes
 * themeService.onChange((themeName, mode) => {
 *   console.log('Theme changed:', themeName);
 * });
 * ```
 */
export class ThemeService {
  private currentMode: ThemeMode = 'auto';
  private currentThemeName: string = 'light';
  private listeners: Set<ThemeChangeListener> = new Set();
  private storageKey = 'kimu-theme-mode';
  private systemPreferenceQuery?: MediaQueryList;
  private cssThemes: Map<string, CssTheme> = new Map();
  private debugMode: boolean = true; // Enable debug by default for development
  private activeThemeLink?: HTMLLinkElement;

  constructor() {
    console.log('[Theme] ThemeService initializing...');
    this.initDefaultThemes();
    this.loadFromStorage();
    this.initSystemPreference();
    this.applyTheme();
    console.log('[Theme] ThemeService initialized. Current mode:', this.currentMode);
  }

  /**
   * Initialize themes from configuration file (user config or default fallback)
   */
  private initDefaultThemes(): void {
    // Theme CSS files are in public/themes/ folder
    // In development: Vite serves public/ from root → /themes/
    // In production: Vite copies public/ to dist/ → /dist/themes/
    const basePath = this.getBasePath();
    
    const themesPath = basePath === '/' 
      ? '/themes/'           // Development: public/themes/ → /themes/
      : `${basePath}themes/`; // Production: public/themes/ → /dist/themes/
    
    // Load themes from configuration (either user config or default fallback)
    if (themesConfig?.themes) {
      themesConfig.themes.forEach((theme: any) => {
        this.cssThemes.set(theme.name, {
          name: theme.name,
          mode: theme.mode as 'light' | 'dark',
          cssPath: `${themesPath}${theme.cssPath}`,
          description: theme.description,
          icon: theme.icon,
          colors: theme.colors
        });
      });

      if (this.debugMode) {
        console.log('[Theme] Initialized themes from config with base path:', basePath);
        console.log('[Theme] Themes path:', themesPath);
        console.log('[Theme] Loaded themes:', Array.from(this.cssThemes.keys()));
      }
    } else {
      console.error('[Theme] No themes configuration available - this should not happen!');
    }
  }

  /**
   * Get base path for theme files
   */
  private getBasePath(): string {
    // In development with Vite, files are served from root
    // In production, files are in /dist/
    if (typeof window !== 'undefined') {
      // Check if we're running in production (built files)
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].src;
        // If we find a script in /assets/ or with hash, we're in production
        if (src.includes('/assets/') || src.match(/\-[a-zA-Z0-9]{8}\.(js|css)$/)) {
          return '/dist/';
        }
      }
    }
    // Development mode (Vite serves from root)
    return '/';
  }

  /**
   * Enable or disable debug mode
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Set theme mode
   */
  setMode(mode: ThemeMode, persist: boolean = true): void {
    if (this.debugMode) {
      console.log('[Theme] Setting mode:', mode);
    }

    this.currentMode = mode;

    if (persist) {
      this.saveToStorage();
    }

    // updateTheme() will handle loading the CSS and notifying listeners
    this.updateTheme();
  }

  /**
   * Get current theme mode
   */
  getMode(): ThemeMode {
    return this.currentMode;
  }

  /**
   * Get current theme name
   */
  getCurrentThemeName(): string {
    return this.currentThemeName;
  }

  /**
   * Get effective mode (resolves 'auto' to actual theme)
   */
  getEffectiveMode(): string {
    if (this.currentMode === 'auto') {
      const systemPref = this.getSystemPreference();
      return systemPref;
    }
    return this.currentMode;
  }

  /**
   * Toggle between light and dark mode
   */
  toggle(): void {
    const effectiveMode = this.getEffectiveMode();
    const currentTheme = this.cssThemes.get(effectiveMode);
    
    if (!currentTheme) {
      this.setMode('light');
      return;
    }

    // Toggle between light and dark modes
    if (currentTheme.mode === 'light') {
      this.setMode('dark');
    } else {
      this.setMode('light');
    }
  }

  /**
   * Register a custom CSS theme
   */
  registerCssTheme(theme: CssTheme): void {
    this.cssThemes.set(theme.name, theme);
    
    if (this.debugMode) {
      console.log('[Theme] Registered CSS theme:', theme.name);
    }
  }

  /**
   * Get all available theme names
   */
  getAvailableThemes(): string[] {
    return Array.from(this.cssThemes.keys());
  }

  /**
   * Get theme info by name
   */
  getThemeInfo(name: string): CssTheme | undefined {
    return this.cssThemes.get(name);
  }

  /**
   * Listen to theme changes
   */
  onChange(callback: ThemeChangeListener): void {
    this.listeners.add(callback);
  }

  /**
   * Remove theme change listener
   */
  offChange(callback: ThemeChangeListener): void {
    this.listeners.delete(callback);
  }

  /**
   * Update theme based on current mode
   */
  private updateTheme(): void {
    const effectiveMode = this.getEffectiveMode();
    const theme = this.cssThemes.get(effectiveMode);

    if (!theme) {
      console.error(`[Theme] Theme "${effectiveMode}" not found`);
      return;
    }

    this.currentThemeName = theme.name;
    this.loadCssTheme(theme);
    
    // Notify listeners after theme is loaded
    this.notifyListeners();
  }

  /**
   * Load CSS theme file
   */
  private loadCssTheme(theme: CssTheme): void {
    // Remove existing theme link from main document
    if (this.activeThemeLink) {
      this.activeThemeLink.remove();
    }

    // Create new link element for main document
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = theme.cssPath;
    link.id = 'kimu-theme';
    link.setAttribute('data-theme', theme.name);

    // Wait for CSS to load before applying (optional, for smoother transitions)
    link.onload = () => {
      if (this.debugMode) {
        console.log('[Theme] CSS theme loaded:', theme.name, theme.cssPath);
      }
    };

    link.onerror = () => {
      console.error('[Theme] Failed to load CSS theme:', theme.name, theme.cssPath);
    };

    // Add to document head
    document.head.appendChild(link);
    this.activeThemeLink = link;

    // Register theme CSS as global style for all extensions
    // This will make the theme available in all shadow roots
    KimuGlobalStyles.registerGlobalStyle('kimu-theme-active', theme.cssPath);

    // Update theme in all currently loaded extensions
    // This ensures that existing extensions get the new theme immediately
    KimuGlobalStyles.updateStyleInAllExtensions('kimu-theme-active').catch(error => {
      console.error('[Theme] Failed to update theme in extensions:', error);
    });

    if (this.debugMode) {
      console.log('[Theme] Loading CSS theme:', theme.name, theme.cssPath);
      console.log('[Theme] Registered theme as global style for all extensions');
    }
  }

  /**
   * Apply current theme
   */
  private applyTheme(): void {
    this.updateTheme();
  }

  /**
   * Initialize system preference detection
   */
  private initSystemPreference(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    this.systemPreferenceQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Listen for system preference changes
    this.systemPreferenceQuery.addEventListener('change', (e) => {
      if (this.currentMode === 'auto') {
        if (this.debugMode) {
          console.log('[Theme] System preference changed:', e.matches ? 'dark' : 'light');
        }
        this.updateTheme();
        this.notifyListeners();
      }
    });
  }

  /**
   * Get system color scheme preference
   */
  private getSystemPreference(): 'light' | 'dark' {
    if (!this.systemPreferenceQuery) {
      return 'light';
    }
    return this.systemPreferenceQuery.matches ? 'dark' : 'light';
  }

  /**
   * Save theme mode to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, this.currentMode);
    } catch (error) {
      console.error('[Theme] Failed to save to localStorage:', error);
    }
  }

  /**
   * Load theme mode from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.currentMode = stored as ThemeMode;
      }
    } catch (error) {
      console.error('[Theme] Failed to load from localStorage:', error);
    }
  }

  /**
   * Notify all listeners of theme change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentThemeName, this.currentMode);
      } catch (error) {
        console.error('[Theme] Error in listener:', error);
      }
    });
  }
}

// Export singleton instance
export const themeService = new ThemeService();
