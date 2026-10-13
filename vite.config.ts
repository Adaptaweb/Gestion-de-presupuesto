import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// Identifica cada build. El aviso de nueva version lo compara con /version.json,
// sin depender de que el navegador detecte el cambio del service worker.
const BUILD_ID = String(Date.now());

export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  plugins: [
    {
      name: 'kk-version-json',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ id: BUILD_ID }) });
      },
    },
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'prompt',
      includeAssets: [
        'kuentasklaras-logo.svg',
        'icons/*.png',
      ],
      manifest: {
        name: 'Kuentas Klaras',
        short_name: 'Kuentas Klaras',
        description: 'Tus finanzas claras, bajo control',
        lang: 'es',
        theme_color: '#2DBC8B',
        background_color: '#2DBC8B',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-180x180.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-196x196.png',
            sizes: '196x196',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-192x192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icons/icon-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      // Con injectManifest el bloque `workbox` se ignora: los patrones van aqui.
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2,woff,ttf}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
