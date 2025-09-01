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
        if (!component.shadowRoot) {
            console.warn('[KimuRender] Shadow DOM not found for component:', component.tagName);
            return;
        }
        
        try {
            const template = renderFn(html, data);
            
            // Ensure we're working with a valid Lit TemplateResult
            if (!template || !template.strings) {
                console.warn('[KimuRender] Invalid template result from renderFn');
                return;
            }
            
            // Use Lit's native render function which handles efficient updates
            litRender(template, component.shadowRoot);
        } catch (error) {
            console.error('[KimuRender] Error during Lit rendering:', error);
            console.error('Component:', component.tagName);
            console.error('Data:', data);
        }
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
        // Simple and safe template compilation without 'with' statement
        return (html: typeof import('lit').html, data: Record<string, any>) => {
            try {
                // Create a function that has access to data properties as parameters
                const keys = Object.keys(data || {});
                const values = Object.values(data || {});
                
                // Create template function with destructured parameters
                const templateFunction = new Function(
                    ...keys, 
                    'html', 
                    `return html\`${template}\`;`
                );
                
                // Execute with data values
                return templateFunction(...values, html);
            } catch (error) {
                console.error('[KimuRender] Template compilation error:', error);
                console.error('Template:', template.slice(0, 200));
                console.error('Data:', data);
                
                // Return safe fallback template
                return html`<div class="kimu-template-error">
                    <strong>Template Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}
                </div>`;
            }
        };
    }

}
