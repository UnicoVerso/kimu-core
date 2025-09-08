# KIMU-Core Copilot & AI Agent Integration Guide

> **Agent Training Note:**
> To generate correct, robust, and maintainable code, you MUST read and follow not only the main guidelines below, but also all subchapters such as **Practical Examples**, **FAQ & Troubleshooting**, **Testing & Quality Assurance**, **Advanced Usage**, **Glossary**, and **Modules in KIMU-Core**. These sections contain essential rules, conventions, edge cases, and best practices. Always consult them when generating or modifying code.

This document provides direct, actionable instructions for Copilot and AI agents to support development and extension of the kimu-core framework. All content is specific to kimu-core.

## How Copilot & AI Agents Should Use This File
> **Agent Training Note:** This file is your primary reference for generating code, understanding conventions, and following best practices in kimu-core. It contains essential guidelines, examples, and patterns that you must follow to ensure consistency, maintainability, and correctness in all generated code.

- **Use English** for all code comments, documentation, and metadata.
- **Read the entire document** to understand the project structure, conventions, and best practices for kimu-core.
- **Use the provided examples** as templates for creating new components and extensions.
- **Follow the coding conventions** outlined in `CODE_GUIDELINES.md` and `CONTRIBUTING.md` and  and best practices described here.
- **Refer to the Practical Examples** section for implementation patterns, data binding, and best practices.
- **Follow the guidelines** for component creation, extension development, and API usage.
- **Refer to the Practical Examples** section for implementation patterns and data binding.
- **Use the FAQ & Troubleshooting** section for common issues and edge cases.
- **Propose changes** to this file if you identify missing patterns, conventions or best practices.
- **Use the Glossary** for precise definitions of key concepts and terminology.
- **Use the Modules in KIMU-Core** section to understand how to structure, document, and import reusable modules in the framework.
- **Use the Extension Creation Guide** to ensure correct extension structure and registration.
- **Use concise, readable code** and clear documentation in all generated code.
- **Prefer modularity and reusability** in all components and extensions.

## Project Structure

Organize your kimu-core project as follows:

project-root/
│
├── src/                  # Main source code
│   ├── core/             # Base classes, decorators, and core APIs
│   ├── extensions/       # Custom extensions and scenarios
│   ├── utils/            # Utility/helper functions
│   ├── models/           # Data models (if needed)
│   └── ...               # Other domain-specific modules
│
├── tests/                # Unit and integration tests
│
├── scripts/              # Utility scripts and CLI tools
│
├── docs/                 # Documentation and guides
│
├── dist/                 # Production build output
│
├── .github/              # GitHub workflows, Copilot instructions, etc.
│   └── copilot-instructions.md   # This guide
│
├── package.json          # NPM configuration and scripts
├── tsconfig.json         # TypeScript configuration
├── .env                  # Environment variables (if needed)
├── README.md             # Project overview and usage
├── CODE_GUIDELINES.md    # Coding conventions and style rules
├── CONTRIBUTING.md       # Contribution guidelines
├── SECURITY.md           # Security best practices
└── ...                   # Other config or license files

## Development Guidelines

For details and advanced usage of component methods and APIs, refer to the Practical Examples and FAQ sections below.
- Use TypeScript for all source code.
- Follow naming conventions and style rules in `CODE_GUIDELINES.md`.
- Keep business logic separate from UI code.
- Document all public classes, methods, and APIs in English.
- Use clear, concise comments for complex logic.
- Prefer modular, reusable code.
- Use lifecycle methods (`onInit`, `onRender`, etc.) for component logic.
- Use provided APIs for DOM selection, event handling, data binding, and state management (see Practical Examples section).
- Avoid direct DOM manipulation; always use framework APIs for rendering and events.
- Write unit and integration tests for all new features and extensions.
- Run `npm run lint` and use a code formatter before each commit.
- Follow semantic commit messages and update the changelog for every release.
- Document edge cases and expected behaviors in code and tests.
- When using external dependencies (e.g., Three.js, MediaPipe), follow modular patterns and update documentation accordingly.
- Update documentation and this guide with every new feature or convention.
- Use the `@KimuComponent` decorator for all components in `/src/extensions/`.
- Use `KimuComponentElement` as the base class for all UI components.
- Use `@KimuComponent` metadata to define component properties (tag, name, version, description, author, icon, internal status, path, dependencies).
- Use `onInit`, `onRender`, and other lifecycle methods for component logic.
- Use `this.$('#elementId')` for DOM element selection within components.
- Use `this.onRender()` to trigger UI updates.
- Use `this.onEvent('eventName', callback)` for event handling.
- Use `this.trackEvent('eventName', data)` for tracking events.
- Use `this.bindData('propertyName', elementId)` for data binding.
- Use `this.setState({ key: value })` for reactive state management.
- Use `this.getState('key')` to retrieve reactive state values.
- Use `this.$emit('eventName', data)` to emit custom events.
- Use `this.$on('eventName', callback)` to listen for custom events.
- Use `this.$off('eventName', callback)` to remove event listeners.
- Use `this.$watch('propertyName', callback)` for reactive property changes.
- Use `this.$destroy()` to clean up resources when a component is removed.
- Use `this.$refs['refName']` to access DOM elements with refs.
- Use `this.$slots['slotName']` to access named slots in components.
- Use `this.$children` to access child components.
- Use `this.$parent` to access the parent component.
- Use `this.$root` to access the root component.
- Use `this.$emit('update:modelValue', value)` for two-way data binding with v-model.
- Use `this.$nextTick(callback)` to execute code after the next DOM update cycle.
- Use `this.$forceUpdate()` to force a re-render of the component.
- Use `this.$set(object, key, value)` to set a property on an object reactively.
- Use `this.$delete(object, key)` to delete a property from an object reactively.
- Use `this.$refs` to access DOM elements or child components by reference.
- Use `this.$watchEffect(callback)` for reactive effects that run on data changes.
- Use `this.$computed` to define computed properties in components.
- Use `this.$provide(key, value)` to provide values to child components.
- Use `this.$inject(key)` to inject values from parent components.
- Use `this.$emit('hook:beforeDestroy')` to run cleanup logic before the component is destroyed.
- Use `this.$emit('hook:mounted')` to run logic after the component is mounted.
- Use `this.$emit('hook:updated')` to run logic after the component is updated.
- Use `this.$emit('hook:created')` to run logic when the component is created.
- Use `this.$emit('hook:activated')` for components that can be activated.
- Use `this.$emit('hook:deactivated')` for components that can be deactivated.
- Use `this.$emit('hook:errorCaptured', error)` to capture errors in child components.
- Use `this.$emit('hook:renderTracked', event)` to track rendering events.
- Use `this.$emit('hook:renderTriggered', event)` to trigger rendering events.
- Use `this.$emit('hook:beforeMount')` to run logic before the component is mounted.
- Use `this.$emit('hook:beforeUpdate')` to run logic before the component is updated.
- Use `this.$emit('hook:beforeDestroy')` to run logic before the component is destroyed.
- Use reactive properties and methods for data binding in components.
- Avoid direct DOM manipulation; use provided APIs for rendering and event handling.

## Getting Started
1. Clone the repository from GitHub:
   ```sh
   git clone https://github.com/UnicoVerso/kimu-core.git
   ```
2. Run `npm install` to install dependencies.
3. Use `npm start` to launch the development server.
4. Run `npm test` to execute tests.
5. Review `/docs/` for framework usage and extension examples.

## Installation & Configuration
- Node.js >= 18 required.
- Install dependencies: `npm install`
- Configure environment variables in `.env` if needed.
- For custom builds, use scripts in `/scripts/` or npm scripts in `package.json`.

## CLI Commands & Scripts
- `npm start`: Start development server
- `npm run build`: Build production bundle
- `npm test`: Run all tests
- `npm run lint`: Run linter
- Custom scripts in `/scripts/` (see script headers for usage)

## Build & Deployment
- Use `npm run build` for production builds.
- Output is in `/dist/`.
- Deploy static files as needed.

## Security Best Practices (Condensed)
- Validate all user input in extensions.
- Avoid direct DOM manipulation; use provided APIs.
- Keep dependencies updated.
- Review and follow `SECURITY.md`.

## Extension Creation Guide
To train the agent to always create extensions correctly, follow these steps:
1. Always create a new folder in `/src/extensions/` for each extension.
2. Always create these three files with exactly these names in every new extension:
   - `component.ts` (main logic)
   - `style.css` (styles)
   - `view.html` (UI template)
3. Always extend `KimuComponentElement` for the main class.
4. Always use the `@KimuComponent` decorator and provide all required metadata fields:
   - `tag`, `name`, `version`, `description`, `author`, `icon`, `internal`, `path`, `dependencies`
   
   ### Understanding the `dependencies` Metadata
   The `dependencies` field is crucial for building composite extensions. It contains an array of HTML tag strings representing child extensions that will be automatically loaded and made available in the parent extension's template.
   
   **How it works:**
   - If your extension is a "parent" that contains other extensions as components, specify their tags in the `dependencies` field
   - Child extensions will be automatically loaded by the KIMU Extension Manager
   - You can use child extensions as regular HTML tags in your `view.html` template
   - The framework handles the loading lifecycle and dependency resolution automatically
   
   **Example with child extensions:**
   ```typescript
   @KimuComponent({
     tag: 'dashboard-parent',
     name: 'Complete Dashboard',
     version: '1.0.0',
     description: 'A comprehensive dashboard with charts and tables',
     author: 'YourName',
     icon: '📊',
     internal: false,
     path: 'dashboard-parent',
     dependencies: ['chart-widget', 'data-table', 'filter-panel'] // Child extensions
   })
   export class DashboardParent extends KimuComponentElement {
     // Parent component logic
   }
   ```
   
   **In the `view.html` template:**
   ```html
   <div class="dashboard">
     <h2>Interactive Dashboard</h2>
     <!-- Use child extensions as HTML tags -->
     <chart-widget data="${chartData}"></chart-widget>
     <data-table items="${tableItems}"></data-table>
     <filter-panel @filter="${onFilter}"></filter-panel>
   </div>
   ```
   
   **Benefits of using dependencies:**
   - ✅ **Modularity**: Each component is independent and reusable
   - ✅ **Automatic loading**: No need to manually manage extension loading
   - ✅ **Maintainability**: Separate updates for each child extension
   - ✅ **Composition**: Build complex UIs from simple, focused components
   
   **Best practices for dependencies:**
   - Include only the dependencies you actually use in your template
   - Use descriptive tag names for child extensions
   - Document the role of each child extension in your code
   - Keep child extensions focused on single responsibilities
   
   **Example for simple extension (no dependencies):**
   ```typescript
   @KimuComponent({
     tag: 'simple-button',
     name: 'Simple Button',
     version: '1.0.0',
     description: 'A simple button component',
     author: 'YourName',
     icon: '🔘',
     internal: false,
     path: 'simple-button',
     dependencies: [] // No child extensions
   })
   ```
5. After creating the extension, always register it in the `extension-manifest.json` file at the project root (or designated folder). Example entry:
   ```json
   [
     {
       "tag": "my-extension-tag",
       "name": "My Extension Name",
       "version": "1.0.0",
       "description": "Short description",
       "author": "YourName",
       "icon": "🧩",
       "internal": false,
       "path": "my-extension-path",
       "dependencies": []
     }
   ]
   ```
6. Registration in the manifest can be done manually or using provided automation scripts (e.g., npm scripts). The agent should suggest or run the script if requested by the user.
7. Document all public APIs and extension-specific logic in English.

## Usable Functions in Extensions
- All public APIs from `KimuComponentElement` and `KimuComponent`.
- Utility functions from `/src/core/`.

## Extension Checklist
For agent training, always follow this checklist when creating a new extension:
1. Create a new folder in `/src/extensions/`.
2. Create these files with these exact names:
   - `component.ts`
   - `style.css`
   - `view.html`
3. Extend `KimuComponentElement` in your main class.
4. Use the `@KimuComponent` decorator with all required metadata (see guide above).
5. Register the extension in `extension-manifest.json` (manually or via automation script).
6. Implement required logic, UI, and data binding.
7. Document all public APIs in English.
8. Add tests in `/tests/` if needed.
9. Update `/docs/` with usage instructions and examples.
10. Check code style with `npm run lint`.
11. Run tests with `npm test`.
12. Update this guide if you introduce new patterns or conventions.

## Practical Examples
> **Agent Reminder:** Use these examples as reference for implementation patterns, data binding, and extension structure.

### Example: Minimal Extension
```typescript
import { KimuComponent } from '../core/kimu-component';
import { KimuComponentElement } from '../core/kimu-component-element';

@KimuComponent({
  tag: 'hello-world',
  name: 'Hello World',
  version: '1.0.0',
  description: 'Minimal example extension',
  author: 'YourName',
  icon: '👋',
  internal: false,
  path: 'hello-world',
  dependencies: []
})
export class HelloWorldComponent extends KimuComponentElement {
  onInit() {
    console.log('Hello World extension loaded!');
  }
}
```

### Example: Composite Extension with Child Dependencies
```typescript
import { KimuComponent } from '../core/kimu-component';
import { KimuComponentElement } from '../core/kimu-component-element';

@KimuComponent({
  tag: 'user-dashboard',
  name: 'User Dashboard',
  version: '1.0.0',
  description: 'Complete user dashboard with profile and statistics',
  author: 'YourName',
  icon: '📊',
  internal: false,
  path: 'user-dashboard',
  dependencies: ['user-profile', 'stats-widget', 'activity-feed'] // Child extensions
})
export class UserDashboardComponent extends KimuComponentElement {
  private userData: any;

  onInit() {
    console.log('User Dashboard extension loaded with dependencies!');
    this.loadUserData();
  }

  private async loadUserData() {
    // Load user data for child components
    this.userData = await this.fetchUserData();
    this.onRender();
  }

  // The view.html template can use:
  // <user-profile user="${userData}"></user-profile>
  // <stats-widget stats="${userData.stats}"></stats-widget>
  // <activity-feed activities="${userData.activities}"></activity-feed>
}
```

### Example: Data Binding
```typescript
export class MyExtensionComponent extends KimuComponentElement {
  private counter = 0;
  onRender() {
    this.$('#counter').textContent = this.counter.toString();
  }
  increment() {
    this.counter++;
    this.onRender();
  }
}
```

## FAQ & Troubleshooting
> **Agent Reminder:** Consult this section for common issues, edge cases, and best practices for error handling and project conventions.

**Q: How do I create composite extensions with child dependencies?**
A: Use the `dependencies` metadata in `@KimuComponent` to specify child extension tags. These will be automatically loaded and available as HTML tags in your template. See the Extension Creation Guide section for detailed examples.

**Q: What's the difference between dependencies and regular imports?**
A: The `dependencies` field is for KIMU child extensions that become available as HTML tags in your template. Regular imports are for utility functions, types, or external libraries.

**Q: Where do I put shared utilities?**
A: Use `/src/utils/` for reusable functions.

**Q: How do I add a new test?**
A: Place test files in `/tests/` and follow the naming conventions.

**Q: How do I update documentation?**
A: Edit files in `/docs/` and add examples for new features.

**Q: Lint or build errors?**
A: Run `npm run lint` and `npm run build` to check for issues. Fix according to `CODE_GUIDELINES.md`.

## Continuous Improvement
- Update this file whenever you add new features, patterns, or best practices.
- Encourage contributors to suggest improvements to this guide.

## Known Limitations
- Some advanced Three.js or MediaPipe features may require manual integration or additional configuration.
- Not all browser APIs are supported; check compatibility before using new features.
- Extensions should avoid direct DOM manipulation and always use provided APIs.
- For large data models, consider performance and memory usage.

## Advanced Usage
> **Agent Reminder:** Review this section for advanced integration, optimization, and modularization patterns.

- Integrate external libraries (e.g., Three.js, MediaPipe) by following modular patterns in `/src/core/`.
- For performance optimization, use lazy loading and minimize re-renders.
- Use environment variables in `.env` for custom configuration.
- For complex UI, split logic into multiple components and use data binding.

## Testing & Quality Assurance
> **Agent Reminder:** Follow these instructions to ensure high code quality, test coverage, and compliance with project standards.

- Write unit and integration tests in `/tests/` using the recommended framework (see README.md).
- Aim for high test coverage, especially for core logic and extensions.
- Use `npm run lint` and `npm test` before every commit.
- Document edge cases and expected behaviors in test files.

## Release & Versioning
- Follow semantic versioning for all extensions and core updates.
- Update `CHANGELOG.md` with every release, describing new features, fixes, and breaking changes.
- Tag releases in GitHub and keep documentation up to date.
- For major changes, notify contributors and update this guide.

## Glossary
> **Agent Reminder:** Refer to the glossary for precise definitions of key concepts and terminology used throughout the project.

- **Component**: A modular unit extending `KimuComponentElement`.
- **Extension**: A custom scenario or feature added in `/src/extensions/`.
- **Data Binding**: Linking UI elements to logic using reactive properties/methods.
- **Copilot Agent**: AI assistant that reads this file to generate code and suggestions.
- **Semantic Versioning**: Versioning system (MAJOR.MINOR.PATCH) for releases.
- **KimuComponentElement**: Base class for all UI components in kimu-core.
- **KimuComponent**: Decorator for defining components with metadata.
- **UI Rendering**: Process of displaying components in the browser.
- **Event Management**: Handling user interactions and system events in components.

## Modules in KIMU-Core
> **Agent Reminder:** Use this section to understand how to structure, document, and import reusable modules in the framework.

- **Definition**: Modules are containers for reusable and shared functionalities (services, helpers, APIs, resources, etc.) that can be imported by extensions, components, or other modules.
- **Location**: All modules are located in `/src/modules/`.
- **Usage**: Use modules to organize code for specific features (e.g., i18n, storage, authentication) and export everything needed for integration.
- **Best Practice**: Keep modules modular, well-documented, and easy to import.

---

### Kimu Module Creation Guide

> **Agent Training Note:** Always follow these steps and conventions when creating a new Kimu module. This ensures consistency, discoverability, and maintainability across the codebase.

#### 1. Structure and Required Files
Each module must reside in its own folder under `/src/modules/<module-name>/` and include at least:

- `module.ts`: Exports a class `<ModuleName>Module` (default export) that extends `KimuModule` and fornisce il servizio tramite `getService()`.
- `<module-name>-service.ts`: Implements the main service class and exports it with a recommended name (see below).
- (Optional) `interfaces.ts`, `utils.ts`, or other helpers as needed.

**Example structure:**
```
src/modules/event-bus/
  ├── event-bus-service.ts
  └── module.ts
```

#### 2. Naming Conventions
- The service class should be named `<ModuleName>Service` (e.g., `EventBusService`).
- The main export of the service file should be `<moduleName>Service` (camelCase, e.g., `eventBusService`).
- The module class should be named `<ModuleName>Module` and exported as default from `module.ts`.

#### 3. Reference Classes
- All modules must extend `KimuModule` (from `/src/core/kimu-module.ts`).
- Services should be implemented as classes and exported as singletons or via factory, as appropriate.

#### 4. Example: Minimal Event Bus Module
```typescript
// event-bus-service.ts
export class EventBusService {
  on(event: string, cb: (...args: any[]) => void) { /* ... */ }
  emit(event: string, data: any) { /* ... */ }
}
export const eventBusService = new EventBusService();

// module.ts
import { KimuModule } from '../../core/kimu-module';
import { eventBusService } from './event-bus-service';
export default class EventBusModule extends KimuModule {
  constructor(name = 'event-bus', version = '1.0.0', options?: any) {
    super(name, version, options);
  }
  getService() {
    return eventBusService;
  }
}
```

#### 5. Difference Between Module and Extension
- **Module**: Provides reusable logic/services (e.g., i18n, event-bus, storage) for use by extensions or other modules. No UI.
- **Extension**: Implements a user-facing scenario/component, always in `/src/extensions/`, with UI and registration in the manifest.

#### 6. Module Checklist
For agent training, always follow this checklist when creating a new module:
1. Create a new folder in `/src/modules/<module-name>/`.
2. Add at least `module.ts` and `<module-name>-service.ts`.
3. Extend `KimuModule` in your module class.
4. Use the recommended naming for classes and exports.
5. Document all public APIs in English.
6. Add tests in `/tests/` if needed.
7. Update `/docs/` with usage instructions and examples.
8. Check code style with `npm run lint`.
9. Run tests with `npm test`.
10. Update this guide if you introduce new patterns or conventions for modules.

## Internationalization (i18n)
> **Agent Reminder:** Always consider internationalization (i18n) when developing extensions or modules. This section explains how to support multiple languages and localization in kimu-core.

### Overview
KIMU-Core supports internationalization to enable multi-language user interfaces and content. All public UI, messages, and user-facing strings should be localizable.

### Where to Place Language Files
- Place language resource files (e.g., JSON, JS, or TS files with translations) in `/src/modules/i18n/` or a dedicated `i18n` folder within your extension.
- Use a clear naming convention, e.g., `en.json`, `it.json`, `fr.json`.

### How to Structure Language Files
Example `en.json`:
```json
{
  "hello": "Hello",
  "welcome": "Welcome to KIMU-Core!",
  "button.save": "Save",
  "error.network": "Network error, please try again."
}
```

### Accessing Translations in Code
If the framework provides an i18n API (e.g., `KimuI18nService`), you can now pass the translate function directly in your data object, without manual binding:
```typescript
// Example using KimuI18nService in a component
getData() {
  return {
    // ...other data...
    translate: this.i18n.translate, // No need for .bind(this.i18n)
  };
}
```

If no built-in API exists, import your language file and use it as a dictionary:
```typescript
import en from './i18n/en.json';
const msg = en['button.save'];
```

### Switching Languages
- Provide a way for the user to select their preferred language (e.g., dropdown, settings panel).
- Load the appropriate language file dynamically based on user choice or browser settings.

Example:
```typescript
import en from './i18n/en.json';
import it from './i18n/it.json';

const languages = { en, it };
const userLang = getUserLanguage(); // e.g., 'en' or 'it'
const t = (key: string) => languages[userLang][key] || key;

this.$('#saveBtn').textContent = t('button.save');
```

### Best Practices
- Always use keys for all user-facing strings; never hardcode visible text.
- Default to English if a translation is missing.
- Keep language files organized and up to date.
- Document any new keys and their usage.
- UI and documentation must always be in English by default, but support for other languages is encouraged.
- For extensions, document how to add new languages or customize translations.

### Advanced Usage
- For dynamic content, use interpolation (e.g., `"greeting": "Hello, {name}!"`).
- Consider pluralization and gender where relevant.
- If the framework supports it, use reactive updates when the language changes.

### Example: Dynamic Interpolation
```typescript
const greeting = t('greeting').replace('{name}', userName);
```

### Example: Language Switcher UI
```typescript
// HTML
<select id="langSelect">
  <option value="en">English</option>
  <option value="it">Italiano</option>
</select>

// TypeScript
this.$('#langSelect').addEventListener('change', (e) => {
  const lang = (e.target as HTMLSelectElement).value;
  setUserLanguage(lang);
  this.onRender(); // re-render UI with new language
});
```

> **Agent Reminder:** Always document i18n usage in your extension's README and code comments. Ensure all new features are localizable and provide English as the default language.


---

## Router Module (Routing System)

The `router` module provides a simple and extensible routing system for kimu-core. It allows you to map URL paths to extensions/components and handle navigation in a SPA-like fashion.

### Features
- Centralized route configuration (static paths)
- Navigation via history API
- Route change events (callback system)
- API for dynamic route registration
- Designed for integration with extension loading and dynamic UI

### API Overview

**KimuRouterService** (singleton):
- `configure(routes: RouteConfig[])`: Set the list of available routes
- `registerRoute(route: RouteConfig)`: Add a new route at runtime
- `navigate(path: string)`: Change the current route (and URL)
- `onRouteChange(cb: (route: RouteConfig) => void)`: Listen for route changes
- `getCurrentRoute()`: Get the current route object

**KimuRouterModule**:
- Extends `KimuModule`, provides the router service via `getService()`
- Accepts options with a `routes` array for initial configuration

### Example: Route Configuration and Usage

```typescript
import KimuRouterModule from 'src/modules/router/module';
import { HomeComponent } from 'src/extensions/home/component';
import { ChatComponent } from 'src/extensions/chat/component';

// Instantiate the router module and configure routes
const routerModule = new KimuRouterModule('router', '1.0.0', {
  routes: [
    { path: '/', component: HomeComponent },
    { path: '/chat', component: ChatComponent }
  ]
});
const router = routerModule.getService();

// Listen for route changes and mount the correct extension/component
router.onRouteChange((route) => {
  if (route && route.component) {
    mountKimuComponent(route.component, '#main');
  } else {
    showNotFound();
  }
});

// Navigate programmatically (e.g. from a menu)
router.navigate('/chat');

// Example mount function
function mountKimuComponent(ComponentClass, selector) {
  const container = document.querySelector(selector);
  container.innerHTML = '';
  const instance = new ComponentClass();
  container.appendChild(instance);
}
```

### Best Practices
- Register all main extensions/components as routes at startup.
- Use the router to decouple navigation logic from UI rendering.
- Extend the router for dynamic params, fallback, or nested routes as needed.
