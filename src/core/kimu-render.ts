import { html, render as litRender, TemplateResult } from 'lit';

/**
 * The `KimuRender` class provides utility methods for reactive rendering and template compilation
 * in the Kimu framework. It leverages the Lit library to enable dynamic and efficient UI updates.
 * 
 * Key functionalities:
 * - Performs reactive rendering using Lit.
 * - Loads HTML templates from files and compiles them into Lit rendering functions.
 * - Compiles HTML strings into dynamic Lit rendering functions.
 */
export class KimuRender {

    /**
     * Performs reactive rendering using Lit.
     * 
     * @param component - The target component where the template will be rendered.
     * @param data - The data to be passed to the rendering function.
     * @param renderFn - The Lit rendering function that generates the template.
     */
    static render(component: HTMLElement, data: Record<string, any>, renderFn: (html: any, data: Record<string, any>) => TemplateResult): void {
        const template = renderFn(html, data);
        litRender(template, component.shadowRoot!);
    }

    /**
     * Loads an HTML template from a file and compiles it into a Lit rendering function.
     * 
     * @param template - The HTML template string to be compiled.
     * @returns A compiled Lit rendering function.
     */
    static async loadTemplate(template: string) {
        return this.compileTemplate(template);
    }

    /**
     * Compiles an HTML string into a dynamic Lit rendering function.
     * 
     * @param template - The HTML string to be compiled.
     * @returns A Lit rendering function that can be used for reactive rendering.
     */
    static compileTemplate(template: string): (html: typeof import('lit').html, data: Record<string, any>) => TemplateResult {
        return new Function('html', 'data', `
        with(data) {
            return html\`${template}\`;
        }`) as (html: typeof import('lit').html, data: Record<string, any>) => TemplateResult;
    }

}
