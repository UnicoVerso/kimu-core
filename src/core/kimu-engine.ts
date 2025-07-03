import { TemplateResult } from 'lit';
import { KimuRender } from './kimu-render';
import { KimuAssetManager } from './kimu-asset-manage';

/**
 * The `KimuEngine` class provides core functionalities for rendering, template management,
 * and component loading in the Kimu framework. It acts as a bridge between the rendering engine
 * (Lit) and the asset manager, enabling dynamic and reactive UI updates.
 * 
 * Key functionalities:
 * - Injects styles into the Shadow DOM of components.
 * - Loads and compiles HTML templates into Lit rendering functions.
 * - Provides reactive rendering capabilities using Lit.
 * - Dynamically loads and registers custom components.
 */
export class KimuEngine {

  /**
   * Injects an inline style from a file into the Shadow DOM of a component.
   * 
   * @param component - The target component.
   * @param stylePath - Path to the style file.
   * @param styleId - Optional ID for the style element.
   */
  static async injectStyle(component: HTMLElement, stylePath: string, styleId: string | null = null): Promise<void> {
    return KimuAssetManager.injectStyle(component, stylePath, styleId);
  }

  /**
   * Loads and compiles an HTML template from a file into a Lit rendering function.
   * 
   * @param path - Path to the template file.
   * @returns A compiled Lit rendering function.
   * @throws Error if the template file is not found.
   */
  static async loadTemplate(path: string) {
    //console.log(`[KimuEngine] 🔄 Loading template: ${path}`);
    const template: string | null = await KimuAssetManager.fetchFile(path);
    if (!template) {
      throw new Error(`[KimuEngine] ⚠️ Template not found: ${template}`);
    }
    return KimuRender.loadTemplate(template);
  }

  /**
   * Compiles an HTML string into a dynamic Lit rendering function.
   * 
   * @param template - The HTML string to compile.
   * @returns A Lit rendering function.
   */
  static compileTemplate(template: string): (html: typeof import('lit').html, data: Record<string, any>) => TemplateResult {
    return KimuRender.compileTemplate(template);
  }

  /**
   * Performs reactive rendering using Lit.
   * 
   * @param component - The target component.
   * @param data - Data to be passed to the rendering function.
   * @param renderFn - The Lit rendering function.
   */
  static render(component: HTMLElement, data: Record<string, any>, renderFn: (html: any, data: Record<string, any>) => TemplateResult): void {
    KimuRender.render(component, data, renderFn);
  }

  /**
   * Loads a component from a specified path and registers it if not already registered.
   * 
   * @param tag - The tag name of the component.
   * @param path - Path to the component module.
   * @returns The loaded module.
   */
  static async loadComponent(tag: string, path: string): Promise<any> {
    if (customElements.get(tag)) {
      return; // Already registered
    }
    const module = await import(/* @vite-ignore */ path);
    return module;
  }

}
