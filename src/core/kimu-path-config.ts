import { KimuBuildConfig } from '../config/kimu-build-config';

/**
 * KimuPathConfig handles base path configuration for deployments in subdirectories.
 * It integrates with the existing build configuration system and supports:
 * - Automatic initialization from generated build config
 * - Runtime path resolution for all framework resources
 * - Support for deployment in any server subdirectory
 * 
 * Usage:
 * - Paths are configured in env/*.config.json files
 * - Can be overridden with environment variables (KIMU_BASE_PATH)
 * - Automatically resolves all framework resource paths
 */
export class KimuPathConfig {
  /** Current base path (without trailing slash, empty for root) */
  private static _basePath: string | null = null;
  
  /** Initialization flag to avoid multiple initializations */
  private static _initialized: boolean = false;

  /**
   * Initialize from generated build config.
   * Called automatically on first path resolution.
   */
  static initialize(): void {
    if (this._initialized) return;
    
    try {
      // Get base path from generated configuration
      const configBasePath = (KimuBuildConfig.build as any)['base-path'] || '/';
      this.setBasePath(configBasePath);
      this._initialized = true;
      
      console.log(`[KimuPathConfig] Initialized with base path: "${this._basePath || '/'}"`);
    } catch (error) {
      console.warn('[KimuPathConfig] Failed to initialize from build config, using root path', error);
      this.setBasePath('/');
      this._initialized = true;
    }
  }
  
  /**
   * Set base path manually (mainly for testing or runtime override).
   * @param path The base path to set (e.g., "/", "/dist/", "/my-app/")
   */
  static setBasePath(path: string): void {
    // Normalize path: ensure starts with / and doesn't end with / (except root)
    if (!path.startsWith('/')) path = '/' + path;
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    
    // Store as empty string for root path, or the normalized path
    this._basePath = path === '/' ? '' : path;
  }
  
  /**
   * Get current base path.
   * @returns The current base path (empty string for root)
   */
  static getBasePath(): string {
    if (!this._initialized) this.initialize();
    return this._basePath || '';
  }
  
  /**
   * Resolve an absolute path with the configured base path.
   * @param path The path to resolve (e.g., "/extensions/manifest.json")
   * @returns The resolved path with base path prepended
   */
  static resolvePath(path: string): string {
    if (!this._initialized) this.initialize();
    
    // Skip external URLs
    if (this.isExternalUrl(path)) return path;
    
    // Skip relative paths (they're already relative to current location)
    if (!path.startsWith('/')) return path;
    
    // Apply base path to absolute paths
    const basePath = this._basePath || '';
    return basePath + path;
  }
  
  /**
   * Check if a path is an external URL.
   * @param path The path to check
   * @returns True if the path is an external URL
   */
  private static isExternalUrl(path: string): boolean {
    return path.startsWith('http://') || 
           path.startsWith('https://') || 
           path.startsWith('//') ||
           path.startsWith('mailto:') ||
           path.startsWith('tel:');
  }
  
  /**
   * Force re-initialization (mainly for testing).
   */
  static reset(): void {
    this._initialized = false;
    this._basePath = null;
  }
  
  /**
   * Get full URL for a path (combines base URL from config with resolved path).
   * @param path The path to convert to full URL
   * @returns Full URL with base URL and path
   */
  static getFullUrl(path: string): string {
    if (!this._initialized) this.initialize();
    
    try {
      const webUrl = (KimuBuildConfig.build as any)['web-url'] || window.location.origin;
      const resolvedPath = this.resolvePath(path);
      
      // If path is already a full URL, return as-is
      if (this.isExternalUrl(resolvedPath)) return resolvedPath;
      
      // Combine base URL with resolved path
      return webUrl + resolvedPath;
    } catch (error) {
      console.warn('[KimuPathConfig] Failed to get full URL, returning resolved path', error);
      return this.resolvePath(path);
    }
  }
}
