/**
 * This script compiles a single extension located in the "src/extensions" directory
 * using esbuild. The extension name must be provided as a command-line argument.
 * The compiled output is saved in the "dist/extensions" directory.
 *
 * Key functionalities:
 * - Validates the presence of the extension name argument.
 * - Checks for the existence of the "component.ts" entry file in the specified extension folder.
 * - Creates the output directory if it does not exist.
 * - Compiles the TypeScript file into JavaScript (ESM format) with minification.
 * - Logs the success or failure of the compilation process.
 *
 * Usage:
 *   node build-extension.js <extension-name>
 * Example:
 *   node build-extension.js hello
 */

import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

const ext = process.argv[2]; // e.g. hello

if (!ext) {
  console.error('❌ You must specify the extension name (e.g., hello)');
  process.exit(1);
}

const SRC_DIR = 'src/extensions';
const DIST_DIR = 'dist/extensions';

const entry = path.join(SRC_DIR, ext, 'component.ts');
const outDir = path.join(DIST_DIR, ext);
const outFile = path.join(outDir, 'component.js');

// Check if the entry file exists
if (!fs.existsSync(entry)) {
  console.error(`❌ Il file component.ts per "${ext}" non è stato trovato in ${entry}`);
  process.exit(1);
}

// Create the output directory if it does not exist
fs.mkdirSync(outDir, { recursive: true });

// Compilation
try {
  await build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    format: 'esm',
    outfile: outFile,
    platform: 'browser'
  });

  console.log(`✅ Extension compiled "${ext}" to ${outFile}`);
} catch (err) {
  console.error(`❌ Error during the compilation of extension "${ext}":`, err.message);
}
