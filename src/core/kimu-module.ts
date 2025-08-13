import { KimuModuleOptions } from './kimu-types';

export abstract class KimuModule {
  public name: string;
  public version: string;
  public singleton?: boolean = false;
  public options?: KimuModuleOptions;

  constructor(name: string, version: string, options?: KimuModuleOptions) {
    this.name = name;
    this.version = version;
    this.options = options;
  }

  // Lifecycle hooks
  onInit?(): void | Promise<void>;
  onClose?(): void | Promise<void>;

  // API per servizi/esportazioni
  abstract getService(): any;
}
