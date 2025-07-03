import { KimuExtensionMeta } from "./kimu-types";

/**
 * Decorator to define a Kimu component with static metadata.
 * 
 * This script defines the `@KimuComponent` decorator, which is used to register
 * custom components in the Kimu framework with static metadata.
 * 
 * Key functionalities:
 * - Allows defining metadata for components, such as tag name, template path, and style path.
 * - Automatically sets default paths for the template and style if not provided.
 * - Registers the custom element with the browser using `customElements.define`.
 * - Attaches static metadata directly to the class for later use.
 * 
 * @param meta - Metadata describing the component, including tag name, paths, and dependencies.
 */
export function KimuComponent(meta: KimuExtensionMeta) {
  return function <T extends CustomElementConstructor>(target: T) {
    // Sets the base path as a fallback (e.g., extensions/hello)
    const basePath = meta.path ?? `extensions/${meta.tag}`;

    // Sets default paths for the template and style if not specified
    meta.basePath = basePath;
    meta.template = meta.template ?? 'view.html'; //`${basePath}/view.html`;
    meta.style = meta.style ?? 'style.css'; //`${basePath}/style.css`;

    //  Registers the custom element with the browser
    customElements.define(meta.tag, target);

    // Attaches static metadata directly to the class for later use
    (target as any).__kimu_meta__ = meta;
  };
}
