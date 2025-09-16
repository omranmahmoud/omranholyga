import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Dev-only middleware to emulate Netlify /m SPA fallback behavior
    {
      name: 'dev-mobile-spa-fallback',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (!req.url || req.method !== 'GET') return next();
          const original = req.url;
          // Normalize bare /m (w/ or w/o trailing slash)
          if (original === '/m' || original === '/m/') {
            req.url = '/m/index.html';
            return next();
          }
          // For deep client-side routes under /m (e.g. /m/products/123)
          // If no file extension and not explicitly requesting index.html, rewrite to mobile entry.
          if (original.startsWith('/m/') && !/\.[a-zA-Z0-9]+$/.test(original) && !original.startsWith('/m/index.html')) {
            req.url = '/m/index.html';
            return next();
          }
          next();
        });
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // You can override API base via environment: define VITE_API_BASE in Netlify UI
  // and reference it in code: const api = import.meta.env.VITE_API_BASE || '/api';
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        mobile: path.resolve(__dirname, 'm/index.html')
      }
    }
  },
  server: {
    proxy: {
      '/api': 'https://omraneva.onrender.com',
    },
  },
})
