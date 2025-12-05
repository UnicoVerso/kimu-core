# Project-Specific Copilot Instructions

> **🎯 This File's Purpose:**  
> This file contains **project-specific rules, conventions, and guidelines** for this particular KIMU-based project. You can freely modify this file to add custom workflows, coding standards, or project-specific requirements.

> **📚 Framework Documentation:**  
> For complete KIMU framework knowledge, **always read first**: `.github/kimu-copilot-instructions.md`  
> That file contains all framework concepts, APIs, patterns, and best practices.

---

## 🏗️ This Project Uses KIMU Framework

This project is built with **KIMU-Core**, a modular TypeScript framework for web applications using Web Components.

### 📖 Essential Documentation Files

1. **`.github/kimu-copilot-instructions.md`** ← **READ THIS FIRST!**
   - Complete framework reference
   - Extension and module creation guides
   - Router, i18n, security best practices
   - Examples, FAQ, troubleshooting
   - **DO NOT MODIFY** (framework documentation)

2. **`.github/copilot-instructions.md`** ← This file
   - Project-specific rules
   - Custom conventions for this project
   - **FREELY MODIFIABLE** for project needs

3. **`CODE_GUIDELINES.md`** (if present)
   - Coding style and conventions

4. **`README.md`**
   - Project overview and setup

---

## 🎯 AI Agent Instructions

When working on this project:

1. **ALWAYS read `.github/kimu-copilot-instructions.md` first** for KIMU framework knowledge
2. Follow the extension and module creation checklists from that guide
3. Use KIMU lifecycle methods (`onInit`, `onRender`, `onDestroy`)
4. Use `this.$()` for DOM selection within components
5. Follow KIMU security best practices (input validation, safe DOM manipulation)
6. Apply the project-specific rules below

---

## 📋 Project-Specific Rules & Conventions

> **Note to Developers:** Add your custom project rules below. Examples:
> - Naming conventions specific to this project
> - Custom module or extension patterns
> - API endpoints and data models
> - Authentication/authorization flows
> - Deployment procedures
> - Team workflows

### Example: Custom Naming Convention
```typescript
// Prefix all custom extensions with project name
// Good: my-project-dashboard, my-project-login
// Bad: dashboard, login
```

### Example: Custom Module Pattern
```typescript
// All API calls must use the centralized API service
// Located in: src/modules/api/api-service.ts
```

---

## 🔧 Quick Reference

### KIMU Framework Essentials (from kimu-copilot-instructions.md)

- **Extension structure**: `component.ts` + `style.css` + `view.html`
- **Base class**: `KimuComponentElement`
- **Decorator**: `@KimuComponent({ tag, name, version, ... })`
- **Lifecycle**: `onInit()`, `onRender()`, `onDestroy()`
- **DOM selection**: `this.$('#id')` or `this.$('.class')`
- **Template interpolation**: `${variable}` in `view.html`

---

## 📝 Notes for AI Agents

- This project follows KIMU framework conventions (see `kimu-copilot-instructions.md`)
- All code must be in TypeScript with strict mode
- Use English for all comments and documentation
- Run `npm run lint` and `npm test` before committing
- Follow semantic versioning for releases
- Document all new extensions/modules in `docs/` folder
- Update `README.md` with setup or usage changes

---

### Project-Specific

_(Add your custom shortcuts here)_
