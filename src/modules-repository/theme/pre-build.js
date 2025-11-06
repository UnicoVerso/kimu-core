/**
 * Pre-Build Script for Theme Module
 * 
 * This script runs BEFORE the theme module is compiled.
 * It copies CSS theme files to public/themes/ so they're available
 * during development and will be included in the Vite build.
 * 
 * This approach keeps the module self-contained and independent.
 */
import fs from 'fs';
import path from 'path';

export default async function preBuild({ moduleDir, rootDir }) {
  const themesDir = path.join(moduleDir, 'themes');
  
  if (!fs.existsSync(themesDir)) {
    console.log('⚠️  No themes directory found, skipping theme copy');
    return;
  }

  const cssFiles = fs.readdirSync(themesDir).filter(f => f.endsWith('.css'));
  
  if (cssFiles.length === 0) {
    console.log('⚠️  No CSS files found in themes directory');
    return;
  }

  // Copy to public/themes/ (Vite will include them in build automatically)
  const publicThemesDir = path.join(rootDir, 'public', 'themes');
  fs.mkdirSync(publicThemesDir, { recursive: true });
  
  for (const cssFile of cssFiles) {
    fs.copyFileSync(
      path.join(themesDir, cssFile),
      path.join(publicThemesDir, cssFile)
    );
  }

  console.log(`📄 Theme module: Copied ${cssFiles.length} CSS files to public/themes/`);
}
