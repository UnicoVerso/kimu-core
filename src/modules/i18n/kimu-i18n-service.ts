import { KimuExtensionLanguages } from '../../core/kimu-types';

/**
 * KimuI18nService provides internationalization support for Kimu extensions.
 * It loads translation files, manages language switching, and supports parameterized translations.
 */
export class KimuI18nService {
  private lang: string;
  private translations: Record<string, string> = {};
  private basePath: string;
  private languages: KimuExtensionLanguages;

  /**
   * Creates a new I18n service instance.
   * @param defaultLang The default language code (e.g. 'it').
   * @param basePath The base path for language files.
   * @param languages Optional: supported languages metadata. If not provided, fallback to default only.
   */
  constructor(defaultLang: string = 'it', basePath: string = './lang', languages?: KimuExtensionLanguages | null) {
    this.lang = defaultLang;
    this.basePath = basePath;
    // If languages is not defined, fallback to only the initial language
    this.languages = languages ?? {
      default: defaultLang,
      supported: {
        [defaultLang]: { code: defaultLang },
      },
    };
    // Use requested language only if supported, otherwise fallback to default
    this.lang = this.resolveLang(defaultLang);
  }

  /**
   * Returns the effective language to use (fallbacks to default if not supported).
   * @param lang Requested language code.
   */
  private resolveLang(lang: string): string {
    if (this.languages.supported[lang]) return lang;
    return this.languages.default;
  }

  /**
   * Changes the current language and loads the corresponding translation file.
   * Returns a promise that resolves when the file is loaded.
   * @param lang Language code to set.
   */
  async setLang(lang: string) {
    this.lang = this.resolveLang(lang);
    return await this.loadLang();
  }

  /**
   * Returns the current language code for the extension.
   */
  getLang(): string {
    return this.lang;
  }

  /**
   * Loads the translation file for the current language.
   * Uses the language metadata if available, otherwise defaults to <lang>.json.
   * Returns a promise that resolves when the file is loaded.
   */
  async loadLang(): Promise<void> {
    const langMeta = this.languages.supported[this.lang];
    // Use custom file name if provided, otherwise default to <lang>.json
    const file = langMeta.file || `${this.lang}.json`;
    const url = `${this.basePath}/${file}`;
    return await this.loadFromUrl(url);
  }

  /**
   * Loads translations from a given URL (internal or external).
   * If the file is not found or invalid, falls back to an empty translation object.
   * @param url The URL to fetch the translation file from.
   */
  async loadFromUrl(url: string): Promise<void> {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Lang file not found: ${url}`);
      }
      this.translations = await res.json();
    } catch (err) {
      console.warn(`[KimuI18nService] ERROR: ${err}`);
      this.translations = {}; // fallback to empty translations
    }
  }

  /**
   * Translates a key using the loaded translations.
   * Supports optional parameters identified by {{param}} in the translation string.
   * If the key is not found, returns the key itself.
   * @param key The translation key.
   * @param params Optional: parameters to replace in the translation string.
   */
  translate(key: string, params?: Record<string, any>): string {
    let value = this.translations[key] || key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(new RegExp(`{{${k}}}`, 'g'), v);
      }
    }
    return value;
  }
}
