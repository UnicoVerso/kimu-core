// Kimu Router Module
// Provides routing service and configuration for kimu-core extensions and core
// Author: UnicoVerso
//
// Usage: Import KimuRouterService and configure routes in your app or extension.

import { KimuModuleOptions } from '../../core/kimu-types';

export interface KimuRouterModuleOptions extends KimuModuleOptions {
  // Esempio: routes di default
  routes?: Array<{
    path: string;
    component: any;
    name?: string;
    meta?: Record<string, any>;
  }>;
}

export interface RouteConfig {
  path: string;
  component: any; // Should extend KimuComponentElement
  name?: string;
  meta?: Record<string, any>;
}

export type RouteChangeCallback = (route: RouteConfig, params?: Record<string, string>) => void;

export class KimuRouterService {
  private static instance: KimuRouterService;
  private routes: RouteConfig[] = [];
  private currentRoute: RouteConfig | null = null;
  private listeners: RouteChangeCallback[] = [];

  private constructor() {
    window.addEventListener('popstate', this.handlePopState.bind(this));
  }

  public static getInstance(): KimuRouterService {
    if (!KimuRouterService.instance) {
      KimuRouterService.instance = new KimuRouterService();
    }
    return KimuRouterService.instance;
  }

  public configure(routes: RouteConfig[]): void {
    this.routes = routes;
  }

  public registerRoute(route: RouteConfig): void {
    this.routes.push(route);
  }

  public navigate(path: string): void {
    history.pushState({}, '', path);
    this.resolveRoute(path);
  }

  public getCurrentRoute(): RouteConfig | null {
    return this.currentRoute;
  }

  public onRouteChange(callback: RouteChangeCallback): void {
    this.listeners.push(callback);
  }

  private handlePopState(): void {
    this.resolveRoute(window.location.pathname);
  }

  private resolveRoute(path: string): void {
    const match = this.routes.find(r => r.path === path);
    this.currentRoute = match || null;
    this.listeners.forEach(cb => cb(this.currentRoute!, this.extractParams(path)));
  }

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
