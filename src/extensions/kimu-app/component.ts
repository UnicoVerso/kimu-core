//
// This file can be freely modified by developers.
// Changes made to this page are not subject to the publication requirement of the MPL framework license.
//

import { KimuComponent } from '../../core/kimu-component';
import { KimuComponentElement } from '../../core/kimu-component-element';
import { KimuGlobalLang } from '../../modules/i18n/kimu-global-lang';
import { KimuI18nService } from '../../modules/i18n/kimu-i18n-service';

@KimuComponent({
    tag: 'kimu-app',
    path: 'kimu-app',
    name: 'Kimu App',
    version: '1.0.0',
    description: 'Demo of internationalization with i18n',
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
export class KimuAppComponent extends KimuComponentElement {
    /** I18n service instance for translations */
    private i18n = new KimuI18nService(
        this.getMeta().languages?.default,
        'extensions/' + this.getMeta().path + '/lang',
        this.getMeta().languages
    );
    /** Currently selected language code */
    private selectedLang = KimuGlobalLang.get();

    /**
     * Initializes the component, loads the current language, and sets up reactivity.
     */
    async onInit() {
        this.selectedLang = await KimuGlobalLang.get();
        await this.i18n.setLang(this.selectedLang);
        console.log(`[KimuAppComponent] INIT KimuGlobalLang language:`, this.selectedLang);
        this.refresh();
        // React to global language changes
        KimuGlobalLang.onChange(async (lang) => {
            console.log(`[KimuAppComponent] Language changed to: ${lang}`);
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
            translate: this.i18n.translate.bind(this.i18n),
            selectedLang: this.selectedLang,
            languages: this.getMeta().languages?.supported,
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
