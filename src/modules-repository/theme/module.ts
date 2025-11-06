/**
 * Theme Module for KIMU-Core
 * 
 * Provides centralized theme management with dark/light/auto modes.
 * 
 * @module ThemeModule
 */

import { KimuModule } from '../../core/kimu-module';
import { themeService } from './theme-service'
/**
 * ThemeModule - Module class for theme management integration
 */
export default class ThemeModule extends KimuModule {
  constructor(name = 'theme', version = '1.0.0', options?: any) {
    super(name, version, options);
  }

  /**
   * Get the theme service instance
   */
  getService() {
    return themeService;
  }
}

// Re-export for convenience
export { themeService } from './theme-service';
export { ThemeService } from './theme-service';
export type { ThemeMode, CssTheme } from './theme-service';
