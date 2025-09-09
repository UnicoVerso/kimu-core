import { KimuStore } from './kimu-store';
import { KimuExtensionMeta } from './kimu-types';
import { KimuPathConfig } from './kimu-path-config';

/**
 * Get the extension manifest path with proper base path resolution
 */
const getExtManifestPath = () => KimuPathConfig.resolvePath('/extensions/extensions-manifest.json');

/**
 * The `KimuExtensionManager` class manages extensions in the Kimu framework.
 * It handles the initialization, loading, and runtime management of extensions.
 * 
 * Key functionalities:
 * - Loads the initial manifest of extensions.
 * - Synchronizes the database with the manifest.
 * - Dynamically loads extensions at runtime.
 * - Provides methods to list, save, disable, and remove extensions.
 * - Maintains a registry of loaded extensions to avoid duplicate loading.
 */
export class KimuExtensionManager {

  /** Singleton instance of the extension manager */
  private static _instance: KimuExtensionManager;

  /** Registered extensions in the system (stored in IndexedDB) */
  private _extensions: Map<string, KimuExtensionMeta> = new Map<string, KimuExtensionMeta>();

  /** Map to track whether an extension has been loaded */
  private _loaded: Map<string, boolean> = new Map();

  /** Map to track loading promises to avoid duplicate loading */
  private _loadingPromises: Map<string, Promise<void>> = new Map();

  /**
   * Retrieves the singleton instance of the extension manager.
   * If the instance does not exist, it initializes a new one.
   */
  static getInstance(): KimuExtensionManager {
    if (!this._instance) {
      // Check if an existing instance is stored in the global window object
      const existing = (window as any).__kimu_extension_manager__;
      if (existing) {
        this._instance = existing;
      } else {
        this._instance = new KimuExtensionManager();
        (window as any).__kimu_extension_manager__ = this._instance;
      }
    }
    return this._instance;
  }

  /**
   * Initializes IndexedDB and loads the initial manifest on the first run.
   */
  async init(): Promise<void> {
    // Initialize the extension store (IndexedDB)
    await KimuStore.init();
    // Check if the database is empty (first run)
    // If empty, loads the initial manifest and saves it to the database
    const isEmpty = await KimuStore.isEmpty();
    const manifest = await this.loadInitialManifest();
    if (isEmpty) {
      // Load the initial manifest and save extensions to the database
      console.log('[KimuExtensionManager] ⚠️ Database is empty, loading initial manifest...');
      for (const entry of manifest) {
        await KimuStore.save(entry);
      }
      console.log('[KimuExtensionManager] ✅ KimuStore (IndexedDB) initialized with the manifest JSON');
    } else {
      //console.log('[KimuExtensionManager] 🔄 DB present: sync with json manifest');
      await this.syncWithManifest(manifest);
    }
    const all = await KimuStore.list();
    this._extensions.clear();
    this._loaded.clear();
    for (const ext of all) {
      this._extensions.set(ext.tag, ext);
      this._loaded.set(ext.tag, false);
    }
    // console.log('[KimuExtensionManager] 📦 Extensions available:', this._extensions);
  }

  /**
   * Synchronizes the database with the initial manifest of extensions.
   * Adds new extensions from the manifest and updates existing ones if necessary.
   * If it is present in the DB but not in the manifest, remove it.
   */
  private async syncWithManifest(manifest: KimuExtensionMeta[]): Promise<void> {
    const current = await KimuStore.list();
    const currentMap = new Map(current.map(e => [e.tag, e]));
  
    for (const entry of manifest) {
      const existing = currentMap.get(entry.tag);
  
      if (!existing) {
        console.log(`[KimuExtensionManager] ➕ Adding new extension: ${entry.tag}`);
        await KimuStore.save(entry);
      } else {
        // Puoi raffinare il confronto: qui controlliamo solo se version o path sono cambiati
        const changed =
          existing.version !== entry.version ||
          existing.path !== entry.path ||
          existing.name !== entry.name;
  
        if (changed) {
          console.log(`[KimuExtensionManager] 🔁 Updating extension: ${entry.tag}`);
          await KimuStore.save(entry);
        }
      }
    }
  }  

  /**
   * Loads the initial manifest of extensions (only once).
   */
  private async loadInitialManifest(): Promise<KimuExtensionMeta[]> {
    // console.log('[KimuExtensionManager] Loading initial manifest...');
    // Load the extension manifest
    try {
      const manifestPath = getExtManifestPath();
      const res = await fetch(manifestPath);
      if (!res.ok) {
        throw new Error('File not found');
      }
      const manifest: KimuExtensionMeta[] = await res.json();
      return manifest;
    } catch (err) {
      console.warn('[KimuExtensionManager] ⚠️ Initial manifest not loaded:', err);
      return [];
    }
  }

  /**
   * Reloads the extension manifest from the remote source.
   */
  async reloadManifest(): Promise<void> {
    // console.log('[KimuExtensionManager] Reload manifest...');
    const newManifest = await this.loadInitialManifest();
    for (const entry of newManifest) {
      await this.save(entry);
    }
    console.log('[KimuExtensionManager] 🔁 Manifest manually reloaded');
  }

  /**
   * Returns all extensions currently registered in memory.
   */
  listAvailable(): KimuExtensionMeta[] {
    return Array.from(this._extensions.values());
  }

  /**
   * Returns all extensions saved in IndexedDB.
   */
  async list(): Promise<KimuExtensionMeta[]> {
    return  await KimuStore.list();
  }
  
  /**
   * Retrieves an extension from IndexedDB by its tag.
   */
  get(tag: string): KimuExtensionMeta | undefined {
    return this._extensions.get(tag);
  }

  /**
   * Returns the tags of extensions already loaded dynamically.
   */
  getTags(): string[] {
    return Array.from(this._extensions.keys());
  }

  /**
   * Checks if an extension has been loaded into the system.
   */
  isLoaded(tag: string): boolean {
    return this._loaded.get(tag) ?? false;
  }

  /**
   * Dynamically loads an extension at runtime (only once).
   */
  async load(tag: string): Promise<void> {
    //console.log(`[KimuExtensionManager] Load extension: ${tag}`);
    
    // Check if the extension is already loaded
    if (!this._extensions.has(tag)) {
      console.log(`[KimuExtensionManager] ⚠️ Extension not present: ${tag}`);
      return;
    }
    
    // Check if already loaded
    if (this.isLoaded(tag)) {
      //console.log(`[KimuExtensionManager] ⚠️ Extension already loaded: ${tag}`);
      return;
    }
    
    // Check if already loading
    if (this._loadingPromises.has(tag)) {
      return this._loadingPromises.get(tag);
    }
    
    const ext = this._extensions.get(tag);
    if (!ext) {
      console.warn(`[KimuExtensionManager] ⚠️ Extension not found: ${tag}`);
      return;
    }
    
    if (!ext.path) {
      console.warn(`[KimuExtensionManager] ⚠️ Path not defined for extension: ${tag}`);
      return;
    }
    
    // Create loading promise
    const loadingPromise = this._loadExtension(tag, ext);
    this._loadingPromises.set(tag, loadingPromise);
    
    try {
      await loadingPromise;
    } finally {
      this._loadingPromises.delete(tag);
    }
  }

  /**
   * Internal method to load an extension
   */
  private async _loadExtension(tag: string, ext: KimuExtensionMeta): Promise<void> {
    try {
      const componentPath = KimuPathConfig.resolvePath(`/extensions/${ext.path}/component.js`);
      await import(/* @vite-ignore */ componentPath);
      this._loaded.set(tag, true);
      // console.log(`[KimuExtensionManager] ✅ Extension loaded: ${tag}`);
    } catch (err) {
      console.error(`[KimuExtensionManager] ❌ Error loading Extension tag "${tag}":`, err);
      throw err;
    }
  }

  /**
   * Saves an extension to the database.
   */
  async save(entry: KimuExtensionMeta): Promise<void> {
    await KimuStore.save(entry);
    this._extensions.set(entry.tag, entry);
    this._loaded.set(entry.tag, false);
  }

  /**
   * Disables an extension.
   */
  async disable(tag: string): Promise<void> {
    const ext = await this.get(tag);
    if (ext) {
      ext.enabled = false;
      await this.save(ext);
      console.log(`[KimuExtensionManager] ⛔ Extension disabled: ${tag}`);
    }
  }

  /**
   * Removes an extension from the database.
   */
  async remove(tag: string): Promise<void> {
    await KimuStore.remove(tag);
    this._extensions.delete(tag);
    this._loaded.delete(tag);
    console.log(`[KimuExtensionManager] 🗑️ Extension removed: ${tag}`);
  }

  /**
   * Resets the database completely. Clears all data (use with caution).
   */
  async reset(): Promise<void> {
    await KimuStore.clear();
    this._extensions.clear();
    this._loaded.clear();
    console.log('[KimuExtensionManager] 🔄 Complete database reset');
  }
}
