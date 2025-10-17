#!/usr/bin/env node

/**
 * KIMU Module Remover
 * 
 * Removes an installed module from modules folder
 * Usage: npm run remove:module <module-name>
 * Example: npm run remove:module router
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const MODULES_DIR = path.join(ROOT_DIR, 'src', 'modules');
const MANIFEST_PATH = path.join(MODULES_DIR, 'modules-manifest.json');

/**
 * Remove directory recursively
 */
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
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
 * Write installed modules manifest
 */
function writeInstalledManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
}

/**
 * Remove module
 */
function removeModule(moduleName) {
  console.log(`\n🗑️  Removing module: ${moduleName}...`);

  // Read installed manifest
  const installedManifest = readInstalledManifest();
  const moduleIndex = installedManifest.installedModules.findIndex(
    mod => mod.name === moduleName
  );

  if (moduleIndex === -1) {
    console.error(`❌ Error: Module '${moduleName}' is not installed.`);
    console.log(`\n   Currently installed modules:`);
    if (installedManifest.installedModules.length === 0) {
      console.log(`   (none)`);
    } else {
      installedManifest.installedModules.forEach(mod => {
        console.log(`   - ${mod.name} (v${mod.version})`);
      });
    }
    process.exit(1);
  }

  const moduleInfo = installedManifest.installedModules[moduleIndex];
  console.log(`   Version: ${moduleInfo.version}`);
  console.log(`   Installed at: ${moduleInfo.installedAt}`);

  // Remove module directory
  const modulePath = path.join(MODULES_DIR, moduleName);
  console.log(`   Removing: ${modulePath}`);

  try {
    removeDirectory(modulePath);
    console.log(`   ✓ Files removed successfully`);
  } catch (error) {
    console.error(`❌ Error removing module files:`, error.message);
    process.exit(1);
  }

  // Update installed manifest
  installedManifest.installedModules.splice(moduleIndex, 1);
  installedManifest.lastUpdate = new Date().toISOString();

  writeInstalledManifest(installedManifest);
  console.log(`   ✓ Manifest updated`);

  console.log(`\n✅ Module '${moduleName}' removed successfully!`);
  console.log(`   The module is still available in modules-repository.`);
  console.log(`   You can reinstall it with: npm run install:module ${moduleName}\n`);
}

/**
 * Main execution
 */
function main() {
  const moduleName = process.argv[2];

  if (!moduleName) {
    console.error('❌ Error: Module name is required.');
    console.log('\nUsage: npm run remove:module <module-name>');
    console.log('Example: npm run remove:module router\n');
    process.exit(1);
  }

  removeModule(moduleName);
}

main();
