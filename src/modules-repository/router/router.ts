// Kimu Router Module
// Provides routing service and configuration for kimu-core extensions and core
// Author: UnicoVerso
//
// Usage: Import KimuRouterService and configure routes in your app or extension.

// Router module options (extensible for future features)
import { KimuModuleOptions } from '../../core/kimu-types';

/**
 * RouteConfig defines a single route mapping for the router.
 * - path: URL path to match
 * - component: KimuComponentElement to render
 * - name: Optional route name
 * - meta: Optional metadata for custom usage
 */
export interface RouteConfig {
  path: string;
  component: any; // Should extend KimuComponentElement
  name?: string;
  meta?: Record<string, any>;
}

/**
 * Options for initializing the router module.
 * - routes: Array of RouteConfig for initial setup
 */
export interface KimuRouterModuleOptions extends KimuModuleOptions {
  routes?: RouteConfig[];
}

/**
 * Callback type for route change events.
 * - route: The matched RouteConfig
 * - params: Optional route parameters (future extension)
 */
export type RouteChangeCallback = (route: RouteConfig, params?: Record<string, string>) => void;

/**
 * KimuRouterService provides SPA-like routing for KIMU extensions/components.
 * Use getInstance() for singleton access.
 */
export class KimuRouterService {
  /** Singleton instance */
  private static instance: KimuRouterService;
  /** Registered routes */
  private routes: RouteConfig[] = [];
  /** Currently active route */
  private currentRoute: RouteConfig | null = null;
  /** Listeners for route change events */
  private listeners: RouteChangeCallback[] = [];

  /**
   * Private constructor. Sets up popstate listener for browser navigation.
   */
  private constructor() {
    window.addEventListener('popstate', this.handlePopState.bind(this));
  }

  /**
   * Returns the singleton instance of the router service.
   */
  public static getInstance(): KimuRouterService {
    if (!KimuRouterService.instance) {
      KimuRouterService.instance = new KimuRouterService();
    }
    return KimuRouterService.instance;
  }

  /**
   * Configure the router with a set of routes.
   * @param routes Array of RouteConfig
   */
  public configure(routes: RouteConfig[]): void {
    this.routes = routes;
  }

  /**
   * Register a new route at runtime.
   * @param route RouteConfig to add
   */
  public registerRoute(route: RouteConfig): void {
    this.routes.push(route);
  }

  /**
   * Navigate to a given path, updating browser history and resolving route.
   * @param path URL path to navigate to
   */
  public navigate(path: string): void {
    history.pushState({}, '', path);
    this.resolveRoute(path);
  }

  /**
   * Get the currently active route.
   */
  public getCurrentRoute(): RouteConfig | null {
    return this.currentRoute;
  }

  /**
   * Register a callback for route change events.
   * @param callback Function to call on route change
   */
  public onRouteChange(callback: RouteChangeCallback): void {
    this.listeners.push(callback);
  }

  /**
   * Handles browser back/forward navigation.
   */
  private handlePopState(): void {
    this.resolveRoute(window.location.pathname);
  }

  /**
   * Resolves the route for a given path and notifies listeners.
   * @param path URL path to resolve
   */
  private resolveRoute(path: string): void {
    const match = this.routes.find(r => r.path === path);
    this.currentRoute = match || null;
    this.listeners.forEach(cb => cb(this.currentRoute!, this.extractParams(path)));
  }

  /**
   * Extracts route parameters from the path (future extension).
   * @param _path URL path
   * @returns Object with route params (currently empty)
   */
  private extractParams(_path: string): Record<string, string> {
    // Basic implementation, extend for dynamic params
    return {};
  }
}

// Example usage (in app or extension):
// const router = KimuRouterService.getInstance();
// router.configure([
//   { path: '/', component: HomeComponent },
//   { path: '/about', component: AboutComponent },
// ]);
// router.onRouteChange((route) => { ... });
