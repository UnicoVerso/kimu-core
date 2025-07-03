import type { KimuGroupAsset, KimuExtensionMeta } from './kimu-types';

/**
 * The `KimuAssetManager` class provides utility methods for managing assets such as stylesheets,
 * scripts, and other external resources in the Kimu framework. It includes functionality to:
 * 
 * - Fetch text files from the server.
 * - Inject stylesheets and scripts into the DOM or Shadow DOM.
 * - Manage external assets defined in metadata or configuration objects.
 * - Ensure assets are loaded only once to avoid duplication.
 * 
 * This class is designed to streamline asset management for extensions and components
 * within the Kimu framework.
 */
export class KimuAssetManager {

    /** Loads a text file from the server root */
    static async fetchFile(path: string): Promise<string | null> {
        // console.log(`[KimuAssetManager::fetchFile] 🧾 Fetching file: ${path}`);
        const rawPath = path.includes('?raw') ? path : `${path}?raw`;
        const finalPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
        // console.log(`[KimuAssetManager::fetchFile] 🧾 Fetching file: ${finalPath}`);
        try {
            const response = await fetch(finalPath);
            if (!response.ok) {
                console.warn(`[KimuAssetManager::fetchFile] ⚠️ File not found: ${path} (status: ${response.status})`);
                return null;
            }
            return await response.text();
        } catch (err) {
            console.warn(`[KimuAssetManager::fetchFile] ⚠️ Fetch File Error: ${path}`, err);
            return null;
        }
    }

    /** Injects an element if not already present in the target node */
    private static injectElementIfAbsent(
        root: Document | ShadowRoot | HTMLElement,
        create: () => HTMLElement,
        id?: string
    ): void {
        if (!root || typeof root.appendChild !== 'function') {
            console.warn('[KimuAssetManager] ⚠️ Invalid root node for injection: ', root);
            return;
        }
        if (id && 'getElementById' in root && root.getElementById(id)) {
            console.log(`[KimuAssetManager] ⚠️ Element already present: ${id}`);
            return;
        }
        const el = create();
        if (id) {
            el.id = id;
        }
        root.appendChild(el);
    }

    static async injectStyle(component: HTMLElement, stylePath: string, styleId: string | null): Promise<void> {
        // console.log(`[KimuAssetManager] Injecting style: ${stylePath}`);
        if(!stylePath) {
            console.warn('[KimuAssetManager] ⚠️ No style assigned: ', stylePath);
            return;
        }
        const root = component.shadowRoot;
        if (!(root instanceof ShadowRoot)) {
            console.warn('[KimuAssetManager] ⚠️ ShadowRoot not found, unable to inject styl');
            return;
        }
        if (styleId && root.getElementById(styleId)) {
            console.log(`[KimuAssetManager] ⚠️ Style already injected: ${styleId}`);
            return;
        }
        //const css = await fetch(stylePath).then(res => res.ok ? res.text() : null).catch(() => null);
        const css = await this.fetchFile(stylePath);
        if (!css) {
            console.warn(`[KimuAssetManager] ⚠️ Style not found: ${stylePath}`);
            return;
        }
        const style = document.createElement('style');
        if (styleId) {
            style.id = styleId;
        }
        style.textContent = css;
        root.appendChild(style);
    }

    static injectExternalLink(component: HTMLElement, href: string, id: string): void {
        const root = component.shadowRoot;
        if (!root) return;
        this.injectElementIfAbsent(root, () => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            return link;
        }, id);
    }

    static injectExternalScript(component: HTMLElement | Document, src: string, id: string): void {
        const root = component instanceof HTMLElement ? component.shadowRoot : component;
        if (!root) return;
        this.injectElementIfAbsent(root, () => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            return script;
        }, id);
    }

    static injectGlobalScript(src: string, id: string): void {
        this.injectElementIfAbsent(document.head, () => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            return script;
        }, id);
    }

    static injectFromMeta(component: HTMLElement, meta: KimuExtensionMeta): void {
        meta.external?.css?.forEach((css, index) => {
            const id = css.id ?? `ext-css-${meta.tag}-${index}`;
            this.injectExternalLink(component, css.path, id);
        });
        meta.external?.js?.forEach((js, index) => {
            const id = js.id ?? `ext-js-${meta.tag}-${index}`;
            this.injectGlobalScript(js.path, id);
        });
    }

    static async loadExternalAssets(assets?: KimuGroupAsset): Promise<void> {
        if (!assets) return;
        const promises: Promise<void>[] = [];
        assets.css?.forEach(asset => {
            if (!document.querySelector(`link[href="${asset.path}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = asset.path;
                document.head.appendChild(link);
                promises.push(new Promise(resolve => link.onload = () => resolve()));
            }
        });
        assets.js?.forEach(asset => {
            if (!document.querySelector(`script[src="${asset.path}"]`)) {
                const script = document.createElement('script');
                script.src = asset.path;
                script.defer = true;
                document.head.appendChild(script);
                promises.push(new Promise(resolve => script.onload = () => resolve()));
            }
        });
        await Promise.all(promises);
    }

}
