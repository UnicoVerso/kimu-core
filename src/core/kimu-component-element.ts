import { KimuEngine } from "./kimu-engine";
import { KimuExtensionManager } from "./kimu-extension-manager";
import { KimuExtensionMeta } from "./kimu-types";

/**
 * The `KimuComponentElement` class serves as the base class for all components and extensions
 * in the Kimu framework. It provides lifecycle hooks, metadata management, and utility methods
 * for rendering and managing resources.
 * 
 * Key functionalities:
 * - Provides lifecycle hooks (`onInit`, `onRender`, `onDispose`) for component management.
 * - Manages metadata associated with the component.
 * - Handles template rendering and resource loading.
 * - Supports dependency injection and external asset management.
 * 
 * This class is designed to be extended by custom components and used with the `@KimuComponent` decorator.
 */
export abstract class KimuComponentElement extends HTMLElement {

  /** Each component must provide data for rendering */
  getData(): Record<string, any> {
    return {};
  }

  /** Lifecycle: initialization */
  onInit(): void { }

  /** Called every time after a render or refresh */
  onRender(): void { }

  /** Lifecycle: destruction */
  onDispose(): void { }

  /** Hook for loading the template */
  private _renderFn?: (html: any, data: Record<string, any>) => any;

  /**
   * Constructor for the Kimu component.
   * Initializes the shadow DOM and attaches it to the component.
   */
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    //console.log("\n\n###### META DATA: ", this.getMeta());
  }

  /** Shortcut for querying the DOM */
  $(selector: string): HTMLElement | null {
    return this.shadowRoot?.querySelector(selector) ?? null;
  }

  /** Retrieves metadata associated with the component */
  protected getMeta(): KimuExtensionMeta {
    return (this.constructor as any).__kimu_meta__ as KimuExtensionMeta;
  }

  /** 
   * Hook called automatically by the browser when the component is connected to the DOM.
   * Method automatically called by the browser when the component is connected.
   */
  async connectedCallback(): Promise<void> {
    const meta = this.getMeta();
    //console.log('[KimuComponentElement] Init tag:', this.tagName, 'meta:', meta);
    if (!meta || !meta.tag) {
      console.warn('[KimuComponentElement] ❌ No metadata found for the component:', this.tagName , " - meta:", meta);
      return;
    }

    // Load dependencies
    if (meta.dependencies?.length) {
      for (const dep of meta.dependencies) {
        await KimuExtensionManager.getInstance().load(dep);
      }
    }

    // Inject default CSS for the component
    await KimuEngine.injectStyle(this, 'assets/kimu-style.css', 'kimu-style-ext-default');

    // Inject external styles (if present, just once)
    if (meta.style) {
      let styleId = `kimu-style-ext-${meta.tag}`;
      const cssPath = `/extensions/${meta.basePath}/${meta.style}`;
      await KimuEngine.injectStyle(this, cssPath, styleId);
    }
    // Compile the template on the first connection
    if (meta.template) {
      const templatePath = `/extensions/${meta.basePath}/${meta.template}`
      this._renderFn = await KimuEngine.loadTemplate(templatePath);
    }
    // Initial render
    this.refresh(); // Render the template with data
    // Call the initialization hook
    this.onInit();   // Call once
  }

  /** Forces a refresh of the interface component */
  async refresh(): Promise<void> {
    if (!this._renderFn) {
      console.warn('[KimuComponentElement] ⚠️ Template render function (_renderFn) not initialized for component:', this.tagName);
      return;
    }
    // Start rendering the template with data
    await KimuEngine.render(this, this.getData(), this._renderFn);
    this.onRender();
  }

  /** 
   * Hook called automatically when the component is disconnected from the DOM.
   * Method automatically called on logout.
  */
  disconnectedCallback(): void {
    this.onDispose();
  }

  /** Loads a resource from an external file */
  loadResource(file: string): Promise<any> {
    const path = this.getMeta()?.path;
    if (!path) throw new Error('Extension without valid path');
    return fetch(`/extensions/${path}/resources/${file}`).then(r => r.json());
  }
  
  /** Loads an asset from an external file */
  loadAssetUrl(file: string): string {
    const path = this.getMeta()?.path;
    return `/extensions/${path}/assets/${file}`;
  }
}