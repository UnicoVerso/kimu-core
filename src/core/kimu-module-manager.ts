import { KimuModule } from './kimu-module';
import { KimuModuleOptions } from './kimu-types';

export class KimuModuleManager {
  private modules: Map<string, KimuModule> = new Map();

  async loadModule(name: string, options?: KimuModuleOptions): Promise<KimuModule> {
    // Import dinamico del modulo
    const modPath = `/modules/${name}/module.js`;
    const modImport = await import(/* @vite-ignore */ modPath);
    const instance: KimuModule = new modImport.default(name, '1.0.0', options);
    if (instance.singleton && this.modules.has(name)) {
      return this.modules.get(name)!;
    }
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
}
