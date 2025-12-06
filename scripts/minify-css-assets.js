/**
 * This script minifies CSS files in the dist/assets folder after build.
 * It removes comments, whitespace, and optimizes the CSS for production.
 * 
 * Key functionalities:
 * - Reads all CSS files from dist/assets
 * - Minifies each CSS file by removing comments and excess whitespace
 * - Preserves the original file structure
 * - Logs the size reduction for each file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current script file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve the path to the dist/assets directory
const assetsPath = path.resolve(__dirname, '../dist/assets');

/**
 * Simple CSS minification function
 * - Removes comments
 * - Removes excess whitespace
 * - Compresses color codes
 */
function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace around selectors and declarations
    .replace(/\s*([{}:;,])\s*/g, '$1')
    // Remove leading/trailing whitespace
    .trim()
    // Remove empty rules
    .replace(/[^}]+\{\}/g, '')
    // Compress color codes (#ffffff -> #fff)
    .replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/gi, '#$1$2$3');
}

/**
 * Process all CSS files in the assets directory
 */
function minifyAssetsCSS() {
  if (!fs.existsSync(assetsPath)) {
    console.log('[KIMU] ⚠️ Assets directory not found, skipping CSS minification');
    return;
  }

  const files = fs.readdirSync(assetsPath);
  const cssFiles = files.filter(file => file.endsWith('.css'));

  if (cssFiles.length === 0) {
    console.log('[KIMU] ℹ️ No CSS files found in assets directory');
    return;
  }

  let totalSaved = 0;

  cssFiles.forEach(file => {
    const filePath = path.join(assetsPath, file);
    const originalContent = fs.readFileSync(filePath, 'utf-8');
    const originalSize = Buffer.byteLength(originalContent, 'utf-8');
    
    const minifiedContent = minifyCSS(originalContent);
    const minifiedSize = Buffer.byteLength(minifiedContent, 'utf-8');
    
    fs.writeFileSync(filePath, minifiedContent, 'utf-8');
    
    const saved = originalSize - minifiedSize;
    totalSaved += saved;
    
    const reduction = ((saved / originalSize) * 100).toFixed(1);
    console.log(`[KIMU] ✅ Minified ${file}: ${(originalSize/1024).toFixed(2)}KB → ${(minifiedSize/1024).toFixed(2)}KB (-${reduction}%)`);
  });

  console.log(`[KIMU] 🎉 Total CSS size reduction: ${(totalSaved/1024).toFixed(2)}KB`);
}

// Run the minification
minifyAssetsCSS();
