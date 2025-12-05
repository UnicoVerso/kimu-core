/**
 * KIMU Core - Central Export File
 * 
 * This file exports all core KIMU framework classes, decorators, and utilities
 * for convenient importing in extensions and applications.
 */

// Core application classes
export { KimuApp } from './kimu-app';
export { KimuComponentElement } from './kimu-component-element';
export { KimuComponent } from './kimu-component';
export { KimuEngine } from './kimu-engine';
export { KimuRender } from './kimu-render';

// Extension and module management
export { KimuExtensionManager } from './kimu-extension-manager';
export { KimuModule } from './kimu-module';
export { KimuModuleManager } from './kimu-module-manager';

// Asset and style management
export { KimuAssetManager } from './kimu-asset-manager';
export { KimuGlobalStyles } from './kimu-global-styles';

// Configuration and storage
export { KimuPathConfig } from './kimu-path-config';
export { KimuStore } from './kimu-store';

// Reactive system - NEW!
export { 
  property,
  reactive,
  isReactive,
  toRaw,
  initReactiveProperties,
  getObservedAttributes,
  handleAttributeChange
} from './kimu-reactive';

// Type definitions
export type {
  KimuAsset,
  KimuGroupAsset,
  KimuLang,
  KimuExtensionLanguages,
  KimuExtensionMeta,
  KimuModuleOptions
} from './kimu-types';

// Reactive system types
export type { PropertyOptions } from './kimu-reactive';
