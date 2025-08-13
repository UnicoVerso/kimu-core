import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  root: 'src', // main folder of the project
  base: '/', // build base URL
  publicDir: '../public', // public folder for static files
  build: {
    minify: true, // enforce code minification
    outDir: '../dist',
    emptyOutDir: true, // clear the destination folder before the build
    rollupOptions: {  // rollup configuration options
      plugins: [
        copy({
          targets: [
            // ✅ Copy LICENSE file to the final build
            { src: 'LICENSE', dest: 'dist', },
            // ✅ Copy all asset files to the final build
            { src: 'src/assets/*.*', dest: 'dist', },
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