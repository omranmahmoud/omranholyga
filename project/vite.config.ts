import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
