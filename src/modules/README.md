# KIMU Active Modules

This directory contains **installed modules** that are included in the build.

## 📦 What's Here

Only modules that have been explicitly installed using:
```bash
npm run install:module <module-name>
```

## Current Status

Check installed modules:
```bash
npm run list:modules
```

## How It Works

### Installation Process
1. Module is **copied** from `src/modules-repository/<module-name>/`
2. Files appear in this directory: `src/modules/<module-name>/`
3. Module is registered in `modules-manifest.json`
4. Module is included in next build

### Removal Process
1. Module directory is **deleted** from `src/modules/<module-name>/`
2. Module is removed from `modules-manifest.json`
3. Module is excluded from next build
4. Module remains available in `modules-repository` for reinstallation

## modules-manifest.json

This file tracks all installed modules:

```json
{
  "installedModules": [
    {
      "name": "i18n",
      "version": "1.0.0",
      "path": "i18n",
      "installedAt": "2025-01-17T00:00:00.000Z"
    }
  ],
  "availableModules": [],
  "lastUpdate": "2025-01-17T00:00:00.000Z"
}
```

## Best Practices

- ✅ **Commit `modules-manifest.json`** to track which modules your project uses
- ✅ **Install only needed modules** to keep build size minimal
- ❌ **Don't manually edit module files** - changes will be lost on reinstall
- ❌ **Don't manually modify `modules-manifest.json`** - use provided scripts

## Commands

```bash
# List modules
npm run list:modules

# Install a module
npm run install:module router

# Remove a module
npm run remove:module router

# Build with current modules
npm run build
```

## See Also

- [Module Management Guide](../../docs/MODULE_MANAGEMENT.md)
- [Available Modules](../modules-repository/README.md)
- [Main Documentation](../../README.md)
