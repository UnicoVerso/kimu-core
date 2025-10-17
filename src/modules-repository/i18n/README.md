# Kimu I18n Module

The `i18n` module in kimu-core provides an internationalization system for kimu-core-based applications and extensions. It allows you to easily manage multilingual interfaces, string translations, and dynamic language switching.

## Purpose
- Enable localization of all user-visible strings.
- Manage multiple languages in a centralized and modular way.
- Provide simple APIs to access translations and change language at runtime.

## Module Structure
```
src/modules/i18n/
  ├── kimu-i18n-service.ts   # Main service for translations and language management
  ├── kimu-global-lang.ts    # Definition of global languages and resources
  ├── module.ts              # Module export as KimuModule
  └── README.md              # This documentation
```

## How it works
- The `KimuI18nService` manages the current language and provides the `translate(key)` method to get the translated string.
- Language resources are defined in separate objects or files (e.g., `en`, `it`, etc.).
- You can change language at runtime and dynamically update the interface.

## Basic usage
```typescript
import I18nModule from 'src/modules/i18n/module';

// Instantiate the module and set the default language
const i18nModule = new I18nModule('i18n', '1.0.0', { lang: 'it' });
const i18n = i18nModule.getService();

// Translate a key
console.log(i18n.translate('hello'));

// Change language
i18n.setLang('en');
```

## Integration in an extension
```typescript
// In the component
getData() {
  return {
    translate: this.i18n.translate,
    // ...other data
  };
}
// In the HTML template: <span>${translate('welcome')}</span>
```

## Best practices
- Define all user strings using keys, never hardcoded text.
- Keep language resources updated and documented.
- Always provide English as a fallback.
- Document how to add new languages.

## Advantages
- Ready-to-use multilingual UI.
- Reactive and centralized language changes.
- Easily extendable for new languages or domains.

---
Author: UnicoVerso
