# Kimu Router Module

Questo modulo fornisce un servizio di routing per kimu-core, permettendo la gestione delle rotte e la navigazione tra componenti/estensioni in base all'URL.

## Funzionalità
- Configurazione centralizzata delle rotte
- Navigazione tramite history API
- Callback sugli eventi di cambio rotta
- API per registrare nuove rotte dinamicamente

## Configurazione Post-Installazione

Dopo aver installato il modulo router, devi creare un file di configurazione delle rotte:

### 1. Crea il file di configurazione routes

Copia il file di esempio nella cartella config:
```bash
mkdir -p src/config/router
cp src/modules/router/router-config.ts.example src/config/router/router-config.ts
```

Oppure crea `src/config/router/router-config.ts` manualmente:

```typescript
import { RouteConfig } from '../../modules/router/router';

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: 'app-home',
    name: 'home',
    meta: { title: 'Home' }
  },
  {
    path: '/about',
    component: 'app-about',
    name: 'about',
    meta: { title: 'Chi Siamo' }
  },
  // Aggiungi le tue rotte qui...
];
```

### 2. Inizializza il router in main.ts

```typescript
import { KimuModuleManager } from './core/kimu-module-manager';
import RouterModule from './modules/router/module';
import { routes } from './config/router/router-config';

const moduleManager = KimuModuleManager.getInstance();

// Opzione 1: Passa le rotte durante l'inizializzazione
const routerModule = new RouterModule('router', '1.0.0', { routes });
await moduleManager.loadModule(routerModule);

// Opzione 2: Configura dopo l'inizializzazione
const router = moduleManager.getModule('router').getService();
router.configure(routes);
```

### 3. Naviga tra le rotte

```typescript
const router = moduleManager.getModule('router').getService();

// Naviga verso una rotta
router.navigate('/about');

// Ascolta i cambiamenti di rotta
router.onRouteChange((route) => {
  console.log('Rotta cambiata:', route.path);
  // Aggiorna UI, carica componenti, ecc.
});

// Ottieni la rotta corrente
const currentRoute = router.getCurrentRoute();
```

## Estensione
- Puoi estendere il sistema per supportare parametri dinamici, fallback, rotte nidificate, ecc.
- Le estensioni possono registrare le proprie rotte tramite `registerRoute`.

## Best practice
- Mantieni la configurazione delle rotte separata dalla logica di rendering.
- Documenta sempre le rotte principali e i parametri accettati.

---
Autore: UnicoVerso
