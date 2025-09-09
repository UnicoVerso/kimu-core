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
 * - Automatically fixes import paths by adding .js extensions.
 * - Logs success or failure for each module compilation.
 */
import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fixImportsInFile } from './utils/fix-imports.js';

const SRC_DIR = 'src/modules';
const DIST_DIR = 'dist/modules';

// Get all module subfolders in src/modules
const modules = fs.readdirSync(SRC_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

for (const mod of modules) {
  const moduleDir = path.join(SRC_DIR, mod);
  const outDir = path.join(DIST_DIR, mod);
  
  // Ensure output directory exists and is clean
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true });
  }
  fs.mkdirSync(outDir, { recursive: true });

  // Look for the main entry point (module.ts)
  const entryPoint = path.join(moduleDir, 'module.ts');
  
  if (!fs.existsSync(entryPoint)) {
    console.warn(`⚠️  Module "${mod}" skipped (module.ts not found)`);
    continue;
  }

  try {
    // Bundle the entire module into a single file
    await build({
      entryPoints: [entryPoint],
      bundle: true, // Bundle all dependencies into a single file
      minify: true,
      format: 'esm',
      outfile: path.join(outDir, 'module.js'),
      platform: 'browser',
      external: [
        // Keep external references to core framework parts
        '../../core/*',
        '../../config/*'
      ]
    });
    
    // Fix import paths in the bundled module file
    const outFile = path.join(outDir, 'module.js');
    const fixed = fixImportsInFile ? fixImportsInFile(outFile) : false;
    
    console.log(`✅ Module compiled: "${mod}" → ${outDir} (bundled)`);
    if (fixed) {
      console.log(`🔧 Fixed imports for module "${mod}"`);
    }
  } catch (err) {
    console.error(`❌ Error compiling module "${mod}":`, err.message);
  }
}
