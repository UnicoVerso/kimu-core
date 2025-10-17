import { KimuModule } from '../../core/kimu-module';
import { KimuModuleOptions } from '../../core/kimu-types';
import { KimuGlobalLang } from './kimu-global-lang';
import { KimuI18nService } from './kimu-i18n-service';

export default class I18nModule extends KimuModule {
  private static instance: I18nModule | null = null;
  private globalLang: typeof KimuGlobalLang;
  private service: KimuI18nService;

  constructor(name: string, version: string, options?: KimuModuleOptions & { basePath?: string; languages?: any }) {
    super(name, version, options);
    this.singleton = true; // Marca come singleton
    this.globalLang = KimuGlobalLang;
    this.service = new KimuI18nService(
      options?.lang || 'it',
      options?.basePath || './lang',
      options?.languages
    );
  }

  static getInstance(options?: KimuModuleOptions & { basePath?: string; languages?: any }): I18nModule {
    if (!I18nModule.instance) {
      I18nModule.instance = new I18nModule('i18n', '1.0.0', options);
    }
    return I18nModule.instance;
  }

  getService(): KimuI18nService {
    return this.service;
  }

  getGlobalLang(): typeof KimuGlobalLang {
    return this.globalLang;
  }
}

// Export direct access to services (for optimized extension usage)
export { KimuGlobalLang, KimuI18nService };
