/**
 * This script compiles all modules located in "src/modules" using esbuild.
 * Each module must have a "module.ts" entry file.
 * The compiled output is saved in "dist/modules/<module-name>/module.js",
 * preserving the source folder structure.
 *
 * Features:
 * - Scans all subdirectories in "src/modules".
 * - Checks for the presence of "module.ts" in each subdirectory.
 * - Compiles TypeScript to JavaScript (ESM format) with minification.
 * - Logs success or failure for each module compilation.
 */
import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

const SRC_DIR = 'src/modules';
const DIST_DIR = 'dist/modules';

// Get all module subfolders in src/modules
const modules = fs.readdirSync(SRC_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

for (const mod of modules) {
  const entry = path.join(SRC_DIR, mod, 'module.ts');
  const outDir = path.join(DIST_DIR, mod);
  const outFile = path.join(outDir, 'module.js');

  // Check if module.ts exists in the module folder
  if (!fs.existsSync(entry)) {
    console.warn(`⚠️  Module "${mod}" skipped (module.ts not found)`);
    continue;
  }

  try {
    await build({
      entryPoints: [entry],
      bundle: true,
      minify: true,
      format: 'esm',
      outfile: outFile,
      platform: 'browser'
    });
    console.log(`✅ Module compiled: "${mod}" → ${outFile}`);
  } catch (err) {
    console.error(`❌ Error compiling module "${mod}":`, err.message);
  }
}
