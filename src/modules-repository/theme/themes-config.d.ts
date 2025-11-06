/**
 * Type definitions for themes configuration
 */

export interface ThemeColors {
  background: string;
  backgroundEnd: string;
  text: string;
  border: string;
}

export interface ThemeConfig {
  name: string;
  mode: 'light' | 'dark';
  cssPath: string;
  description?: string;
  icon?: string;
  colors?: ThemeColors;
}

export interface ThemesConfiguration {
  themes: ThemeConfig[];
  defaultTheme: string;
}

declare const themesConfig: ThemesConfiguration;
export default themesConfig;
