#!/usr/bin/env node

/**
 * KIMU Module Lister
 * 
 * Lists available and installed modules
 * Usage: npm run list:modules
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const REPOSITORY_DIR = path.join(ROOT_DIR, 'src', 'modules-repository');
const MODULES_DIR = path.join(ROOT_DIR, 'src', 'modules');
const MANIFEST_PATH = path.join(MODULES_DIR, 'modules-manifest.json');

/**
 * Read module manifest from repository
 */
function readModuleManifest(moduleName) {
  const manifestPath = path.join(REPOSITORY_DIR, moduleName, 'manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

/**
 * Read installed modules manifest
 */
function readInstalledManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return {
      installedModules: [],
      availableModules: [],
      lastUpdate: new Date().toISOString()
    };
  }

  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

/**
 * List modules
 */
function listModules() {
  console.log(`\n📦 KIMU Modules Status\n`);

  // Read installed manifest
  const installedManifest = readInstalledManifest();
  const installedNames = installedManifest.installedModules.map(mod => mod.name);

  // List installed modules
  console.log(`✅ Installed Modules (${installedManifest.installedModules.length}):`);
  if (installedManifest.installedModules.length === 0) {
    console.log(`   (none)`);
  } else {
    installedManifest.installedModules.forEach(mod => {
      console.log(`   • ${mod.name} (v${mod.version}) - installed ${new Date(mod.installedAt).toLocaleDateString()}`);
    });
  }

  console.log();

  // List available modules in repository
  const availableModules = fs.readdirSync(REPOSITORY_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !installedNames.includes(name));

  console.log(`📚 Available Modules in Repository (${availableModules.length}):`);
  if (availableModules.length === 0) {
    console.log(`   (all modules are installed)`);
  } else {
    availableModules.forEach(moduleName => {
      const manifest = readModuleManifest(moduleName);
      if (manifest) {
        console.log(`   • ${moduleName} (v${manifest.version}) - ${manifest.description}`);
      } else {
        console.log(`   • ${moduleName} (no manifest)`);
      }
    });
  }

  console.log();

  // Show commands
  console.log(`Commands:`);
  console.log(`   Install:  npm run install:module <module-name>`);
  console.log(`   Remove:   npm run remove:module <module-name>`);
  console.log(`   List:     npm run list:modules`);
  console.log();
}

/**
 * Main execution
 */
function main() {
  listModules();
}

main();
