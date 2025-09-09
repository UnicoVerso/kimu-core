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

  // Convenience methods for commonly used modules
  async getI18nService(options?: KimuModuleOptions): Promise<any> {
    const module = await this.loadModule('i18n', options);
    return module.getService();
  }

  async getRouterService(options?: KimuModuleOptions): Promise<any> {
    const module = await this.loadModule('router', options);
    return module.getService();
  }

  // Static convenience methods for global access
  static async getI18nService(options?: KimuModuleOptions): Promise<any> {
    return KimuModuleManager.getInstance().getI18nService(options);
  }

  static async getRouterService(options?: KimuModuleOptions): Promise<any> {
    return KimuModuleManager.getInstance().getRouterService(options);
  }
}
