import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';
import fs from 'fs';
import path from 'path';

// Function to get base path from KIMU config or environment variable
function getBasePath(): string {
  try {
    // Try to read from generated KIMU config first
    const configPath = path.resolve('./src/config/kimu-build-config.ts');
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      const match = configContent.match(/"base-path":\s*"([^"]+)"/);
      if (match && match[1]) {
        console.log(`[VITE] 🔧 Using base path from KIMU config: ${match[1]}`);
        return match[1];
      }
    }
  } catch (error) {
    console.log('[VITE] ⚠️ Could not read KIMU config, falling back to environment variable');
  }
  
  // Fallback to environment variable or default
  const envBasePath = process.env.KIMU_BASE_PATH || '/';
  console.log(`[VITE] 🔧 Using base path from environment: ${envBasePath}`);
  return envBasePath;
}

const basePath = getBasePath();

export default defineConfig({
  root: 'src', // main folder of the project
  base: basePath, // build base URL from environment or default to '/'
  publicDir: '../public', // public folder for static files
  build: {
    minify: true, // enforce code minification (ESBuild - fast)
    // For maximum compression (minimal gain ~30 bytes):
    // 1. Install: npm install --save-dev terser
    // 2. Change to: minify: 'terser'
    // Trade-off: slower build time for marginal size reduction
    outDir: '../dist',
    emptyOutDir: true, // clear the destination folder before the build
    target: 'es2020', // modern JS for smaller bundles
    cssMinify: true, // minify CSS
    sourcemap: false, // remove sourcemap for prod
    reportCompressedSize: false, // speed up build
    rollupOptions: {  // rollup configuration options
      output: {
        manualChunks: {
          // Separate vendor from app code
          vendor: ['lit', 'idb']
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      },
      external: [
        // Mark external dependencies if possible
      ],
      treeshake: {
        moduleSideEffects: false, // enable aggressive tree shaking
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      },
      plugins: [
        copy({
          targets: [
            // ✅ Copy LICENSE file to the final build
            { src: 'LICENSE', dest: 'dist', },
            // ✅ Copy static assets (images, fonts, etc.) - CSS files are processed by Vite via HTML links
            { src: 'src/assets/*.{png,jpg,jpeg,svg,gif,webp,woff,woff2,ttf,eot,ico}', dest: 'dist', },
            // ✅ Copy core files to the final build (exclude .ts files)
            { src: 'src/core/**/*.{js,json}', dest: 'dist' },
            // ✅ Copy config files to the final build (exclude .ts files)
            { src: 'src/config/**/*.{js,json}', dest: 'dist' },
            // ✅ Copy all JS and JSON files of modules to the final build
            { src: 'src/modules/**/*.{js,json}', dest: 'dist' },
            // ✅ Copy HTML, CSS, and JS files of extensions to the final build
            { src: 'src/extensions/**/*.{html,css,js}', dest: 'dist', },
            // ✅ Static assets of extensions (icons, images, media, etc.)
            { src: 'src/extensions/**/assets/**/*', dest: 'dist' },
            // ✅ Useful resources of extensions (JSON, JS, properties, templates, etc.)
            { src: 'src/extensions/**/resources/**/*', dest: 'dist' },
            // ✅  Language files of extensions (translation files)
            { src: 'src/extensions/**/lang/**/*', dest: 'dist' },
            // ✅ Copy extensions-manifest.json to the final build
            { src: 'src/extensions/extensions-manifest.json', dest: 'dist' }
          ],
          verbose: true, // show all messages for copied files
          flatten: false, // keep folder structure
          hook: 'writeBundle' // copy files after the bundle is written
        })
      ]
    }
  },
  server: {
    host: true,       // enable access from the local network
    port: 5173        // default port for Vite
  },
});