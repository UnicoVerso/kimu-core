import { KimuModule } from '../../core/kimu-module';
import { KimuModuleOptions } from '../../core/kimu-types';
import { KimuGlobalLang } from './kimu-global-lang';
import { KimuI18nService } from './kimu-i18n-service';

export default class I18nModule extends KimuModule {
  private globalLang: typeof KimuGlobalLang;
  private service: KimuI18nService;

  constructor(name: string, version: string, options?: KimuModuleOptions) {
    super(name, version, options);
    this.globalLang = KimuGlobalLang;
    this.service = new KimuI18nService(options?.lang || 'it');
  }

  getService(): KimuI18nService {
    return this.service;
  }

  getGlobalLang(): typeof KimuGlobalLang {
    return this.globalLang;
  }
}
