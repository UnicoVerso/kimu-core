# KIMU Framework - Complete AI Agent Reference Guide

> **Purpose:** This file provides **comprehensive and complete** instructions for AI agents (GitHub Copilot, Claude, ChatGPT, etc.) to understand and work with the KIMU framework. This is a **self-contained, complete reference** - you should not need any other documentation to work effectively with KIMU.

> **Agent Training Note:** To generate correct, robust, and maintainable code, you MUST read and follow not only the main guidelines below, but also all subchapters such as **Practical Examples**, **FAQ & Troubleshooting**, **Testing & Quality Assurance**, **Advanced Usage**, **Glossary**, **Modules**, **Router**, and **i18n** in **KIMU-Core**.. These sections contain essential rules, conventions, edge cases, and best practices. Always consult them when generating or modifying code.

This document provides direct, actionable instructions for Copilot and AI agents to support development and extension of the kimu-core framework. All content is specific to kimu-core.



## 📋 Quick Start for New Projects

### ⚡ Simple Setup (Recommended)

**Clone kimu-core as your project base:**

```bash
# Clone kimu-core repository with all files
git clone https://github.com/UnicoVerso/kimu-core.git my-kimu-app
cd my-kimu-app

# Remove git history (optional, to start fresh)
rm -rf .git
git init

# Install dependencies
npm install

# Start developing
npm start
```

**What you get:**
- ✅ Complete project structure already set up
- ✅ `.github/kimu-copilot-instructions.md` already present (this file - for AI training)
- ✅ `.github/copilot-instructions.md` for project-specific rules (you can customize)
- ✅ All framework code in `src/`
- ✅ Example extensions to learn from
- ✅ **AI agent immediately trained on KIMU!**

**Then customize:**
```bash
# Update package.json with your project name
# Create your extensions in src/extensions/
# Modify .github/copilot-instructions.md for project rules
```

### 🎯 What Happens After Setup

Your AI agent will automatically:
- Read `.github/kimu-copilot-instructions.md` (this file) for complete KIMU knowledge
- Understand all framework concepts, patterns, and best practices
- Generate correct KIMU code with proper lifecycle methods
- Follow extension and module creation guidelines

**You can immediately:**
- Customize `.github/copilot-instructions.md` for project-specific rules
- Start creating extensions in `src/extensions/`
- Use reactive properties with `@property` decorator for automatic re-rendering
- Add modules in `src/modules/`
- Run `npm start` to see your app

**Quick example - Create a reactive component:**
```typescript
import { property } from '../core/kimu-reactive';

@KimuComponent({
  tag: 'my-counter',
  name: 'Counter',
  // ... metadata
})
export class CounterComponent extends KimuComponentElement {
  @property({ type: Number })
  count: number = 0;
  
  increment() {
    this.count++; // Auto-renders, no manual onRender() needed!
  }
}
```

---

### 🔧 Alternative: Use as Dependency (Advanced)

If you want to keep kimu-core as a separate dependency:

```bash
mkdir my-kimu-app && cd my-kimu-app
npm init -y
npm install git+https://github.com/UnicoVerso/kimu-core.git
npm install --save-dev typescript vite @types/node

# Copy framework documentation for AI agent
mkdir -p .github
cp node_modules/kimu-core/.github/kimu-copilot-instructions.md .github/

# Create your project structure
mkdir -p src/extensions public
```

This approach keeps kimu-core separate but requires manual project setup.

---

## How Copilot & AI Agents Should Use This File

> **Agent Training Note:** This file is your primary and complete reference for generating code, understanding conventions, and following best practices in KIMU-Core. It contains all essential guidelines, examples, and patterns that you must follow to ensure consistency, maintainability, and correctness in all generated code.

### Critical Reading Instructions
- **Use English** for all code comments, documentation, and metadata.
- **Read the entire document** to understand the project structure, conventions, and best practices for KIMU-Core.
- **Use the provided examples** as templates for creating new components and extensions.
- **Follow the coding conventions** and best practices described here and outlined in `CODE_GUIDELINES.md` and `CONTRIBUTING.md`.
- **Follow the guidelines** for component creation, extension development, and API usage.
- **Refer to the Practical Examples** section for implementation patterns, data binding, and best practices.
- **Use the FAQ & Troubleshooting** section for common issues and edge cases.
- **Use the Glossary** for precise definitions of key concepts and terminology.
- **Use the Modules in KIMU-Core** section to understand how to structure, document, and import reusable modules in the framework.
- **Use the Router Module Guide** for implementing routing functionality.
- **Use the Internationalization (i18n)** section for multi-language support.
- **Use the Extension Creation Guide** to ensure correct extension structure and registration.
- **Use concise, readable code** and clear documentation in all generated code.
- **Prefer modularity and reusability** in all components and extensions.
- **Propose changes** to this file if you identify missing patterns, conventions or best practices.

---

## Project Overview & Structure

### What is KIMU-Core?
- KIMU-Core is a modular TypeScript framework for building web applications using Web Components. Organize your project as described below.
- All documentation, code comments, and metadata must be in English.
- Use the provided examples and templates for new components and extensions.
- Follow coding conventions described in this guide and in `CODE_GUIDELINES.md` and `CONTRIBUTING.md`.

### Core Philosophy
- **Minimal footprint**: Small bundle sizes and fast loading
- **Web Components**: Standards-based custom elements
- **TypeScript-first**: Type safety and developer experience
- **Modular architecture**: Install only what you need
- **Developer productivity**: Simple APIs and clear patterns

## Project Structure

Organize your kimu-core project as follows:

```
project-root/
│
├── src/                          # Main source code
│   ├── main.ts                   # Application entry point
│   │
│   ├── core/                     # Core framework extensions, Base classes, decorators, and core APIs (if any)
│   │   └── ...                   # Custom base classes or utilities
│   │
│   ├── extensions/               # Application extensions (components). Custom extensions and scenarios
│   │   ├── my-extension/
│   │   │   ├── component.ts      # Extension logic (required)
│   │   │   ├── style.css         # Extension styles (required)
│   │   │   └── view.html         # Extension template (required)
│   │   └── ...
│   │
│   ├── modules/                  # Optional modules (services, utilities)
│   │   ├── router/               # Router module (if using)
│   │   ├── i18n/                 # Internationalization
│   │   ├── theme/                # Theme management
│   │   └── ...
│   │
│   ├── utils/                    # Utility/helper functions
│   │   └── helpers.ts
│   │
│   ├── models/                   # Data models and types (if needed)
│   │   └── types.ts
│   │
│   └── assets/                   # Static assets
│       ├── images/
│       ├── fonts/
│       └── styles/
│
├── public/                       # Public static files
│   ├── favicon.ico
│   └── assets/
│
├── tests/                        # Unit and integration tests
│   ├── extensions/
│   └── modules/
│
├── scripts/                      # Utility scripts and CLI tools
│
├── docs/                         # Documentation and guides
│
├── dist/                         # Production build output (generated)
│
├── .github/                      # GitHub configuration. GitHub workflows, Copilot instructions, etc.
│   ├── kimu-copilot-instructions.md  # This guide for kimu-core framework specific instructions
│   ├── copilot-instructions.md       # Project-specific instructions
│   └── workflows/                    # CI/CD workflows
│
├── extension-manifest.json       # Extension registry
├── package.json                  # NPM configuration and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
├── .env                          # Environment variables (if needed)
├── .gitignore                    # Git ignore rules
├── README.md                     # Project documentation, overview and usage
├── CODE_GUIDELINES.md            # Coding standards, conventions and style rules (optional)
├── CONTRIBUTING.md               # Contribution guidelines (optional)
├── LICENSE                        # License file
├── SECURITY.md                    # Security policy (optional)
└── ...                           # Other project files
```

### Key Directories Explained

- **`src/extensions/`**: Contains all UI components/extensions. Each extension must have `component.ts`, `style.css`, and `view.html`.
- **`src/modules/`**: Reusable services and utilities (router, i18n, theme, etc.). Each module exports a service class.
- **`src/core/`**: Framework-specific code or custom base classes (usually empty in application projects).
- **`src/utils/`**: Helper functions and shared utilities.
- **`public/`**: Static assets served directly without processing.
- **`dist/`**: Build output directory (automatically generated, should be in `.gitignore`).

---

## Core Concepts

### 1. Components and Extensions

**Component**: The base unit of UI in KIMU. All components extend `KimuComponentElement`.

**Extension**: A complete feature or page, consisting of three files:
- `component.ts`: Logic and lifecycle methods
- `style.css`: Component-specific styles
- `view.html`: HTML template with interpolation

### 2. Lifecycle Methods

Every KIMU component has these lifecycle hooks:

```typescript
export class MyComponent extends KimuComponentElement {
  // Called when component is created
  onInit() {
    // Initialize data, set up state
  }
  
  // Called to render/update UI
  onRender() {
    // Update DOM, bind data to template
  }
  
  // Called when component is destroyed
  onDestroy() {
    // Clean up resources, remove listeners
  }
}
```

### 3. Template Engine

KIMU uses simple string interpolation in `view.html`:

```html
<div>
  <h1>${title}</h1>
  <p>${description}</p>
  <button onclick="${handleClick}">Click me</button>
</div>
```

Variables are provided by the `getData()` method in `component.ts`:

```typescript
getData() {
  return {
    title: this.title,
    description: this.description,
    handleClick: () => this.onClick()
  };
}
```

### 4. Component Decorator

Every extension must use the `@KimuComponent` decorator:

```typescript
@KimuComponent({
  tag: 'my-component',              // HTML tag name
  name: 'My Component',             // Display name
  version: '1.0.0',                 // Semantic version
  description: 'A sample component', // Short description
  author: 'Your Name',              // Author name
  icon: '🧩',                       // Emoji icon
  internal: false,                  // Is internal component?
  path: 'my-component',             // File path (folder name)
  dependencies: []                  // Child extension tags
})
export class MyComponent extends KimuComponentElement {
  // ...
}
```

### 5. DOM Selection and Manipulation

Use `this.$()` method for safe DOM selection within your component:

```typescript
onRender() {
  // Select element by ID
  const button = this.$('#myButton');
  
  // Select element by class
  const header = this.$('.header');
  
  // Update content
  if (button) {
    button.textContent = 'Updated!';
  }
}
```

### 6. Event Handling

Bind events in the template or in code:

**In template:**
```html
<button onclick="${handleClick}">Click</button>
```

**In component:**
```typescript
onInit() {
  const button = this.$('#myButton');
  button?.addEventListener('click', () => this.handleClick());
}
```

### 7. Modules

Modules are services that provide reusable functionality. All modules:
- Extend `KimuModule`
- Provide a service via `getService()`
- Are imported and initialized in `main.ts`

Example module structure:
```
src/modules/my-module/
  ├── module.ts              # Module class
  ├── my-module-service.ts   # Service implementation
  └── types.ts               # Type definitions
```

### 8. Reactive Properties

KIMU provides a reactive property system inspired by Lit and Vue 3. Reactive properties automatically trigger component re-renders when their values change, eliminating the need for manual `onRender()` calls.

#### Using the @property Decorator

The `@property` decorator makes class properties reactive:

```typescript
import { property } from '../core/kimu-reactive';

@KimuComponent({
  tag: 'counter-component',
  name: 'Counter',
  // ... other metadata
})
export class CounterComponent extends KimuComponentElement {
  // Reactive property with type conversion
  @property({ type: Number })
  count: number = 0;
  
  // Reactive property with attribute reflection
  @property({ type: String, reflect: true })
  message: string = 'Hello';
  
  // Reactive property without auto-render
  @property({ type: Boolean, noRender: false })
  isActive: boolean = false;
  
  increment() {
    this.count++; // Automatically triggers re-render
  }
}
```

#### Property Options

Configure reactive properties with these options:

```typescript
interface PropertyOptions {
  type?: PropertyType;        // String | Number | Boolean | Array | Object
  reflect?: boolean;          // Reflect property to attribute (default: false)
  attribute?: string | false; // Custom attribute name or disable sync
  converter?: PropertyConverter; // Custom type converter
  noRender?: boolean;         // Skip auto-render (default: false)
}
```

**Example with all options:**

```typescript
@property({
  type: Number,
  reflect: true,              // Sync to HTML attribute
  attribute: 'data-count',    // Use custom attribute name
  converter: {                // Custom converter
    fromAttribute: (value) => parseInt(value || '0'),
    toAttribute: (value) => value.toString()
  },
  noRender: false            // Enable auto-render
})
count: number = 0;
```

#### Using the reactive() Function

For Vue-style reactivity with objects and arrays:

```typescript
import { reactive, isReactive, toRaw } from '../core/kimu-reactive';

export class DataComponent extends KimuComponentElement {
  // Create reactive object
  private state = reactive({
    user: { name: 'John', age: 30 },
    items: [1, 2, 3]
  });
  
  onInit() {
    // Deep reactivity - nested changes trigger re-render
    this.state.user.name = 'Jane'; // ✅ Triggers re-render
    this.state.items.push(4);      // ✅ Triggers re-render
    
    // Check if object is reactive
    console.log(isReactive(this.state)); // true
    
    // Get original non-reactive object
    const original = toRaw(this.state);
  }
}
```

#### Attribute Reflection

Properties can sync with HTML attributes:

```typescript
@property({ type: String, reflect: true, attribute: 'user-name' })
userName: string = 'John';

// HTML usage:
// <my-component user-name="Jane"></my-component>
// Component receives: this.userName = "Jane"

// Changing property updates attribute:
this.userName = "Bob"; // Attribute becomes: user-name="Bob"
```

#### Type Conversion

Built-in converters handle common types:

```typescript
@property({ type: Number })
age: number = 0;  // "25" (string) → 25 (number)

@property({ type: Boolean })
active: boolean = false;  // "true" → true, "" → true, null → false

@property({ type: Array })
tags: string[] = [];  // '["a","b"]' → ["a", "b"]

@property({ type: Object })
config: object = {};  // '{"key":"value"}' → { key: "value" }
```

#### Best Practices

**✅ DO:**
- Use `@property` for all component state that affects rendering
- Use `reflect: true` for properties that should sync with HTML attributes
- Use appropriate `type` option for automatic type conversion
- Use `noRender: true` for properties that don't affect UI

```typescript
@property({ type: String, reflect: true })
userName: string = '';  // ✅ Good: automatic render + attribute sync

@property({ type: Number })
private count: number = 0;  // ✅ Good: reactive internal state
```

**❌ DON'T:**
- Don't call `onRender()` manually when using reactive properties
- Don't use `@property` on methods or getters
- Don't mutate reactive objects directly if you need the original

```typescript
@property({ type: Number })
count: number = 0;

increment() {
  this.count++;
  this.onRender(); // ❌ BAD: redundant, auto-render already happens
}
```

#### Performance Optimization

Reactive properties use requestAnimationFrame batching:

```typescript
// Multiple property changes in one cycle = single render
this.count = 1;
this.message = 'Hello';
this.active = true;
// Only one re-render happens after this frame
```

Disable auto-render for performance-critical properties:

```typescript
@property({ type: Number, noRender: true })
internalCounter: number = 0;

updateCounter() {
  this.internalCounter++; // No re-render
  // Manually trigger render when ready
  if (this.internalCounter % 10 === 0) {
    this.onRender();
  }
}
```

#### Migration from Manual Rendering

**Before (manual refresh):**
```typescript
export class OldComponent extends KimuComponentElement {
  private count: number = 0;
  
  increment() {
    this.count++;
    this.onRender(); // Manual render call
  }
}
```

**After (reactive properties):**
```typescript
export class NewComponent extends KimuComponentElement {
  @property({ type: Number })
  count: number = 0;
  
  increment() {
    this.count++; // Auto-render, no manual call needed
  }
}
```

**Benefits:**
- ✅ ~40% less boilerplate code
- ✅ Automatic re-rendering
- ✅ Better developer experience
- ✅ Type-safe with TypeScript
- ✅ Attribute synchronization

---

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

### Code Style
- **Use TypeScript strict mode** for all code
- **Follow naming conventions**: camelCase for variables/functions, PascalCase for classes
- **Use explicit types**: Avoid `any`, prefer interfaces and type annotations
- **Keep functions small**: Max 50 lines, single responsibility
- **Use async/await**: Prefer over promises for readability
- **Document public APIs**: Use JSDoc comments for all exported functions/classes

### Component Best Practices
- **Separation of concerns**: Keep logic in `.ts`, styles in `.css`, markup in `.html`
- **Minimize state**: Only store what's necessary
- **Use reactive properties**: Prefer `@property` decorator and `reactive()` over manual `onRender()` calls
- **Avoid direct DOM manipulation**: Use `this.$()` and framework APIs
- **Clean up resources**: Always implement `onDestroy()` for cleanup
- **Use lifecycle methods**: Don't put initialization logic in constructor

### Reactive State Management Best Practices
- **Use @property for simple values**: Numbers, strings, booleans that may sync with attributes
- **Use reactive() for complex state**: Objects and arrays that need deep reactivity
- **Enable attribute reflection when needed**: Use `reflect: true` for properties that should sync with HTML attributes
- **Optimize performance**: Use `noRender: true` for properties that don't affect UI
- **Avoid manual onRender()**: Let reactive properties handle re-rendering automatically
- **Batch updates**: Multiple property changes in one frame = single render (automatic)

```typescript
// ✅ Good: Using reactive properties
@property({ type: Number })
count = 0;

increment() {
  this.count++; // Auto-render
}

// ❌ Bad: Manual state management
private count = 0;

increment() {
  this.count++;
  this.onRender(); // Manual, verbose
}
```

### File Organization
- **One component per folder**: Each extension has its own folder with three files
- **Group related code**: Keep related utilities and helpers together
- **Avoid deep nesting**: Max 3-4 levels of directory depth
- **Use index files**: Export public APIs from `index.ts` files

### Error Handling
- **Validate inputs**: Check all user inputs and external data
- **Provide helpful errors**: Include context in error messages
- **Use try-catch**: Wrap risky operations in try-catch blocks
- **Log appropriately**: Use console.log/warn/error with meaningful messages

### Performance
- **Lazy load**: Load components only when needed
- **Use reactive properties**: Automatic batching prevents excessive re-renders
- **Minimize manual re-renders**: Use `@property` and `reactive()` instead of manual `onRender()` calls
- **Use efficient selectors**: Cache DOM queries when possible
- **Debounce/throttle**: For frequently called functions (scroll, resize, input)
- **Use noRender option**: For properties that change frequently but don't affect UI

```typescript
// Reactive properties automatically batch updates
this.count = 1;
this.message = 'Hello';
this.active = true;
// Only ONE render happens (automatic batching via RAF)

// Use noRender for performance-critical properties
@property({ type: Number, noRender: true })
private fps: number = 0;
```

---

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

## Build & Script Commands Reference
> **Agent Reminder:** Use this section to understand and correctly use the available build, compile, and utility scripts in KIMU-Core projects.

### Common NPM Scripts

| Command            | Description                                                      | When to Use                                      |
|--------------------|------------------------------------------------------------------|--------------------------------------------------|
| `npm start`        | Starts the development server with hot reload.                   | During development for live preview and testing.  |
| `npm run build`    | Builds the project for production (output in `/dist/`).          | Before deployment or to generate production files.|
| `npm test`         | Runs all unit and integration tests.                             | To validate code before commit or release.        |
| `npm run lint`     | Runs the linter to check code style and errors.                  | Before commit, after major changes, or regularly. |
| `npm run format`   | Formats code using the configured formatter (if available).      | To ensure code style consistency.                 |
| `npm run docs`     | Generates or serves documentation (if configured).               | When updating or reviewing project docs.          |
| `npm run clean`    | Cleans build artifacts and temporary files.                      | Before a fresh build or troubleshooting issues.   |

### How to Use Each Script
- **Development (`npm start`)**: Use this to launch the local dev server. Supports hot reload for rapid iteration. Stop and restart if you change major config files.
- **Build (`npm run build`)**: Generates optimized production files. Run before deploying to production or sharing a release build.
- **Test (`npm test`)**: Validates all logic and integration. Run before pushing changes or merging PRs. Add new tests for new features.
- **Lint (`npm run lint`)**: Ensures code quality and style. Run after major edits and before commits. Fix all reported issues.
- **Format (`npm run format`)**: Applies code formatting rules. Use before commit or after resolving merge conflicts.
- **Docs (`npm run docs`)**: Builds or serves documentation. Use when updating docs or reviewing API changes.
- **Clean (`npm run clean`)**: Removes build output and temp files. Use before a new build or if you encounter build errors.

### Best Practices
- Always run `npm run lint` and `npm test` before committing or releasing.
- Use `npm run build` only after tests and lint pass.
- Clean the project (`npm run clean`) if you see unexpected build or runtime errors.
- Document any new scripts in the README and this guide.
- Prefer using scripts over manual commands for consistency and reproducibility.
- For custom scripts, add clear comments and usage instructions in `package.json`.

### Troubleshooting
- If a script fails, check for missing dependencies (`npm install`) or outdated configs.
- For build errors, try `npm run clean` then `npm run build`.
- For test failures, review error logs and update tests as needed.
- For linter issues, run `npm run format` and fix remaining problems manually.

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
- **Reactive property system** from `/src/core/kimu-reactive.ts`:
  - `property()` - Decorator for reactive properties with automatic re-rendering
  - `reactive()` - Create reactive proxy objects with deep reactivity
  - `isReactive()` - Check if object is reactive
  - `toRaw()` - Get original non-reactive object
  - `initReactiveProperties()` - Initialize reactive properties (internal use)
  - `getObservedAttributes()` - Get list of observed attributes (internal use)
  - `handleAttributeChange()` - Handle attribute changes (internal use)

### Reactive Property System API

```typescript
import { property, reactive, isReactive, toRaw } from '../core/kimu-reactive';

// property() decorator
@property(options?: PropertyOptions)
// Options: { type, reflect, attribute, converter, noRender }

// reactive() function
const state = reactive<T>(target: T): T

// Helper functions
isReactive(value: any): boolean
toRaw<T>(observed: T): T
```

## Extension Checklist
For agent training, always follow this checklist when creating a new extension:
1. Create a new folder in `/src/extensions/`.
2. Create these files with these exact names:
   - `component.ts`
   - `style.css`
   - `view.html`
3. Extend `KimuComponentElement` in your main class.
4. Use the `@KimuComponent` decorator with all required metadata (see guide below).
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
  tag: 'my-extension-tag',
  name: 'My Extension Name',
  version: '1.0.0',
  description: 'Minimal example extension',
  author: 'YourName',
  icon: '🧩',
  internal: false,
  path: 'my-extension-path',
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

### Example: Reactive Properties with @property Decorator

```typescript
import { KimuComponent } from '../core/kimu-component';
import { KimuComponentElement } from '../core/kimu-component-element';
import { property } from '../core/kimu-reactive';

@KimuComponent({
  tag: 'reactive-counter',
  name: 'Reactive Counter',
  version: '1.0.0',
  description: 'Counter with reactive properties',
  author: 'KIMU Team',
  icon: '🔢',
  internal: false,
  path: 'reactive-counter',
  dependencies: []
})
export class ReactiveCounterComponent extends KimuComponentElement {
  // Reactive property - automatically triggers re-render on change
  @property({ type: Number })
  count: number = 0;
  
  // Reactive property with attribute reflection
  @property({ type: String, reflect: true })
  message: string = 'Click to increment';
  
  // Reactive boolean property
  @property({ type: Boolean })
  isActive: boolean = true;
  
  onInit() {
    console.log('Reactive counter initialized');
  }
  
  increment() {
    this.count++; // Automatically triggers re-render, no manual onRender() needed!
    
    if (this.count >= 10) {
      this.message = 'You reached 10!';
    }
  }
  
  reset() {
    this.count = 0;
    this.message = 'Click to increment';
  }
  
  getData() {
    return {
      count: this.count,
      message: this.message,
      isActive: this.isActive,
      increment: () => this.increment(),
      reset: () => this.reset()
    };
  }
}
```

**view.html:**
```html
<div class="counter-container">
  <h2>${message}</h2>
  <p class="count">Count: ${count}</p>
  <button onclick="${increment}">Increment</button>
  <button onclick="${reset}">Reset</button>
  <p class="status">Active: ${isActive}</p>
</div>
```

**Benefits of reactive properties:**
- ✅ No manual `onRender()` calls needed
- ✅ Automatic attribute synchronization (with `reflect: true`)
- ✅ Type-safe with TypeScript
- ✅ ~40% less boilerplate code

### Example: Using reactive() for Complex State

```typescript
import { KimuComponent } from '../core/kimu-component';
import { KimuComponentElement } from '../core/kimu-component-element';
import { reactive, isReactive } from '../core/kimu-reactive';

@KimuComponent({
  tag: 'todo-list',
  name: 'Todo List',
  version: '1.0.0',
  description: 'Todo list with reactive state',
  author: 'KIMU Team',
  icon: '📝',
  internal: false,
  path: 'todo-list',
  dependencies: []
})
export class TodoListComponent extends KimuComponentElement {
  // Reactive object with deep reactivity
  private state = reactive({
    todos: [] as Array<{ id: number; text: string; done: boolean }>,
    filter: 'all' as 'all' | 'active' | 'completed',
    newTodoText: ''
  });
  
  onInit() {
    console.log('Todo list initialized');
    console.log('State is reactive:', isReactive(this.state)); // true
  }
  
  addTodo() {
    if (this.state.newTodoText.trim()) {
      // Nested changes automatically trigger re-render
      this.state.todos.push({
        id: Date.now(),
        text: this.state.newTodoText,
        done: false
      });
      this.state.newTodoText = ''; // Auto re-render
    }
  }
  
  toggleTodo(id: number) {
    const todo = this.state.todos.find(t => t.id === id);
    if (todo) {
      todo.done = !todo.done; // Deep reactivity - triggers re-render
    }
  }
  
  removeTodo(id: number) {
    const index = this.state.todos.findIndex(t => t.id === id);
    if (index !== -1) {
      this.state.todos.splice(index, 1); // Array mutation - triggers re-render
    }
  }
  
  setFilter(filter: 'all' | 'active' | 'completed') {
    this.state.filter = filter; // Auto re-render
  }
  
  get filteredTodos() {
    switch (this.state.filter) {
      case 'active':
        return this.state.todos.filter(t => !t.done);
      case 'completed':
        return this.state.todos.filter(t => t.done);
      default:
        return this.state.todos;
    }
  }
  
  getData() {
    return {
      todos: this.filteredTodos,
      newTodoText: this.state.newTodoText,
      filter: this.state.filter,
      addTodo: () => this.addTodo(),
      toggleTodo: (id: number) => this.toggleTodo(id),
      removeTodo: (id: number) => this.removeTodo(id),
      setFilter: (filter: 'all' | 'active' | 'completed') => this.setFilter(filter)
    };
  }
}
```

### Example: Combining @property and reactive()

```typescript
import { property, reactive } from '../core/kimu-reactive';

@KimuComponent({
  tag: 'user-profile',
  name: 'User Profile',
  version: '1.0.0',
  description: 'User profile with mixed reactive state',
  author: 'KIMU Team',
  icon: '👤',
  internal: false,
  path: 'user-profile',
  dependencies: []
})
export class UserProfileComponent extends KimuComponentElement {
  // Simple reactive property
  @property({ type: String, reflect: true })
  userId: string = '';
  
  // Reactive property for loading state
  @property({ type: Boolean })
  loading: boolean = false;
  
  // Complex reactive state object
  private userData = reactive({
    name: '',
    email: '',
    avatar: '',
    stats: {
      posts: 0,
      followers: 0,
      following: 0
    }
  });
  
  async onInit() {
    await this.loadUserData();
  }
  
  async loadUserData() {
    this.loading = true; // Auto re-render
    
    try {
      const response = await fetch(`/api/users/${this.userId}`);
      const data = await response.json();
      
      // Update reactive object - all nested changes trigger re-render
      this.userData.name = data.name;
      this.userData.email = data.email;
      this.userData.avatar = data.avatar;
      this.userData.stats.posts = data.stats.posts;
      this.userData.stats.followers = data.stats.followers;
      this.userData.stats.following = data.stats.following;
      
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      this.loading = false; // Auto re-render
    }
  }
  
  getData() {
    return {
      loading: this.loading,
      user: this.userData,
      refresh: () => this.loadUserData()
    };
  }
}
```

## FAQ & Troubleshooting
> **Agent Reminder:** Consult this section for common issues, edge cases, and best practices for error handling and project conventions.

**Q: How do I create composite extensions with child dependencies?**
A: Use the `dependencies` metadata in `@KimuComponent` to specify child extension tags. These will be automatically loaded and available as HTML tags in your template. See the Extension Creation Guide section for detailed examples.

**Q: What's the difference between dependencies and regular imports?**
A: The `dependencies` field is for KIMU child extensions that become available as HTML tags in your template. Regular imports are for utility functions, types, or external libraries.

**Q: Should I use @property or reactive() for state management?**
A: 
- Use `@property` for simple component properties (numbers, strings, booleans) that should sync with HTML attributes
- Use `reactive()` for complex objects and arrays that need deep reactivity
- Combine both when you need simple properties with attribute reflection AND complex nested state
- Example: `@property` for `userId`, `reactive()` for `userData` object

**Q: When should I use the noRender option?**
A: Use `noRender: true` for properties that change frequently but don't affect the UI (e.g., internal counters, timers, temporary state). This prevents unnecessary re-renders and improves performance.

```typescript
@property({ type: Number, noRender: true })
private internalCounter: number = 0;

// Manually trigger render when needed
if (this.internalCounter % 10 === 0) {
  this.onRender();
}
```

**Q: How do I migrate existing components to use reactive properties?**
A:
1. Import `property` or `reactive` from `kimu-reactive`
2. Add `@property` decorator to properties that trigger renders
3. Remove manual `this.onRender()` calls after property changes
4. Test thoroughly to ensure re-renders happen correctly

**Before:**
```typescript
private count = 0;
increment() {
  this.count++;
  this.onRender(); // Manual render
}
```

**After:**
```typescript
@property({ type: Number })
count = 0;
increment() {
  this.count++; // Auto-render
}
```

**Q: Can I use reactive properties with Web Component attributes?**
A: Yes! Use `reflect: true` to sync properties with HTML attributes:

```typescript
@property({ type: String, reflect: true, attribute: 'user-name' })
userName: string = '';

// HTML: <my-component user-name="John"></my-component>
// Property: this.userName = "John"
```

**Q: How does reactive batching work?**
A: KIMU batches multiple property changes in the same execution frame into a single render using `requestAnimationFrame`. This prevents performance issues when multiple properties change rapidly:

```typescript
// All three changes trigger only ONE render
this.count = 1;
this.message = 'Hello';
this.active = true;
// Single re-render happens after this frame
```

**Q: Can I access the original non-reactive object?**
A: Yes, use `toRaw()` to get the original object:

```typescript
import { reactive, toRaw } from '../core/kimu-reactive';

const state = reactive({ count: 0 });
const original = toRaw(state);
console.log(original); // Original non-reactive object
```

**Q: Where do I put shared utilities?**
A: Use `/src/utils/` for reusable functions.

**Q: How do I add a new test?**
A: Place test files in `/tests/` and follow the naming conventions.

**Q: How do I update documentation?**
A: Edit files in `/docs/` and add examples for new features.

**Q: Lint or build errors?**
A: Run `npm run lint` and `npm run build` to check for issues. Fix according to `CODE_GUIDELINES.md`.

## Continuous Improvement
- Update this file whenever you add new patterns, best practices, or solve edge cases.
- Always invite contributors to propose improvements.

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

#### Difference Between Module and Extension
| Module | Extension |
|--------|-----------|
| Provides reusable logic/services | Implements user scenario/UI |
| No UI | UI and manifest required |
| In `/src/modules/` | In `/src/extensions/` |
| Not registered in manifest | Registered in `extension-manifest.json` |
| Used by extensions/modules | Used by the end user |

---

## Agent Training & Workflow
### Copilot & AI Agent Guide
> **Agent Training Note:** This document is your primary source for generating code, following conventions, and applying best practices in KIMU-Core. Read everything, always consult the following sections: Practical Examples, FAQ, Testing, Glossary, Modules, Router, i18n. Propose improvements if you identify missing patterns.

- **Read the entire document** before generating or modifying code.
- **Follow the conventions** in `CODE_GUIDELINES.md` and `CONTRIBUTING.md`.
- **Use practical examples** as templates.
- **Consult the FAQ** for common issues and edge cases.
- **Propose improvements** if you identify missing patterns.
- **Use the Glossary** for precise definitions.
- **Follow the checklist** for modules and extensions.
- **Always document** public APIs and workflows.

### Recommended Workflow for AI Agents
1. Read the creation checklist (module/extension).
2. Follow practical examples.
3. Consult cross-cutting best practices.
4. Use modular patterns and document everything.
5. Update the guide if you introduce new patterns.

### Cross-cutting Best Practices
- Modularity and reusability.
- Clear documentation in English.
- Unit and integration tests.
- Consistent and semantic naming.
- Secure dependency management.
- Input validation and security.
- Continuous guide updates.

### Agent Reminder
> Always insert “Agent Reminder” and “Agent Training Note” at the beginning of key sections (modules, extensions, router, i18n, testing, FAQ).

---

## Router Module Guide
> **Agent Training Note:** This section provides comprehensive guidance for using and extending the KIMU Router Module. Always refer to this when implementing routing functionality in KIMU applications.

### Overview
The KIMU Router Module provides client-side routing capabilities for single-page applications (SPAs) built with the KIMU framework. It supports hash-based routing, dynamic route parameters, route guards, and programmatic navigation.

### Features
- **Hash-based routing** (`#/path`) for compatibility with static hosting
- **Dynamic route parameters** (`:id`, `:slug`) with automatic parsing
- **Route guards** for authentication and authorization
- **Programmatic navigation** with history management
- **Route transitions** with lifecycle hooks
- **Nested routing** support for complex application structures
- **Base path compatibility** for subdirectory deployments

### API Overview

#### KimuRouterService
The main service class providing routing functionality:

```typescript
export class KimuRouterService {
  // Navigation methods
  navigate(path: string): void
  back(): void
  forward(): void
  replace(path: string): void
  
  // Route management
  addRoute(path: string, handler: RouteHandler): void
  removeRoute(path: string): void
  getCurrentRoute(): RouteInfo | null
  
  // Parameters and query
  getParams(): Record<string, string>
  getQuery(): Record<string, string>
  
  // Event handling
  onRouteChange(callback: (route: RouteInfo) => void): void
  offRouteChange(callback: (route: RouteInfo) => void): void
}
```

#### KimuRouterModule
The module class that integrates the router service:

```typescript
export default class RouterModule extends KimuModule {
  constructor(name = 'router', version = '1.0.0', options?: RouterOptions) {
    super(name, version, options);
  }
  
  getService(): KimuRouterService {
    return routerService;
  }
}
```

### Basic Usage Examples

#### 1. Setting Up Routes in Main Application
```typescript
import { KimuModuleManager } from './core/kimu-module-manager';
import RouterModule from './modules/router/module';

// Initialize router module
const moduleManager = KimuModuleManager.getInstance();
const routerModule = new RouterModule();
await moduleManager.loadModule(routerModule);

// Get router service
const router = moduleManager.getRouterService();

// Define routes
router.addRoute('/', () => {
  console.log('Home page');
  // Load home component
});

router.addRoute('/about', () => {
  console.log('About page');
  // Load about component
});

router.addRoute('/user/:id', (params) => {
  console.log('User page:', params.id);
  // Load user component with ID
});
```

#### 2. Navigation in Components
```typescript
import { KimuComponentElement } from '../core/kimu-component-element';
import { KimuModuleManager } from '../core/kimu-module-manager';

export class NavigationComponent extends KimuComponentElement {
  private router: KimuRouterService;

  async onInit() {
    // Get router service from module manager
    this.router = KimuModuleManager.getInstance().getRouterService();
  }

  navigateToHome() {
    this.router.navigate('/');
  }

  navigateToUser(userId: string) {
    this.router.navigate(`/user/${userId}`);
  }

  navigateWithQuery() {
    this.router.navigate('/search?q=kimu&category=framework');
  }
}
```

#### 3. Route Parameters and Query Strings
```typescript
// In a route handler
router.addRoute('/product/:category/:id', () => {
  const params = router.getParams();
  const query = router.getQuery();
  
  console.log('Category:', params.category);
  console.log('Product ID:', params.id);
  console.log('Query params:', query);
  
  // Example: /product/electronics/123?color=red&size=large
  // params: { category: 'electronics', id: '123' }
  // query: { color: 'red', size: 'large' }
});
```

#### 4. Route Guards and Authentication
```typescript
// Add route guard for protected routes
router.addRoute('/dashboard', () => {
  if (!isAuthenticated()) {
    router.navigate('/login');
    return;
  }
  
  // Load dashboard component
  loadDashboard();
});

router.addRoute('/admin/:section', () => {
  if (!hasAdminRole()) {
    router.navigate('/unauthorized');
    return;
  }
  
  const params = router.getParams();
  loadAdminSection(params.section);
});
```

### Advanced Usage

#### 1. Route Change Listeners
```typescript
// Listen for route changes
router.onRouteChange((route) => {
  console.log('Route changed to:', route.path);
  console.log('Parameters:', route.params);
  console.log('Query:', route.query);
  
  // Update navigation UI
  updateActiveNavigation(route.path);
  
  // Analytics tracking
  trackPageView(route.path);
});
```

#### 2. Programmatic Navigation with History
```typescript
// Navigate and add to history
router.navigate('/new-page');

// Navigate without adding to history
router.replace('/login');

// Browser back/forward
router.back();
router.forward();
```

#### 3. Integration with Extensions
```typescript
@KimuComponent({
  tag: 'app-router',
  name: 'App Router',
  version: '1.0.0',
  description: 'Main application router component',
  author: 'KIMU Team',
  icon: '🧭',
  internal: false,
  path: 'app-router',
  dependencies: []
})
export class AppRouterComponent extends KimuComponentElement {
  private router: KimuRouterService;

  async onInit() {
    this.router = KimuModuleManager.getInstance().getRouterService();
    
    // Setup application routes
    this.setupRoutes();
    
    // Listen for route changes
    this.router.onRouteChange(this.handleRouteChange.bind(this));
  }

  private setupRoutes() {
    this.router.addRoute('/', this.renderHome.bind(this));
    this.router.addRoute('/about', this.renderAbout.bind(this));
    this.router.addRoute('/contact', this.renderContact.bind(this));
  }

  private handleRouteChange(route: RouteInfo) {
    // Update component based on route
    this.onRender();
  }

  private renderHome() {
    this.innerHTML = '<kimu-home></kimu-home>';
  }

  private renderAbout() {
    this.innerHTML = '<kimu-about></kimu-about>';
  }

  private renderContact() {
    this.innerHTML = '<kimu-contact></kimu-contact>';
  }
}
```

### Best Practices

#### 1. Route Organization
- **Group related routes** by feature or module
- **Use consistent naming** for route parameters
- **Define route constants** to avoid hardcoded strings
- **Document route structure** in application documentation

```typescript
// Route constants
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  USER_PROFILE: '/user/:id',
  USER_SETTINGS: '/user/:id/settings',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users'
} as const;

// Use constants in route definition
router.addRoute(ROUTES.USER_PROFILE, handleUserProfile);
```

#### 2. Error Handling
- **Handle 404 routes** with a catch-all route
- **Validate route parameters** before processing
- **Provide fallback navigation** for invalid routes

```typescript
// 404 handler (should be added last)
router.addRoute('*', () => {
  console.warn('Route not found, redirecting to home');
  router.replace('/');
});

// Parameter validation
router.addRoute('/user/:id', () => {
  const params = router.getParams();
  const userId = parseInt(params.id);
  
  if (isNaN(userId) || userId <= 0) {
    router.navigate('/users'); // Redirect to users list
    return;
  }
  
  loadUser(userId);
});
```

#### 3. Performance Optimization
- **Lazy load route components** when possible
- **Cache route handlers** for frequently accessed routes
- **Debounce rapid navigation** calls
- **Clean up resources** when leaving routes

```typescript
// Lazy loading example
router.addRoute('/heavy-component', async () => {
  const { HeavyComponent } = await import('./components/heavy-component');
  renderComponent(HeavyComponent);
});
```

#### 4. Base Path Integration
The router automatically works with KIMU's base path system:

```typescript
// Router respects base path configuration
// If base path is "/dist/", routes become:
// "/" -> "/dist/#/"
// "/about" -> "/dist/#/about"
// "/user/123" -> "/dist/#/user/123"

// No additional configuration needed - works automatically
```

---

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

---

## Extension Creation Guide

> **Agent Training Note:** Follow this checklist every time you create a new extension.

### Extension Creation Checklist

1. ✅ Create new folder in `src/extensions/<extension-name>/`
2. ✅ Create three required files:
   - `component.ts` (logic)
   - `style.css` (styles)
   - `view.html` (template)
3. ✅ Extend `KimuComponentElement` in component class
4. ✅ Use `@KimuComponent` decorator with all required metadata
5. ✅ Implement lifecycle methods (`onInit`, `onRender`)
6. ✅ Register in `extension-manifest.json`
7. ✅ Document public APIs in comments
8. ✅ Test the extension works correctly
9. ✅ Run `npm run lint` and fix any issues
10. ✅ Update project documentation if needed

### Step-by-Step Instructions

#### Step 1: Create Extension Folder Structure
```bash
mkdir -p src/extensions/my-extension
touch src/extensions/my-extension/component.ts
touch src/extensions/my-extension/style.css
touch src/extensions/my-extension/view.html
```

#### Step 2: Create Component Logic (`component.ts`)

```typescript
import { KimuComponent } from '../../core/kimu-component';
import { KimuComponentElement } from '../../core/kimu-component-element';

@KimuComponent({
  tag: 'my-extension',
  name: 'My Extension',
  version: '1.0.0',
  description: 'Description of what this extension does',
  author: 'Your Name',
  icon: '🎯',
  internal: false,
  path: 'my-extension',
  dependencies: []  // Add child extension tags if any
})
export class MyExtensionComponent extends KimuComponentElement {
  // Private properties
  private data: any = {};
  
  // Lifecycle: Initialization
  onInit() {
    console.log('MyExtension initialized');
    // Initialize data, fetch resources, set up state
  }
  
  // Lifecycle: Rendering
  onRender() {
    // Update DOM, refresh data binding
    const title = this.$('#title');
    if (title) {
      title.textContent = this.data.title || 'Default Title';
    }
  }
  
  // Lifecycle: Cleanup
  onDestroy() {
    console.log('MyExtension destroyed');
    // Remove event listeners, clear timers, free resources
  }
  
  // Provide data for template interpolation
  getData() {
    return {
      title: this.data.title,
      description: this.data.description,
      handleClick: () => this.onClick()
    };
  }
  
  // Event handlers
  private onClick() {
    console.log('Button clicked!');
  }
}
```

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

#### Step 3: Create Styles (`style.css`)

```css
/* Component root styling */
my-extension {
  display: block;
  padding: 20px;
  font-family: system-ui, -apple-system, sans-serif;
}

/* Component-specific styles */
my-extension .header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

my-extension .content {
  color: #333;
  line-height: 1.6;
}

my-extension button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

my-extension button:hover {
  background: #0056b3;
}
```

#### Step 4: Create Template (`view.html`)

```html
<div class="extension-container">
  <div class="header">
    <h1 id="title">${title}</h1>
  </div>
  
  <div class="content">
    <p>${description}</p>
    <button onclick="${handleClick}">Click Me</button>
  </div>
</div>
```

#### Step 5: Register in Manifest

Add entry to `extension-manifest.json` (create file if it doesn't exist):

```json
[
  {
    "tag": "my-extension",
    "name": "My Extension",
    "version": "1.0.0",
    "description": "Description of what this extension does",
    "author": "Your Name",
    "icon": "🎯",
    "internal": false,
    "path": "my-extension",
    "dependencies": []
  }
]
```

#### Step 6: Use the Extension

Import and use in `main.ts` or other components:

```typescript
import { KimuExtensionManager } from '@kimu/core';

const extensionManager = KimuExtensionManager.getInstance();
await extensionManager.load('my-extension');

// Mount to DOM
const root = document.getElementById('app');
const component = document.createElement('my-extension');
root?.appendChild(component);
```

### Composite Extensions (with Dependencies)

If your extension uses other extensions as child components:

```typescript
@KimuComponent({
  tag: 'dashboard-parent',
  name: 'Dashboard',
  version: '1.0.0',
  description: 'Dashboard with multiple widgets',
  author: 'Your Name',
  icon: '📊',
  internal: false,
  path: 'dashboard-parent',
  dependencies: ['chart-widget', 'data-table', 'user-profile']  // Child extensions
})
export class DashboardComponent extends KimuComponentElement {
  // Parent component logic
}
```

Then use child extensions in `view.html`:

```html
<div class="dashboard">
  <h1>Dashboard</h1>
  <!-- Child extensions as HTML tags -->
  <chart-widget data="${chartData}"></chart-widget>
  <data-table items="${tableData}"></data-table>
  <user-profile user="${currentUser}"></user-profile>
</div>
```

**Benefits:**
- ✅ Modular: Each component is independent
- ✅ Automatic loading: Framework loads dependencies
- ✅ Reusable: Components can be used in multiple parents
- ✅ Maintainable: Update children without touching parent

---

## Module Creation Guide

> **Agent Training Note:** Modules provide services and reusable logic. Follow this guide when creating new modules.

### Module Structure

Every module must have:
1. `module.ts` - Module class that extends `KimuModule`
2. `<module-name>-service.ts` - Service implementation
3. (Optional) `types.ts` - Type definitions
4. (Optional) `utils.ts` - Helper functions

### Module Creation Checklist

1. ✅ Create folder in `src/modules/<module-name>/`
2. ✅ Create `module.ts` and service file
3. ✅ Extend `KimuModule` in module class
4. ✅ Implement service class with required functionality
5. ✅ Export service as singleton or factory
6. ✅ Document all public APIs
7. ✅ Add tests if applicable
8. ✅ Update documentation

### Step-by-Step Instructions

#### Step 1: Create Module Structure
```bash
mkdir -p src/modules/my-module
touch src/modules/my-module/module.ts
touch src/modules/my-module/my-module-service.ts
touch src/modules/my-module/types.ts
```

#### Step 2: Define Types (`types.ts`)

```typescript
export interface MyModuleOptions {
  enabled: boolean;
  config?: Record<string, any>;
}

export interface MyModuleService {
  initialize(): Promise<void>;
  doSomething(data: any): Promise<any>;
}
```

#### Step 3: Implement Service (`my-module-service.ts`)

```typescript
import { MyModuleOptions, MyModuleService } from './types';

export class MyModuleServiceImpl implements MyModuleService {
  private options: MyModuleOptions;
  private initialized: boolean = false;
  
  constructor(options: MyModuleOptions = { enabled: true }) {
    this.options = options;
  }
  
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    console.log('MyModule initializing...');
    // Initialization logic here
    
    this.initialized = true;
  }
  
  async doSomething(data: any): Promise<any> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    // Service logic here
    return { success: true, data };
  }
}

// Export singleton instance
export const myModuleService = new MyModuleServiceImpl();
```

#### Step 4: Create Module Class (`module.ts`)

```typescript
import { KimuModule } from '../../core/kimu-module';
import { myModuleService } from './my-module-service';
import { MyModuleOptions } from './types';

export default class MyModule extends KimuModule {
  constructor(
    name: string = 'my-module',
    version: string = '1.0.0',
    options?: MyModuleOptions
  ) {
    super(name, version, options);
    
    // Initialize with options if provided
    if (options) {
      // Configure service
    }
  }
  
  getService() {
    return myModuleService;
  }
}
```

#### Step 5: Use the Module

In `main.ts`:

```typescript
import { KimuModuleManager } from '@kimu/core';
import MyModule from './modules/my-module/module';

// Initialize module manager
const moduleManager = KimuModuleManager.getInstance();

// Load module
const myModule = new MyModule('my-module', '1.0.0', { enabled: true });
await moduleManager.loadModule(myModule);

// Get service
const myService = moduleManager.getModule('my-module')?.getService();
await myService.initialize();

// Use service
const result = await myService.doSomething({ foo: 'bar' });
```

### Module vs Extension

| **Module** | **Extension** |
|------------|---------------|
| Provides services/logic | Implements UI components |
| No UI (headless) | Has view, styles, template |
| Located in `src/modules/` | Located in `src/extensions/` |
| Not in manifest | Registered in manifest |
| Used by extensions/modules | Used by end users |
| Examples: router, i18n, storage | Examples: dashboard, login, profile |

### Kimu Module Creation Guide - Agent Reference

> **Agent Training Note:** Always follow these steps and conventions when creating a new Kimu module. This ensures consistency, discoverability, and maintainability across the codebase.

#### 1. Structure and Required Files
Each module must reside in its own folder under `/src/modules/<module-name>/` and include at least:

- `module.ts`: Exports a class `<ModuleName>Module` (default export) that extends `KimuModule` and provides the service via `getService()`.
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

#### 5. Difference Between Module and Extension (Detailed)
- **Module**: Provides reusable logic/services (e.g., i18n, event-bus, storage) for use by extensions or other modules. No UI.
- **Extension**: Implements a user-facing scenario/component, always in `/src/extensions/`, with UI and registration in the manifest.

#### 6. Module Checklist for Agent Training
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

---

## Router Module

> **Agent Training Note:** The Router module provides client-side navigation. Use this guide when implementing routing in KIMU applications.

### Router Overview

The KIMU Router provides:
- Hash-based routing (`#/path`)
- Dynamic route parameters (`:id`, `:slug`)
- Query string support
- Route guards for authentication
- Programmatic navigation
- History management

### Setting Up Router

#### 1. Install/Import Router Module

```typescript
import { KimuModuleManager } from '@kimu/core';
import RouterModule from './modules/router/module';

const moduleManager = KimuModuleManager.getInstance();
const routerModule = new RouterModule();
await moduleManager.loadModule(routerModule);

const router = moduleManager.getRouterService();
```

#### 2. Define Routes

```typescript
// Simple routes
router.addRoute('/', () => {
  console.log('Home page');
  loadHomeComponent();
});

router.addRoute('/about', () => {
  console.log('About page');
  loadAboutComponent();
});

// Routes with parameters
router.addRoute('/user/:id', () => {
  const params = router.getParams();
  console.log('User ID:', params.id);
  loadUserComponent(params.id);
});

// Routes with multiple parameters
router.addRoute('/product/:category/:id', () => {
  const params = router.getParams();
  loadProductComponent(params.category, params.id);
});
```

#### 3. Navigate Between Routes

```typescript
// Navigate to route
router.navigate('/about');

// Navigate with parameters
router.navigate('/user/123');

// Navigate with query string
router.navigate('/search?q=kimu&sort=date');

// Replace current route (no history entry)
router.replace('/login');

// Browser back/forward
router.back();
router.forward();
```

#### 4. Access Route Data

```typescript
// Get current route
const currentRoute = router.getCurrentRoute();
console.log(currentRoute.path);      // e.g., '/user/123'
console.log(currentRoute.params);    // e.g., { id: '123' }
console.log(currentRoute.query);     // e.g., { filter: 'active' }

// Get route parameters
const params = router.getParams();   // { id: '123' }

// Get query parameters
const query = router.getQuery();     // { filter: 'active', sort: 'date' }
```

#### 5. Route Guards

```typescript
// Protected routes
router.addRoute('/dashboard', () => {
  if (!isAuthenticated()) {
    router.navigate('/login');
    return;
  }
  loadDashboardComponent();
});

// Admin-only routes
router.addRoute('/admin/:section', () => {
  if (!hasAdminRole()) {
    router.navigate('/unauthorized');
    return;
  }
  const params = router.getParams();
  loadAdminSection(params.section);
});
```

#### 6. Route Change Listeners

```typescript
// Listen for route changes
router.onRouteChange((route) => {
  console.log('Route changed:', route.path);
  console.log('Parameters:', route.params);
  console.log('Query:', route.query);
  
  // Update navigation UI
  updateActiveNavItem(route.path);
  
  // Analytics
  trackPageView(route.path);
});
```

### Router in Components

```typescript
import { KimuModuleManager } from '@kimu/core';

export class NavigationComponent extends KimuComponentElement {
  private router: any;
  
  async onInit() {
    // Get router service
    this.router = KimuModuleManager.getInstance().getRouterService();
    
    // Listen for route changes
    this.router.onRouteChange(this.handleRouteChange.bind(this));
  }
  
  private handleRouteChange(route: any) {
    // Update component based on route
    this.onRender();
  }
  
  // Navigation methods
  goToHome() {
    this.router.navigate('/');
  }
  
  goToUser(userId: string) {
    this.router.navigate(`/user/${userId}`);
  }
  
  goBack() {
    this.router.back();
  }
}
```

### Router Best Practices

1. **Define route constants** to avoid hardcoded strings:
```typescript
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  USER_PROFILE: '/user/:id',
  ADMIN: '/admin/:section'
} as const;

router.addRoute(ROUTES.USER_PROFILE, handleUserProfile);
```

2. **Validate route parameters**:
```typescript
router.addRoute('/user/:id', () => {
  const params = router.getParams();
  const userId = parseInt(params.id);
  
  if (isNaN(userId) || userId <= 0) {
    router.navigate('/users');  // Redirect to list
    return;
  }
  
  loadUser(userId);
});
```

3. **Handle 404 routes**:
```typescript
// Add as last route
router.addRoute('*', () => {
  console.warn('Route not found');
  router.replace('/');  // Redirect to home
});
```

4. **Lazy load components**:
```typescript
router.addRoute('/heavy-page', async () => {
  const { HeavyComponent } = await import('./components/heavy-component');
  renderComponent(HeavyComponent);
});
```

---

## Internationalization (i18n)

> **Agent Training Note:** Always implement i18n support for user-facing strings. Follow this guide for multi-language support.

### i18n Overview

KIMU supports internationalization through:
- JSON language files
- Translation service
- Dynamic language switching
- String interpolation
- Pluralization support (optional)

### Setting Up i18n

#### 1. Create Language Files

Create language files in `src/modules/i18n/locales/`:

**`en.json`:**
```json
{
  "common": {
    "hello": "Hello",
    "welcome": "Welcome to KIMU!",
    "save": "Save",
    "cancel": "Cancel"
  },
  "errors": {
    "network": "Network error. Please try again.",
    "notFound": "Resource not found"
  },
  "user": {
    "profile": "User Profile",
    "settings": "Settings"
  }
}
```

**`it.json`:**
```json
{
  "common": {
    "hello": "Ciao",
    "welcome": "Benvenuto in KIMU!",
    "save": "Salva",
    "cancel": "Annulla"
  },
  "errors": {
    "network": "Errore di rete. Riprova.",
    "notFound": "Risorsa non trovata"
  },
  "user": {
    "profile": "Profilo Utente",
    "settings": "Impostazioni"
  }
}
```

#### 2. Initialize i18n Service

```typescript
import { KimuModuleManager } from '@kimu/core';
import I18nModule from './modules/i18n/module';

const moduleManager = KimuModuleManager.getInstance();
const i18nModule = new I18nModule('i18n', '1.0.0', {
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  supportedLanguages: ['en', 'it', 'fr']
});
await moduleManager.loadModule(i18nModule);

const i18n = moduleManager.getI18nService();
```

#### 3. Use Translations in Components

```typescript
export class MyComponent extends KimuComponentElement {
  private i18n: any;
  
  onInit() {
    this.i18n = KimuModuleManager.getInstance().getI18nService();
  }
  
  getData() {
    return {
      // Pass translate function to template
      translate: this.i18n.translate,
      
      // Or translate in component
      welcomeMessage: this.i18n.translate('common.welcome'),
      saveButton: this.i18n.translate('common.save')
    };
  }
}
```

#### 4. Use in Templates

```html
<div>
  <h1>${translate('common.welcome')}</h1>
  <p>${translate('user.profile')}</p>
  <button>${translate('common.save')}</button>
</div>
```

#### 5. String Interpolation

For dynamic content:

**Language file:**
```json
{
  "greeting": "Hello, {name}!",
  "itemCount": "You have {count} items"
}
```

**In code:**
```typescript
const greeting = this.i18n.translate('greeting', { name: 'John' });
// Result: "Hello, John!"

const itemCount = this.i18n.translate('itemCount', { count: 5 });
// Result: "You have 5 items"
```

#### 6. Language Switching

```typescript
// Get current language
const currentLang = i18n.getCurrentLanguage();  // 'en'

// Set language
i18n.setLanguage('it');

// Listen for language changes
i18n.onLanguageChange((newLang) => {
  console.log('Language changed to:', newLang);
  // Re-render components
});
```

#### 7. Language Switcher UI

```html
<select id="langSelect">
  <option value="en">English</option>
  <option value="it">Italiano</option>
  <option value="fr">Français</option>
</select>
```

```typescript
onInit() {
  const langSelect = this.$('#langSelect');
  langSelect?.addEventListener('change', (e) => {
    const lang = (e.target as HTMLSelectElement).value;
    this.i18n.setLanguage(lang);
    this.onRender();  // Re-render with new language
  });
}
```

### i18n Best Practices

1. **Always use translation keys** - Never hardcode user-facing text:
```typescript
// ❌ Bad
button.textContent = 'Save';

// ✅ Good
button.textContent = this.i18n.translate('common.save');
```

2. **Organize keys hierarchically**:
```json
{
  "common": { "save": "Save", "cancel": "Cancel" },
  "user": { "profile": "Profile", "settings": "Settings" },
  "errors": { "network": "Network error" }
}
```

3. **Provide fallbacks**:
```typescript
const text = this.i18n.translate('some.key') || 'Default Text';
```

4. **Keep translations up to date** - When adding new features, update all language files.

5. **Use descriptive keys** - Keys should indicate context:
```json
{
  "button.save": "Save",
  "button.cancel": "Cancel",
  "error.network": "Network error",
  "title.userProfile": "User Profile"
}
```

---

## Practical Examples

> **Agent Training Note:** Use these examples as templates when generating code.

### Example 1: Minimal Extension

```typescript
// src/extensions/hello-world/component.ts
import { KimuComponent } from '../../core/kimu-component';
import { KimuComponentElement } from '../../core/kimu-component-element';

@KimuComponent({
  tag: 'hello-world',
  name: 'Hello World',
  version: '1.0.0',
  description: 'A simple hello world component',
  author: 'KIMU Team',
  icon: '👋',
  internal: false,
  path: 'hello-world',
  dependencies: []
})
export class HelloWorldComponent extends KimuComponentElement {
  onInit() {
    console.log('Hello World initialized!');
  }
  
  getData() {
    return {
      message: 'Hello, KIMU Framework!'
    };
  }
}
```

```html
<!-- src/extensions/hello-world/view.html -->
<div class="hello-world">
  <h1>${message}</h1>
</div>
```

```css
/* src/extensions/hello-world/style.css */
hello-world {
  display: block;
  padding: 20px;
  text-align: center;
}

hello-world h1 {
  color: #007bff;
  font-size: 32px;
}
```

### Example 2: Counter Component with State

```typescript
// src/extensions/counter/component.ts
@KimuComponent({
  tag: 'kimu-counter',
  name: 'Counter',
  version: '1.0.0',
  description: 'A simple counter component',
  author: 'KIMU Team',
  icon: '🔢',
  internal: false,
  path: 'counter',
  dependencies: []
})
export class CounterComponent extends KimuComponentElement {
  private count: number = 0;
  
  onInit() {
    this.count = 0;
    this.setupEventListeners();
  }
  
  onRender() {
    const display = this.$('#count-display');
    if (display) {
      display.textContent = this.count.toString();
    }
  }
  
  private setupEventListeners() {
    this.$('#increment')?.addEventListener('click', () => this.increment());
    this.$('#decrement')?.addEventListener('click', () => this.decrement());
    this.$('#reset')?.addEventListener('click', () => this.reset());
  }
  
  private increment() {
    this.count++;
    this.onRender();
  }
  
  private decrement() {
    this.count--;
    this.onRender();
  }
  
  private reset() {
    this.count = 0;
    this.onRender();
  }
  
  getData() {
    return {
      count: this.count
    };
  }
}
```

```html
<!-- src/extensions/counter/view.html -->
<div class="counter">
  <h2>Counter</h2>
  <div class="display">
    <span id="count-display">${count}</span>
  </div>
  <div class="controls">
    <button id="decrement">-</button>
    <button id="reset">Reset</button>
    <button id="increment">+</button>
  </div>
</div>
```

### Example 3: Data Fetching Component

```typescript
// src/extensions/user-list/component.ts
interface User {
  id: number;
  name: string;
  email: string;
}

@KimuComponent({
  tag: 'user-list',
  name: 'User List',
  version: '1.0.0',
  description: 'Displays a list of users',
  author: 'KIMU Team',
  icon: '👥',
  internal: false,
  path: 'user-list',
  dependencies: []
})
export class UserListComponent extends KimuComponentElement {
  private users: User[] = [];
  private loading: boolean = false;
  private error: string | null = null;
  
  async onInit() {
    await this.loadUsers();
  }
  
  private async loadUsers() {
    this.loading = true;
    this.error = null;
    this.onRender();
    
    try {
      const response = await fetch('https://api.example.com/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      
      this.users = await response.json();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      this.loading = false;
      this.onRender();
    }
  }
  
  onRender() {
    const container = this.$('#user-container');
    if (!container) return;
    
    if (this.loading) {
      container.innerHTML = '<p>Loading...</p>';
      return;
    }
    
    if (this.error) {
      container.innerHTML = `<p class="error">${this.error}</p>`;
      return;
    }
    
    container.innerHTML = this.users
      .map(user => `
        <div class="user-card">
          <h3>${user.name}</h3>
          <p>${user.email}</p>
        </div>
      `)
      .join('');
  }
}
```

### Example 4: Form Component

```typescript
// src/extensions/contact-form/component.ts
@KimuComponent({
  tag: 'contact-form',
  name: 'Contact Form',
  version: '1.0.0',
  description: 'A contact form with validation',
  author: 'KIMU Team',
  icon: '📝',
  internal: false,
  path: 'contact-form',
  dependencies: []
})
export class ContactFormComponent extends KimuComponentElement {
  private formData = {
    name: '',
    email: '',
    message: ''
  };
  
  onInit() {
    this.setupForm();
  }
  
  private setupForm() {
    const form = this.$('form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    
    // Real-time validation
    this.$('#email')?.addEventListener('blur', () => {
      this.validateEmail();
    });
  }
  
  private handleSubmit() {
    if (!this.validateForm()) {
      return;
    }
    
    console.log('Form submitted:', this.formData);
    
    // Send data to server
    this.submitForm();
  }
  
  private validateForm(): boolean {
    const nameInput = this.$('#name') as HTMLInputElement;
    const emailInput = this.$('#email') as HTMLInputElement;
    const messageInput = this.$('#message') as HTMLTextAreaElement;
    
    this.formData.name = nameInput?.value || '';
    this.formData.email = emailInput?.value || '';
    this.formData.message = messageInput?.value || '';
    
    if (!this.formData.name || !this.formData.email || !this.formData.message) {
      this.showError('All fields are required');
      return false;
    }
    
    if (!this.isValidEmail(this.formData.email)) {
      this.showError('Invalid email address');
      return false;
    }
    
    return true;
  }
  
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  private validateEmail() {
    const emailInput = this.$('#email') as HTMLInputElement;
    const email = emailInput?.value || '';
    
    if (email && !this.isValidEmail(email)) {
      emailInput?.classList.add('invalid');
    } else {
      emailInput?.classList.remove('invalid');
    }
  }
  
  private showError(message: string) {
    const errorDiv = this.$('#error-message');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  }
  
  private async submitForm() {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.formData)
      });
      
      if (response.ok) {
        this.showSuccess('Message sent successfully!');
        this.resetForm();
      } else {
        this.showError('Failed to send message');
      }
    } catch (error) {
      this.showError('Network error. Please try again.');
    }
  }
  
  private showSuccess(message: string) {
    const successDiv = this.$('#success-message');
    if (successDiv) {
      successDiv.textContent = message;
      successDiv.style.display = 'block';
    }
  }
  
  private resetForm() {
    const form = this.$('form') as HTMLFormElement;
    form?.reset();
    this.formData = { name: '', email: '', message: '' };
  }
}
```

---

## Build & Script Commands

> **Agent Reminder:** Use these commands for development, testing, and deployment.

### Common NPM Scripts

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm start` | Start development server with hot reload | During development |
| `npm run build` | Build for production (output in `/dist/`) | Before deployment |
| `npm test` | Run all tests | Before commit/release |
| `npm run lint` | Check code style and errors | Before commit |
| `npm run format` | Format code with Prettier | To ensure consistency |
| `npm run clean` | Clean build artifacts | Before fresh build |

### Development Workflow

1. **Start development**:
```bash
npm start
```
Server runs on `http://localhost:3000` with hot reload.

2. **Make changes**:
- Edit files in `src/`
- Changes auto-reload in browser
- Check console for errors

3. **Check code quality**:
```bash
npm run lint
npm run format
```

4. **Run tests**:
```bash
npm test
```

5. **Build for production**:
```bash
npm run build
```
Output in `/dist/` directory.

6. **Preview production build**:
```bash
npm run preview
```

### Troubleshooting Build Issues

**If build fails:**
1. Clean project: `npm run clean`
2. Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`
3. Check Node version: `node --version` (should be >= 18)
4. Review error messages carefully
5. Check `tsconfig.json` and `vite.config.ts` for misconfigurations

**If hot reload doesn't work:**
1. Restart dev server
2. Clear browser cache
3. Check browser console for errors
4. Verify file paths are correct

---

## Security Best Practices

> **Agent Reminder:** Security is critical. Always follow these guidelines when developing KIMU applications.

### Input Validation
- **Validate all user inputs**: Check type, format, length, and allowed values before processing
- **Sanitize strings**: Remove or escape potentially dangerous characters in user-provided text
- **Validate file uploads**: Check file type, size, and content before accepting uploads
- **Use TypeScript types**: Leverage type system to catch errors at compile time

```typescript
// Good: Input validation
function processUserId(userId: string): number {
  const id = parseInt(userId);
  if (isNaN(id) || id <= 0) {
    throw new Error('Invalid user ID');
  }
  return id;
}

// Bad: No validation
function processUserId(userId: string): number {
  return parseInt(userId);  // Could be NaN or negative
}
```

### DOM Manipulation Safety
- **Always use framework APIs**: Use `this.$()` instead of direct DOM manipulation
- **Avoid `innerHTML` with user content**: Prevents XSS attacks
- **Use `textContent` for text**: Safer than `innerHTML` for plain text
- **Sanitize HTML if needed**: Use a library like DOMPurify for user-generated HTML

```typescript
// Good: Safe text insertion
element.textContent = userInput;

// Bad: XSS vulnerability
element.innerHTML = userInput;  // NEVER do this with user input!
```

### Dependency Management
- **Keep dependencies updated**: Regularly check for security updates
- **Review dependencies**: Check package reputation and maintenance status
- **Use lock files**: Commit `package-lock.json` to ensure consistent dependencies
- **Audit regularly**: Run `npm audit` to check for known vulnerabilities

```bash
# Check for vulnerabilities
npm audit

# Fix automatically (when possible)
npm audit fix

# Update dependencies
npm update
```

### Authentication & Authorization
- **Never store credentials in code**: Use environment variables for sensitive data
- **Implement proper auth guards**: Check permissions before allowing actions
- **Use secure session management**: Implement timeout and secure storage
- **Validate on server side**: Never trust client-side validation alone

```typescript
// Good: Route guard with auth check
router.addRoute('/admin', () => {
  if (!isAuthenticated() || !hasAdminRole()) {
    router.navigate('/login');
    return;
  }
  loadAdminPanel();
});
```

### Data Protection
- **Don't log sensitive data**: Avoid logging passwords, tokens, personal information
- **Use HTTPS**: Always use secure connections in production
- **Encrypt sensitive storage**: Use proper encryption for stored sensitive data
- **Clear sensitive data**: Remove from memory when no longer needed

```typescript
// Good: No sensitive data in logs
console.log('User logged in:', user.id);

// Bad: Sensitive data exposed
console.log('User logged in:', user.password);  // NEVER!
```

### Error Handling
- **Don't expose internals**: Show generic error messages to users
- **Log details server-side**: Keep detailed logs on server, not client
- **Handle all errors**: Use try-catch and provide fallbacks
- **Validate external data**: Always check data from APIs or external sources

```typescript
// Good: Generic user message
try {
  await fetchUserData();
} catch (error) {
  showToUser('Unable to load data. Please try again.');
  logToServer(error);  // Log full details server-side
}

// Bad: Exposing error details
try {
  await fetchUserData();
} catch (error) {
  alert(error.message);  // Could expose stack traces or paths
}
```

### Security Checklist
Before deploying to production:
- [ ] All user inputs are validated and sanitized
- [ ] No sensitive data in client-side code
- [ ] All dependencies are up to date
- [ ] HTTPS is enabled
- [ ] Authentication and authorization are properly implemented
- [ ] Error messages don't expose sensitive information
- [ ] Security headers are configured
- [ ] CORS is properly configured
- [ ] Content Security Policy (CSP) is implemented
- [ ] Regular security audits are scheduled

### Additional Resources
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Security Best Practices: Review `SECURITY.md` in project root
- npm audit documentation: https://docs.npmjs.com/cli/v8/commands/npm-audit

---

## FAQ & Troubleshooting

> **Agent Reminder:** Check this section when encountering common issues. Consult this section for common issues, edge cases, and best practices for error handling and project conventions.

### General Questions

**Q: How do I create composite extensions with child dependencies?**
A: Use the `dependencies` metadata in `@KimuComponent` to specify child extension tags. These will be automatically loaded and available as HTML tags in your template. See the Extension Creation Guide section for detailed examples.

**Q: What's the difference between dependencies and regular imports?**
A: The `dependencies` field is for KIMU child extensions that become available as HTML tags in your template. Regular imports are for utility functions, types, or external libraries.

**Q: What's the difference between a module and an extension?**
A: 
- **Module**: Provides services/logic (no UI). Examples: router, i18n, storage.
- **Extension**: UI component with view, styles, and logic. Examples: dashboard, login page.

**Q: Where do I put shared utilities?**
A: Use `/src/utils/` for reusable functions.

**Q: Where do I put utility functions?**
A: Place reusable utilities in `src/utils/`. Create separate files for different purposes (e.g., `date-utils.ts`, `string-utils.ts`).

**Q: How do I share code between extensions?**
A: 
1. Create utilities in `src/utils/`
2. Create a module if it's a service
3. Use child extensions via `dependencies` field

**Q: Can I use external libraries?**
A: Yes! Install via npm and import normally:
```bash
npm install lodash
```
```typescript
import _ from 'lodash';
```

**Q: How do I add a new test?**
A: Place test files in `/tests/` and follow the naming conventions.

**Q: How do I update documentation?**
A: Edit files in `/docs/` and add examples for new features.

**Q: Lint or build errors?**
A: Run `npm run lint` and `npm run build` to check for issues. Fix according to `CODE_GUIDELINES.md`.

### Component Issues

**Q: My component doesn't render**
A: Check:
1. Is the component registered in `extension-manifest.json`?
2. Did you call `onRender()` in `onInit()`?
3. Are there errors in the browser console?
4. Is the component tag correct in HTML?

**Q: Template variables show as `${variable}` literally**
A: Ensure:
1. `getData()` returns the variable
2. Variable name matches exactly in template
3. `onRender()` is called to process template

**Q: Styles don't apply**
A: Check:
1. CSS file is imported/loaded
2. Selectors are correct (prefix with component tag)
3. No conflicting global styles
4. Browser DevTools for CSS specificity issues

**Q: Events don't work**
A: Verify:
1. Event listeners are added in `onInit()` or after DOM is ready
2. Elements exist before adding listeners (use `this.$()`)
3. Event names are correct
4. Functions are properly bound (`this` context)

### Routing Issues

**Q: Routes don't work**
A: Check:
1. Router module is loaded in `main.ts`
2. Routes are defined before navigation
3. Route paths match exactly (including leading `/`)
4. Hash mode is enabled (`#/path`)

**Q: Route parameters are undefined**
A: Ensure:
1. Route is defined with parameter syntax (`:param`)
2. Calling `getParams()` inside route handler
3. URL matches route pattern

### i18n Issues

**Q: Translations don't show**
A: Verify:
1. i18n module is loaded
2. Language files exist in correct location
3. Translation keys match exactly
4. Current language is set correctly

**Q: Language switching doesn't work**
A: Check:
1. `setLanguage()` is called
2. Components re-render after language change
3. Language file exists for target language

### Build Issues

**Q: Build fails with TypeScript errors**
A: Run:
```bash
npm run lint
```
Fix all TypeScript errors before building.

**Q: Build output is too large**
A: Optimize:
1. Enable tree shaking in vite config
2. Lazy load large components
3. Minify code (should be automatic)
4. Check for duplicate dependencies

**Q: Hot reload is slow**
A: Improve:
1. Reduce number of files being watched
2. Add exclusions to vite config
3. Use faster disk (SSD vs HDD)
4. Close other resource-intensive apps

### Performance Issues

**Q: Component is slow to render**
A: Optimize:
1. Minimize DOM operations
2. Cache DOM queries
3. Use debouncing for frequent updates
4. Lazy load data
5. Avoid unnecessary re-renders

**Q: App uses too much memory**
A: Fix:
1. Remove event listeners in `onDestroy()`
2. Clear intervals/timeouts
3. Release references to large objects
4. Check for memory leaks with DevTools

---

## Testing & Quality Assurance

> **Agent Training Note:** Always write tests for new features and run quality checks before committing.

### Testing Strategy

1. **Unit Tests**: Test individual functions and methods
2. **Component Tests**: Test component behavior and rendering
3. **Integration Tests**: Test multiple components working together
4. **E2E Tests**: Test complete user flows

### Writing Tests

Example using Vitest:

```typescript
// tests/extensions/counter.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { CounterComponent } from '../../src/extensions/counter/component';

describe('CounterComponent', () => {
  let counter: CounterComponent;
  
  beforeEach(() => {
    counter = new CounterComponent();
    counter.onInit();
  });
  
  it('should initialize with count of 0', () => {
    expect(counter['count']).toBe(0);
  });
  
  it('should increment count', () => {
    counter['increment']();
    expect(counter['count']).toBe(1);
  });
  
  it('should decrement count', () => {
    counter['decrement']();
    expect(counter['count']).toBe(-1);
  });
  
  it('should reset count to 0', () => {
    counter['count'] = 5;
    counter['reset']();
    expect(counter['count']).toBe(0);
  });
});
```

### Quality Checklist

Before committing code, verify:
- [ ] Code builds without errors (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] Linter passes (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] No console errors in browser
- [ ] Component works as expected
- [ ] Documentation is updated
- [ ] Types are properly defined (no `any`)

### Code Review Guidelines

When reviewing code:
1. **Functionality**: Does it work correctly?
2. **Tests**: Are there adequate tests?
3. **Style**: Does it follow conventions?
4. **Performance**: Any obvious bottlenecks?
5. **Security**: Any vulnerabilities?
6. **Documentation**: Are comments clear?

---

## Glossary

> **Agent Reminder:** Use these definitions for consistent terminology. Refer to the glossary for precise definitions of key concepts and terminology used throughout the project.

- **KimuComponentElement**: Base class for all UI components in kimu-core.
- **KimuComponent**: Decorator for defining components with metadata.
- **Component**: A modular UI unit that extends `KimuComponentElement`.
- **Extension**: A complete custom  feature added in `/src/extensions/`consisting of component.ts, style.css, and view.html.
- **Module**: A service or utility that provides reusable functionality without UI.
- **Data Binding**: Linking UI elements to logic using reactive properties/methods.
- **Lifecycle**: The sequence of events in a component's existence (init, render, destroy).
- **Template Engine**: The system that interpolates `${variables}` in HTML templates.
- **Decorator**: TypeScript feature used for component metadata (`@KimuComponent`).
- **Event Management**: Handling user interactions and system events in components.
- **UI Rendering**: Process of displaying components in the browser.
- **Service**: A class that provides specific functionality (from a module).
- **Router**: Module that manages client-side navigation and URL routing.
- **i18n**: Internationalization - supporting multiple languages.
- **Manifest**: JSON file listing all registered extensions.
- **Hot Reload**: Automatic browser refresh when code changes during development.
- **Tree Shaking**: Removing unused code from production build.
- **Dependency**: A child extension that a parent extension requires.
- **Copilot Agent**: AI assistant that reads this file to generate code and suggestions.
- **Semantic Versioning**: Versioning system (MAJOR.MINOR.PATCH) for releases.

---

## Agent Training & Workflow

### Copilot & AI Agent Guide
> **Agent Training Note:** This document is your primary source for generating code, following conventions, and applying best practices in KIMU-Core. Read everything, always consult the following sections: Practical Examples, FAQ, Testing, Glossary, Modules, Router, i18n. Propose improvements if you identify missing patterns.

- **Read the entire document** before generating or modifying code.
- **Follow the conventions** in `CODE_GUIDELINES.md` and `CONTRIBUTING.md`.
- **Use practical examples** as templates.
- **Consult the FAQ** for common issues and edge cases.
- **Propose improvements** if you identify missing patterns.
- **Use the Glossary** for precise definitions.
- **Follow the checklist** for modules and extensions.
- **Always document** public APIs and workflows.

### Recommended Workflow for AI Agents
1. Read the creation checklist (module/extension).
2. Follow practical examples.
3. Consult cross-cutting best practices.
4. Use modular patterns and document everything.
5. Update the guide if you introduce new patterns.

### Cross-cutting Best Practices
- Modularity and reusability.
- Clear documentation in English.
- Unit and integration tests.
- Consistent and semantic naming.
- Secure dependency management.
- Input validation and security.
- Continuous guide updates.

### Agent Reminder
> Always insert "Agent Reminder" and "Agent Training Note" at the beginning of key sections (modules, extensions, router, i18n, testing, FAQ).

---

## Additional Resources

### Official Documentation
- KIMU Core Repository: https://github.com/UnicoVerso/kimu-core
- KIMU Documentation: https://github.com/UnicoVerso/kimu-docs
- Code Guidelines: `CODE_GUIDELINES.md`
- Contributing Guide: `CONTRIBUTING.md`

### TypeScript Resources
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- TypeScript Deep Dive: https://basarat.gitbook.io/typescript/

### Web Components
- Web Components Spec: https://developer.mozilla.org/en-US/docs/Web/Web_Components
- Custom Elements: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements

### Build Tools
- Vite Documentation: https://vitejs.dev/
- Vite Plugins: https://vitejs.dev/plugins/

### Testing
- Vitest Documentation: https://vitest.dev/
- Testing Library: https://testing-library.com/

---

## Final Notes for AI Agents

> **Agent Training Note:** Remember these key principles when working with KIMU:

1. **Read First, Code Second**: Always review this guide and relevant sections before generating code
2. **Follow Patterns**: Use provided examples and established patterns
3. **Stay Modular**: Keep components small, focused, and reusable
4. **Document Everything**: Clear comments and documentation are essential
5. **Test Thoroughly**: Write tests and verify functionality
6. **Ask When Uncertain**: Better to ask than generate incorrect code
7. **Keep It Simple**: KIMU values simplicity and clarity over complexity
8. **Use TypeScript**: Leverage types for safety and developer experience
9. **Respect Conventions**: Follow naming, structure, and style guidelines
10. **Continuous Learning**: This guide evolves - suggest improvements when you find better patterns

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Maintained By**: KIMU Framework Team  

For questions, issues, or contributions, visit: https://github.com/UnicoVerso/kimu-core
