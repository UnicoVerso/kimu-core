# Kimu I18n Module

Il modulo `i18n` di kimu-core fornisce un sistema di internazionalizzazione (internationalization) per applicazioni ed estensioni basate su kimu-core. Permette di gestire facilmente interfacce multilingua, traduzioni di stringhe e cambio dinamico della lingua.

## Scopo
- Abilitare la localizzazione di tutte le stringhe visibili all’utente.
- Gestire più lingue in modo centralizzato e modulare.
- Fornire API semplici per accedere alle traduzioni e cambiare lingua a runtime.

## Struttura del modulo
```
src/modules/i18n/
  ├── kimu-i18n-service.ts   # Servizio principale per traduzioni e gestione lingua
  ├── kimu-global-lang.ts    # Definizione delle lingue globali e risorse
  ├── module.ts              # Esportazione del modulo come KimuModule
  └── README.md              # Questa documentazione
```

## Come funziona
- Il servizio `KimuI18nService` gestisce la lingua corrente e fornisce il metodo `translate(key)` per ottenere la stringa tradotta.
- Le risorse delle lingue sono definite in oggetti o file separati (es. `en`, `it`, ecc.).
- È possibile cambiare lingua a runtime e aggiornare dinamicamente l’interfaccia.

## Utilizzo base
```typescript
import I18nModule from 'src/modules/i18n/module';

// Istanzia il modulo e imposta la lingua di default
const i18nModule = new I18nModule('i18n', '1.0.0', { lang: 'it' });
const i18n = i18nModule.getService();

// Traduci una chiave
console.log(i18n.translate('hello'));

// Cambia lingua
i18n.setLang('en');
```

## Integrazione in un’estensione
```typescript
// Nel componente
getData() {
  return {
    translate: this.i18n.translate,
    // ...altri dati
  };
}
// Nel template HTML: <span>${translate('welcome')}</span>
```

## Best practice
- Definisci tutte le stringhe utente tramite chiavi, mai testo hardcoded.
- Mantieni le risorse delle lingue aggiornate e documentate.
- Fornisci sempre l’inglese come fallback.
- Documenta come aggiungere nuove lingue.

## Vantaggi
- UI multilingua pronta all’uso.
- Cambi di lingua reattivi e centralizzati.
- Facilmente estendibile per nuove lingue o domini.

---
Autore: UnicoVerso
