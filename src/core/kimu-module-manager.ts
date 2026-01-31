import { KimuModule } from './kimu-module';
import { KimuModuleOptions } from './kimu-types';
import { KimuPathConfig } from './kimu-path-config';

export class KimuModuleManager {
  private static instance: KimuModuleManager | null = null;
  private modules: Map<string, KimuModule> = new Map();

  static getInstance(): KimuModuleManager {
    if (!KimuModuleManager.instance) {
      KimuModuleManager.instance = new KimuModuleManager();
    }
    return KimuModuleManager.instance;
  }

  async loadModule(name: string, options?: KimuModuleOptions): Promise<KimuModule> {
    // Check if module already exists (singleton support)
    if (this.modules.has(name)) {
      const existing = this.modules.get(name)!;
      if (existing.singleton) {
        return existing;
      }
    }

    // Import dinamico del modulo con base path
    const modPath = KimuPathConfig.resolvePath(`/modules/${name}/module.js`);
    const modImport = await import(/* @vite-ignore */ modPath);
    const instance: KimuModule = new modImport.default(name, '1.0.0', options);
    
    if (instance.onInit) await instance.onInit();
    this.modules.set(name, instance);
    return instance;
  }

  /**
   * Register an already instantiated module
   * Useful for manually created module instances
   */
  registerModule(name: string, instance: KimuModule): void {
    if (this.modules.has(name)) {
      console.warn(`[KimuModuleManager] Module '${name}' already registered, replacing...`);
    }
    this.modules.set(name, instance);
  }

  getModule(name: string): KimuModule | undefined {
    return this.modules.get(name);
  }

  async closeModule(name: string): Promise<void> {
    const mod = this.modules.get(name);
    if (mod && mod.onClose) await mod.onClose();
    this.modules.delete(name);
  }

  getService(name: string): any {
    const mod = this.modules.get(name);
    return mod ? mod.getService() : undefined;
  }
}
