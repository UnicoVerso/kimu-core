# Kimu Router Module

Questo modulo fornisce un servizio di routing per kimu-core, permettendo la gestione delle rotte e la navigazione tra componenti/estensioni in base all'URL.

## Funzionalità
- Configurazione centralizzata delle rotte
- Navigazione tramite history API
- Callback sugli eventi di cambio rotta
- API per registrare nuove rotte dinamicamente

## Utilizzo

```typescript
import { KimuRouterService } from './src/modules/router/router';

const router = KimuRouterService.getInstance();
router.configure([
  { path: '/', component: HomeComponent },
  { path: '/about', component: AboutComponent },
]);

router.onRouteChange((route) => {
  // Logica per gestire il cambio rotta
});

// Per navigare
router.navigate('/about');
```

## Estensione
- Puoi estendere il sistema per supportare parametri dinamici, fallback, rotte nidificate, ecc.
- Le estensioni possono registrare le proprie rotte tramite `registerRoute`.

## Best practice
- Mantieni la configurazione delle rotte separata dalla logica di rendering.
- Documenta sempre le rotte principali e i parametri accettati.

---
Autore: UnicoVerso
