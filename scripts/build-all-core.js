/**
 * This script compiles all core files located in "src/core" using esbuild.
 * The compiled output is saved in "dist/core/",
 * preserving the source folder structure.
 *
 * Features:
 * - Compiles all TypeScript files in "src/core".
 * - Compiles TypeScript to JavaScript (ESM format) with minification.
 * - Automatically fixes import paths by adding .js extensions.
 * - Logs success or failure for each file compilation.
 */
import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fixImportsInFiles } from './utils/fix-imports.js';

const SRC_DIR = 'src/core';
const DIST_DIR = 'dist/core';

// Ensure output directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Find all TypeScript files in the core directory
const tsFiles = fs.readdirSync(SRC_DIR)
  .filter(file => file.endsWith('.ts'))
  .map(file => path.join(SRC_DIR, file));

if (tsFiles.length === 0) {
  console.warn(`⚠️  No .ts files found in ${SRC_DIR}`);
  process.exit(0);
}

try {
  // Compile all TypeScript files individually
  const compiledFiles = [];
  
  for (const tsFile of tsFiles) {
    const fileName = path.basename(tsFile, '.ts');
    const outFile = path.join(DIST_DIR, `${fileName}.js`);
    
    await build({
      entryPoints: [tsFile],
      bundle: false, // Don't bundle, keep individual files
      minify: true,
      format: 'esm',
      outfile: outFile,
      platform: 'browser'
    });
    
    compiledFiles.push(outFile);
  }
  
  // Fix import paths in all compiled files
  const fixedCount = fixImportsInFiles(compiledFiles);
  
  console.log(`✅ Core files compiled: ${tsFiles.length} files → ${DIST_DIR}`);
  if (fixedCount > 0) {
    console.log(`🔧 Fixed imports in ${fixedCount} core files`);
  }
} catch (err) {
  console.error(`❌ Error compiling core files:`, err.message);
  process.exit(1);
}
