/**
 * This code defines the types and interfaces used in the Kimu framework.
 * It provides structured definitions for assets, languages, and extension metadata,
 * enabling consistent and type-safe management of resources and extensions.
 * 
 * Key functionalities:
 * - Defines types for assets (CSS, JS) and their metadata.
 * - Provides interfaces for supported languages and their configurations.
 * - Defines metadata for Kimu extensions, including version, author, dependencies, and more.
 */

// Type to define a single resource to load
export type KimuAsset = {
  path: string;       // Path to the resource (e.g., "style.css")
  id?: string;        // Optional ID for the resource (e.g., "kimu-style")
};

// Type to define external resources to load
export type KimuGroupAsset = {
  css?: KimuAsset[]; // Array of CSS assets
  js?: KimuAsset[];  // Array of JS assets
}

// Type to define a supported language
export interface KimuLang {
  code: string;           // language code e.g., 'it', 'en'
  name?: string;          // e.g., 'Italian' (language name)
  file?: string;          // e.g., 'custom-name.json' (language file)
}

// Type to define the languages supported by an extension
export interface KimuExtensionLanguages {
  default: string; // Default language code (e.g., 'en')
  supported: Record<string, KimuLang>; // Map of supported languages
}

// Interface to define metadata associated with Kimu extensions
export interface KimuExtensionMeta {
  tag: string;              // e.g., "ext-hello" (component tag name)
  name: string;             // e.g., "Hello World" (extension name)
  version?: string;         // e.g., "1.0.0" (extension version)
  description?: string;     // e.g., "Hello World component" (extension description)
  author?: string;          // e.g., "UnicoVerso" (extension author)
  icon?: string;            // e.g., "icon.png" (extension icon)
  source?: string;          // 'local' | 'git' | 'marketplace' (source type)
  link?: string;            // Reference to documentation or website
  path?: string;            // e.g., "hello" (base path for the extension)
  basePath?: string;        // e.g., "extensions/hello" (internal base path for the extension)
  kimuVersion?: string;     // e.g., "1.0.0" (minimum required Kimu version)
  enabled?: boolean;        // If true, the extension is enabled (default: true)
  installed?: boolean;      // If true, the extension is installed (default: false)
  internal?: boolean;       // If true, the extension is internal and not visible to the user (default: false)
  template?: string;        // e.g., "hello.html" (HTML template for the extension)
  style?: string;           // e.g., "hello.css" (CSS file for the extension)
  external?: KimuGroupAsset; // Object defining external resources to load
  dependencies?: string[];  // List of dependent extensions
  languages?: KimuExtensionLanguages; // Object defining supported languages for the extension
}
