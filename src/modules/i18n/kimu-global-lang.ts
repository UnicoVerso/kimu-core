export type LangChangeCallback = (lang: string) => void;

export class KimuGlobalLang {
  private static currentLang: string = 'it';
  private static listeners: LangChangeCallback[] = [];

  static set(lang: string) {
    //console.log(`[KimuGlobalLang] set language: ${lang}`);
    if (lang !== this.currentLang) {
      this.currentLang = lang;
      this.listeners.forEach(fn => fn(lang));
    }
  }

  static get(): string {
    return this.currentLang;
  }

  static onChange(cb: LangChangeCallback) {
    this.listeners.push(cb);
  }

  static off(cb: LangChangeCallback) {
    this.listeners = this.listeners.filter(fn => fn !== cb);
  }
}
