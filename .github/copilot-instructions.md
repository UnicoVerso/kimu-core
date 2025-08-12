# KIMU-Core Copilot & AI Agent Integration Guide

This document provides direct, actionable instructions for Copilot and AI agents to support development and extension of the kimu-core framework. All content is specific to kimu-core.

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
1. Create a new folder in `/src/extensions/`.
2. Extend `KimuComponentElement`.
3. Use the `@KimuComponent` decorator:
   ```typescript
   import { KimuComponent } from '../core/kimu-component';
   import { KimuComponentElement } from '../core/kimu-component-element';

   @KimuComponent({
     tag: 'your-extension-tag',
     name: 'Your Extension Name',
     version: '1.0.0',
     description: 'Description',
     author: 'YourName',
     icon: '🔧',
     internal: false,
     path: 'your-extension-path',
     dependencies: []
   })
   export class YourExtensionComponent extends KimuComponentElement {
     // ...
   }
   ```
4. Register new UI elements and logic as needed.
5. Document all public methods and extension-specific APIs.

## Usable Functions in Extensions
- All public APIs from `KimuComponentElement` and `KimuComponent`.
- Utility functions from `/src/core/`.
- Event management, rendering, and tracking functions.
- Three.js and MediaPipe integration utilities (if available).

## Extension UI Design & Data Binding
- Use the provided base classes for UI rendering.
- Bind data using reactive properties and methods.
- Separate UI logic from business logic.
- Document custom UI elements and their data bindings.

## Additional Tips
- Always check for existing patterns and reuse them.
- Keep code and documentation in English.
- Update this file and documentation with new features and conventions.

## How Copilot & AI Agents Should Use This File
- Read this file and all rule files (`CODE_GUIDELINES.md`, `CONTRIBUTING.md`, `SECURITY.md`) before generating code.
- Follow all conventions and best practices described here.
- Propose changes, new extensions, and code samples that match the framework style.
- Use concise, readable code and clear documentation.
- Prefer modularity and reusability.

## Example Prompts
- "Create a new extension for gesture tracking using KimuComponentElement."
- "Add a function to display real-time hand coordinates in the UI."
- "Show how to bind data between UI and logic in a Kimu extension."
- "Integrate Three.js for a custom 3D scenario."

## Useful Resources
- [Code Guidelines](../kimu-core/CODE_GUIDELINES.md)
- [Contribution Guide](../kimu-core/CONTRIBUTING.md)
- [Security Guide](../kimu-core/SECURITY.md)
- [Extension Examples](../src/extensions/)
- [Documentation](../docs/)

---

Update this file regularly to reflect new features, rules, and best practices.

## Extension Checklist
Follow these steps to create a new extension:
1. Create a new folder in `/src/extensions/`.
2. Add your main component file (e.g., `my-extension.component.ts`).
3. Extend `KimuComponentElement` and use the `@KimuComponent` decorator.
4. Implement required logic, UI, and data binding.
5. Add documentation and comments for public APIs.
6. Add tests in `/tests/` if needed.
7. Update `/docs/` with usage instructions and examples.
8. Check code style with `npm run lint`.
9. Run tests with `npm test`.
10. Update this guide if you introduce new patterns or conventions.

## Practical Examples
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
- Integrate external libraries (e.g., Three.js, MediaPipe) by following modular patterns in `/src/core/`.
- For performance optimization, use lazy loading and minimize re-renders.
- Use environment variables in `.env` for custom configuration.
- For complex UI, split logic into multiple components and use data binding.

## Testing & Quality Assurance
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
- **Component**: A modular unit extending `KimuComponentElement`.
- **Extension**: A custom scenario or feature added in `/src/extensions/`.
- **Data Binding**: Linking UI elements to logic using reactive properties/methods.
- **Copilot Agent**: AI assistant that reads this file to generate code and suggestions.
- **Semantic Versioning**: Versioning system (MAJOR.MINOR.PATCH) for releases.
- **KimuComponentElement**: Base class for all UI components in kimu-core.
- **KimuComponent**: Decorator for defining components with metadata.
- **UI Rendering**: Process of displaying components in the browser.
- **Event Management**: Handling user interactions and system events in components.

