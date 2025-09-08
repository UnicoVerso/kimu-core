import { KimuExtensionManager } from './core/kimu-extension-manager';
import { KimuApp } from './core/kimu-app';

/**
 * This code initializes the Kimu framework and mounts the main application interface.
 * It handles the setup of the core system, loads extensions, and dynamically mounts the main app component.
 * 
 * Key functionalities:
 * - Initializes the Kimu system and retrieves the global configuration.
 * - Loads the list of available extensions and initializes the extension manager.
 * - Dynamically mounts the main application component (`kimu-app`) to the DOM.
 * - Handles errors during initialization and ensures the application is properly set up.
 */
async function main() {
  try {
    console.log('[MAIN] Starting KIMU-App interface');

    // Initialize the Kimu system
    let kimuApp = await KimuApp.getInstance();
    console.log("[Kimu] version: ", kimuApp.version); 
    console.log("[Kimu] environment: ", kimuApp.environment);  

    // Initialize extension manager and the list of available extensions in /extensions
    const kimuExtensionManager = KimuExtensionManager.getInstance();
    await kimuExtensionManager.init();

    // Mount the main app
    const root = document.getElementById('app');
    if (!root) {
      console.error('[MAIN] ❌ Error initializing KIMU-App. Element #app not found in the DOM!');
      return;
    }

    // Mount the extensions
    // Load the main component of the Kimu application
    // The main component is the one that has the tag name 'kimu-home'
    console.log('[KIMU-MAIN] 🚀 Loading kimu-home extension...');
    let mainAppExtensions = 'kimu-home';
    await kimuExtensionManager.load(mainAppExtensions);
    const app = document.createElement(mainAppExtensions);
    root.appendChild(app);

    console.log('[KIMU-MAIN] ✅ KIMU APP initialized successfully');
  } catch (error) {
    console.error('[KIMU-MAIN] ❌ Error during initialization:', error);
  }
}

// Start the application
main();
