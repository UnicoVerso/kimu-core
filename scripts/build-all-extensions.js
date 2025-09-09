/**
 * This script compiles all extensions located in the "src/extensions" directory
 * using esbuild. Each extension is expected to have a "component.ts" entry file.
 * The compiled output is saved in the "dist/extensions" directory, maintaining
 * the folder structure of the source directory.
 *
 * Key functionalities:
 * - Reads all subdirectories in "src/extensions".
 * - Checks for the presence of "component.ts" in each subdirectory.
 * - Compiles the TypeScript files into JavaScript (ESM format) with minification.
 * - Automatically fixes import paths by adding .js extensions.
 * - Logs the success or failure of each compilation process.
 */

import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fixImportsInFile } from './utils/fix-imports.js';

// Starting paths
const SRC_DIR = 'src/extensions';
const DIST_DIR = 'dist/extensions';

// Read all subfolders inside src/extensions
const extensions = fs.readdirSync(SRC_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

for (const ext of extensions) {
  const entry = path.join(SRC_DIR, ext, 'component.ts');
  const outDir = path.join(DIST_DIR, ext);
  const outFile = path.join(outDir, 'component.js');

  if (!fs.existsSync(entry)) {
    console.warn(`⚠️  "${ext}" ignorata (component.ts non trovato)`);
    continue;
  }

  try {
    await build({
      entryPoints: [entry],
      bundle: true,
      minify: true,
      format: 'esm',
      outfile: outFile,
      platform: 'browser',
      external: [
        '../../core/*',
        '../../modules/*',
        '../../utils/*'
      ]
    });

    // Fix import paths in the compiled extension file
    const fixed = fixImportsInFile(outFile);

    console.log(`✅ Extension compiled "${ext}" to ${outFile}`);
    if (fixed) {
      console.log(`🔧 Fixed imports for extension "${ext}"`);
    }
  } catch (err) {
    console.error(`❌ Error compiling extension "${ext}":`, err.message);
  }
}
