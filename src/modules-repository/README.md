# KIMU Modules Repository

This directory contains **available modules** that can be installed in KIMU applications.

## ⚠️ Important Rules

1. **DO NOT modify files in this directory** - This is the central repository
2. **DO NOT import from this directory** - Use `src/modules/` instead
3. **To use a module**, install it first: `npm run install:module <module-name>`

## 📁 Location

This repository is located in `src/modules-repository/` to ensure:
- ✅ Correct TypeScript import paths
- ✅ IDE autocompletion and type checking
- ✅ No compilation errors during module development
- ✅ Automatic exclusion from build via tree-shaking

## How it works

### Installation
When you install a module (e.g., `npm run install:module router`):
1. The module is **copied** from `src/modules-repository/router/` to `src/modules/router/`
2. The module becomes part of the build
3. You can import and use it in your application

### Uninstallation
When you remove a module (e.g., `npm run remove:module router`):
1. The module is **deleted** from `src/modules/router/`
2. The module is excluded from the build
3. It remains available in `src/modules-repository/` for future reinstallation

### Repository Structure
```
src/modules-repository/
├── router/
│   ├── manifest.json       # Module metadata and dependencies
│   ├── module.ts           # Module class (entry point)
│   ├── router.ts           # Service implementation
│   ├── README.md           # English documentation
│   └── README.it.md        # Italian documentation
└── i18n/
    ├── manifest.json
    ├── module.ts
    ├── i18n-service.ts
    ├── README.md
    └── README.it.md
```

## Adding New Modules

1. Create a folder with the module name in `src/modules-repository/`
2. Add required files:
   - `manifest.json` - Module metadata, dependencies, and compatibility
   - `module.ts` - Main module class extending `KimuModule`
   - Service implementation files
   - `README.md` - English documentation
   - `README.it.md` (optional) - Italian documentation
3. Use standard import paths (they will work correctly from this location)

## Available Modules

### Router Module
**Location:** `router/`  
**Version:** 1.0.0  
**Description:** Client-side routing module for KIMU applications with History API support

**Install:**
```bash
npm run install:module router
```

**Usage after installation:**
```typescript
import RouterModule from './modules/router/module';

const router = new RouterModule();
const routerService = router.getService();

routerService.addRoute('/', () => console.log('Home'));
routerService.navigate('/');
```

## Commands Reference

```bash
# List all available and installed modules
npm run list:modules

# Install a module from repository
npm run install:module <module-name>

# Remove an installed module
npm run remove:module <module-name>
```

## Build Behavior

Modules in `src/modules-repository/` are **automatically excluded** from the build because:
- They are never imported by the main application
- Vite's tree-shaking removes unused code
- Only modules in `src/modules/` (installed) are included in the final bundle

## See Also

- [Module Management Guide](../../docs/MODULE_MANAGEMENT.md)
- [Creating Extensions](../../docs/EXTENSIONS.md)
- [Main Documentation](../../README.md)
