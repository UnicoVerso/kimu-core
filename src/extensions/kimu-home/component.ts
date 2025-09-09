//
// This file can be freely modified by developers.
// Changes made to this page are not subject to the publication requirement of the MPL framework license.
//

import { KimuComponent } from '../../core/kimu-component';
import { KimuComponentElement } from '../../core/kimu-component-element';
import { KimuGlobalLang, KimuI18nService } from '../../modules/i18n/module';

@KimuComponent({
    tag: 'kimu-home',
    path: 'kimu-home',
    name: 'KIMU Home',
    version: '1.0.0',
    description: 'Main interface container',
    icon: '🏠',
    author: 'UnicòVerso',
    kimuVersion: '1.0.0',
    languages: {
        default: 'it',
        supported: {
            it: { code: 'it', name: 'Italian' },
            en: { code: 'en', name: 'English' }
        }
    }
})
export class KimuHomeComponent extends KimuComponentElement {

    /** I18n service instance for translations */
    private i18n = new KimuI18nService(
        this.getMeta().languages?.default,
        'extensions/' + this.getMeta().path + '/lang',
        this.getMeta().languages
    );
    /** Currently selected language code */
    private selectedLang = KimuGlobalLang.get();

    /** Versione del framework KIMU */
    private kimuVersion = '';

    /**
     * Initializes the component, loads the current language, and sets up reactivity.
     */
    async onInit() {
        this.selectedLang = await KimuGlobalLang.get();
        await this.i18n.setLang(this.selectedLang);
        // Recupera la versione del framework
        const app = await this.getApp();
        this.kimuVersion = app.version;
        this.refresh();
        // React to global language changes
        KimuGlobalLang.onChange(async (lang: string) => {
            await this.i18n.setLang(lang);
            this.selectedLang = KimuGlobalLang.get();
            this.refresh();
        });
    }

    /**
     * Returns the data object for template rendering.
     * All properties are precomputed for compatibility with the template engine.
     */
    getData() {
        return {
            slogan: 'Keep It Minimal UI',
            translate: this.i18n.translate,
            selectedLang: this.selectedLang,
            languages: this.getMeta().languages?.supported,
            version: this.kimuVersion,
            onLangIt: async () => {
                await KimuGlobalLang.set('it');
                this.refresh();
            },
            onLangEn: async () => {
                await KimuGlobalLang.set('en');
                this.refresh();
            }
        };
    }
}
