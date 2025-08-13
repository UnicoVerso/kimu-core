import { KimuBuildConfig } from "../config/kimu-build-config";
import { KimuModuleManager } from "./kimu-module-manager";

/**
 * The `KimuApp` class represents the core application logic for the Kimu framework.
 * It is implemented as a singleton to ensure a single global instance throughout the application.
 * 
 * Key functionalities:
 * - Manages the system configuration, including version and environment details.
 * - Provides utility methods to check the current environment (local, dev, prod).
 * - Initializes the application by loading the configuration from the default configuration file.
 * - Ensures the application is properly initialized before usage.
 * - Provides access to the global KimuModuleManager for dynamic module management.
 */
export class KimuApp {

    private static _instance: KimuApp;
    private _config: any = null; // KIMU system configuration
    public readonly moduleManager: KimuModuleManager;

    /** Private constructor for singleton design pattern */
    private constructor() {
        this.moduleManager = new KimuModuleManager();
    }

    /** Retrieves the global instance, initializing it if necessary */
    static async getInstance(): Promise<KimuApp> {
        if (!this._instance) {
            console.log('[Kimu] Avvio Kimu Framework');
            this._instance = new KimuApp();
            await this._instance._init();
        }
        return this._instance;
    }

    /** Initializes KimuApp component by reading the configuration */
    private async _init(): Promise<void> {
        try {
             // Initializes the configuration with the default configuration file
            this._config = KimuBuildConfig;
            //console.log("[KIMU] version: ", this.version); 
            //console.log("[KIMU] environment: ", this.environment);  
          
        } catch (err) {
            console.warn('[KimuApp] ❌ Error: Configuration not found or invalid. Using fallback.', err);
        }
    }

    get config(): any {
        if (!this._config) {
            throw new Error('[KimuApp] ❌ Error: System configuration not available!');
        }
        return this._config;
    }

    get version(): string {
        return this.config.version;
    }

    get environment(): string {
        return this.config.environment;
    }

    isLocal(): boolean {
        return this.environment === 'local';
    }

    isDev(): boolean {
        return this.environment === 'dev';
    }

    isProd(): boolean {
        return this.environment === 'prod';
    }

}