#!/usr/bin/env node

/**
 * KIMU Module Installer
 * 
 * Installs a module from modules-repository to modules folder
 * Usage: npm run install:module <module-name>
 * Example: npm run install:module router
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
 * Copy directory recursively
 */
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Read module manifest from repository
 */
function readModuleManifest(moduleName) {
  const manifestPath = path.join(REPOSITORY_DIR, moduleName, 'manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Module manifest not found: ${manifestPath}`);
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
 * Write installed modules manifest
 */
function writeInstalledManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
}

/**
 * Install module
 */
function installModule(moduleName) {
  console.log(`\n📦 Installing module: ${moduleName}...`);

  // Check if module exists in repository
  const moduleRepoPath = path.join(REPOSITORY_DIR, moduleName);
  if (!fs.existsSync(moduleRepoPath)) {
    console.error(`❌ Error: Module '${moduleName}' not found in repository.`);
    console.log(`   Available modules in repository:`);
    const availableModules = fs.readdirSync(REPOSITORY_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    availableModules.forEach(mod => console.log(`   - ${mod}`));
    process.exit(1);
  }

  // Read module manifest
  const moduleManifest = readModuleManifest(moduleName);
  console.log(`   Version: ${moduleManifest.version}`);
  console.log(`   Description: ${moduleManifest.description}`);

  // Check if already installed
  const installedManifest = readInstalledManifest();
  const alreadyInstalled = installedManifest.installedModules.find(
    mod => mod.name === moduleName
  );

  if (alreadyInstalled) {
    console.log(`⚠️  Module '${moduleName}' is already installed (v${alreadyInstalled.version}).`);
    console.log(`   To reinstall, first remove it with: npm run remove:module ${moduleName}`);
    process.exit(0);
  }

  // Copy module from repository to modules
  const moduleDestPath = path.join(MODULES_DIR, moduleName);
  console.log(`   Copying from: ${moduleRepoPath}`);
  console.log(`   Copying to: ${moduleDestPath}`);

  try {
    copyDirectory(moduleRepoPath, moduleDestPath);
    console.log(`   ✓ Files copied successfully`);
  } catch (error) {
    console.error(`❌ Error copying module files:`, error.message);
    process.exit(1);
  }

  // Update installed manifest
  installedManifest.installedModules.push({
    name: moduleName,
    version: moduleManifest.version,
    path: moduleName,
    installedAt: new Date().toISOString()
  });
  installedManifest.lastUpdate = new Date().toISOString();

  writeInstalledManifest(installedManifest);
  console.log(`   ✓ Manifest updated`);

  console.log(`\n✅ Module '${moduleName}' installed successfully!`);
  console.log(`   You can now import it in your code:`);
  console.log(`   import ${moduleManifest.name}Module from './modules/${moduleName}/module';`);
  console.log(`\n   Run 'npm run build' to include it in the production bundle.\n`);
}

/**
 * Main execution
 */
function main() {
  const moduleName = process.argv[2];

  if (!moduleName) {
    console.error('❌ Error: Module name is required.');
    console.log('\nUsage: npm run install:module <module-name>');
    console.log('Example: npm run install:module router\n');
    process.exit(1);
  }

  installModule(moduleName);
}

main();
