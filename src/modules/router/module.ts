// KimuRouterModule
// Provides the routing service as a KimuModule
// Inspired by the structure of the i18n module

import { KimuModule } from '../../core/kimu-module';
import { KimuRouterService } from './router';
import { KimuRouterModuleOptions } from './router';

export default class KimuRouterModule extends KimuModule {
  private service: KimuRouterService;

  constructor(name: string = 'router', version: string = '1.0.0', options?: KimuRouterModuleOptions) {
    super(name, version, options);
    this.service = KimuRouterService.getInstance();
    if (options?.routes) {
      this.service.configure(options.routes);
    }
  }

  getService(): KimuRouterService {
    return this.service;
  }
}
