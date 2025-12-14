# Theme Module - CSS-Based Theme Management

## Overview

The **Theme Module** provides a complete CSS-based theme management system for KIMU-Core applications. It supports multiple predefined themes (Light, Dark, Ocean, Cozy) and allows easy registration of custom themes through external CSS files.

## Architecture

The theme module uses **KIMU Global Styles** system to inject theme CSS into all extensions automatically:

1. **KimuGlobalStyles** (core): Manages CSS files that should be injected in all extensions
2. **ThemeService**: Registers the active theme CSS as a global style
3. **KimuComponentElement**: Automatically injects all global styles into each extension's shadow root
4. **src/config/themes-config.json**: User configuration file with all available themes

This architecture ensures:
- ✅ Theme module is **optional** - framework works without it (fallback styles in `style.css`)
- ✅ Themes are automatically applied to **all extensions** (including shadow DOM)
- ✅ Theme changes propagate to **existing extensions** dynamically
- ✅ **No hardcoded dependencies** in core framework
- ✅ **Easy theme management** via JSON configuration file
- ✅ **Configuration survives module updates** - user config is separate from module files

## Module Structure

```
src/modules/theme/
├── themes/                         # Theme source CSS files
│   ├── theme-light.css
│   ├── theme-dark.css
│   ├── theme-ocean.css
│   ├── theme-cozy.css
│   ├── theme-nord.css
│   ├── theme-forest.css
│   ├── theme-high-contrast.css
│   └── theme-cyberpunk.css
├── themes-config.json.example      # Theme configuration example
├── pre-build.js                    # Pre-build script (copies themes to public/)
├── theme-service.ts                # Main service
└── README.md                       # This file

src/config/
└── theme/
    └── themes-config.json              # User configuration (copy from example)
```

**Build Process**: The pre-build script automatically copies all CSS files from `themes/` to `public/themes/` before compilation.

## Post-Installation Setup

After installing the theme module, you need to create the themes configuration file:

### 1. Create themes configuration file

Copy the example file to your config folder:
```bash
mkdir -p src/config/theme
cp src/modules/theme/themes-config.json.example src/config/theme/themes-config.json
```

Or create `src/config/theme/themes-config.json` manually using the example as template.

### 2. Customize your themes

Edit `src/config/theme/themes-config.json` to add, remove, or modify themes:

```json
{
  "themes": [
    {
      "name": "light",
      "mode": "light",
      "cssPath": "theme-light.css",
      "description": "Clean and bright theme",
      "icon": "☀️"
    },
    {
      "name": "dark",
      "mode": "dark",
      "cssPath": "theme-dark.css",
      "description": "Dark theme for low-light",
      "icon": "🌙"
    }
  ]
}
```

## Features

- 🎨 **CSS-Based Themes**: Each theme is a separate CSS file for maximum flexibility
- ☀️ **Light Mode**: Clean and bright theme for daytime use  
- 🌙 **Dark Mode**: Dark theme for low-light environments
- 🌊 **Ocean Theme**: Ocean-inspired dark theme with blue-green tones
- 🌸 **Cozy Theme**: Warm, feminine and cozy theme with soft colors
- ❄️ **Nord Theme**: Cold and relaxing Nordic theme for developers
- 🌲 **Forest Theme**: Natural green theme inspired by nature
- ⚡ **High Contrast Theme**: WCAG AAA accessible theme
- 🎮 **Cyberpunk Theme**: Futuristic neon aesthetic
- 🔄 **Auto Mode**: Automatically follows system color scheme preferences
- 💾 **Persistence**: User preferences saved in localStorage
- 🎯 **System Integration**: MediaQuery API for system preference detection
- 🔌 **Extensible**: Easy registration of custom CSS themes
- 🌐 **Global Styles**: Themes automatically injected in all extensions via Global Styles system

## Quick Start

### Basic Usage

\`\`\`typescript
import { themeService } from './modules/theme/theme-service';

// Set theme
themeService.setMode('dark');    // Switch to dark theme
themeService.setMode('light');   // Switch to light theme
themeService.setMode('ocean');   // Switch to ocean theme
themeService.setMode('cozy');    // Switch to cozy theme
themeService.setMode('auto');    // Use system preference

// Quick toggle
themeService.toggle();           // Toggle between light/dark

// Get current theme
const mode = themeService.getMode();
const themeName = themeService.getCurrentThemeName();
\`\`\`

### Listen to Theme Changes

\`\`\`typescript
themeService.onChange((themeName: string, mode: string) => {
  console.log(\`Theme changed to: \${themeName}\`);
});
\`\`\`

## Available Themes

### 1. Light Theme
Clean and bright theme optimized for daytime use.

### 2. Dark Theme
Dark theme for low-light environments and reduced eye strain.

### 3. Ocean Theme
Ocean-inspired dark theme with blue-green tones.

### 4. Cozy Theme
Warm, feminine and cozy theme with soft pastel colors.

## Creating Custom Themes

### Step 1: Create CSS File

\`\`\`css
/* my-custom-theme.css */
:root {
  --kimu-primary: #your-color;
  --kimu-background: #your-background;
  --kimu-text-primary: #your-text-color;
  /* ...other variables... */
}
\`\`\`

### Step 2: Register the Theme

\`\`\`typescript
themeService.registerCssTheme({
  name: 'my-theme',
  mode: 'dark',
  cssPath: '/themes/my-custom-theme.css',
  description: 'My awesome custom theme'
});
\`\`\`

### Step 3: Apply the Theme

\`\`\`typescript
themeService.setMode('my-theme');
\`\`\`

## Using CSS Variables

\`\`\`css
.my-component {
  background: var(--kimu-background);
  color: var(--kimu-text-primary);
  border: 1px solid var(--kimu-border);
}

.my-button {
  background: var(--kimu-primary);
  color: white;
}
\`\`\`

## Module Independence & Fallback System

### How It Works

The theme system is designed to work as an **optional module**:

1. **Without Theme Module**: 
   - Default CSS variables are defined in `src/assets/style.css`
   - Application has basic Light theme styling
   - All components work normally with default colors

2. **With Theme Module**:
   - Theme CSS files **override** default values from `style.css`
   - Dynamic theme switching available
   - User preferences persist across sessions

### Architecture

\`\`\`
┌─────────────────────────────────────────────┐
│ style.css (ALWAYS loaded)                  │
│ :root { --kimu-primary: #667eea; }         │  ← DEFAULT values
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ theme-dark.css (OPTIONAL, loaded by module)│
│ :root { --kimu-primary: #818cf8; }         │  ← OVERRIDES defaults
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ Components use variables                    │
│ button { background: var(--kimu-primary); }│  ← Uses active value
└─────────────────────────────────────────────┘
\`\`\`

### Benefits

✅ **App works without theme module** - defaults provide basic styling
✅ **No breaking changes** - removing theme module doesn't break the app
✅ **Gradual adoption** - themes can be added later
✅ **Consistent API** - components always use same CSS variables

### CSS Variable Priority

When theme module is active:
\`\`\`
Theme CSS values > Default style.css values > Browser defaults
\`\`\`

When theme module is NOT installed:
\`\`\`
Default style.css values > Browser defaults
\`\`\`

## Theme Configuration File

### Structure

The theme module uses a JSON configuration file (`themes-config.json`) to define available themes:

```json
{
  "themes": [
    {
      "name": "light",
      "mode": "light",
      "cssPath": "theme-light.css",
      "description": "Clean and bright theme"
    },
    {
      "name": "dark",
      "mode": "dark",
      "cssPath": "theme-dark.css",
      "description": "Dark theme for low-light environments"
    }
  ],
  "defaultTheme": "light"
}
```

### Adding New Themes

To add a new theme, simply:

1. Create the CSS file in `src/modules/theme/themes/` (e.g., `theme-nord.css`)
2. Add entry to `src/modules/theme/themes-config.json`:

```json
{
  "name": "nord",
  "mode": "dark",
  "cssPath": "theme-nord.css",
  "description": "Cold and relaxing Nordic theme"
}
```

3. Run `npm run build` to copy themes to `public/themes/` (via pre-build script)
4. The pre-build script automatically copies all CSS files from `src/modules/theme/themes/` to `public/themes/`

**Benefits of configuration file:**
- ✅ No code changes needed to add themes
- ✅ Easy to maintain and extend
- ✅ Clear separation of configuration and logic
- ✅ Can be easily customized per deployment

### Theme Configuration Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | ✅ | Unique theme identifier (used in `setMode()`) |
| `mode` | 'light' \| 'dark' | ✅ | Base mode for system preference detection |
| `cssPath` | string | ✅ | CSS file name in `public/themes/` folder |
| `description` | string | ❌ | Human-readable theme description |

## License

This module is part of KIMU-Core and is licensed under the Mozilla Public License 2.0 (MPL-2.0).
