import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/components/features', import.meta.url)),
      '@public': fileURLToPath(new URL('./public', import.meta.url)),
      '@store': fileURLToPath(new URL('./src/store', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React y librerías principales
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Apollo Client (GraphQL)
          'apollo-vendor': ['@apollo/client', 'graphql'],
          
          // UI y otras librerías comunes
          'ui-vendor': ['lucide-react'],
        }
      }
    },
    chunkSizeWarningLimit: 500 // Opcional: para que no moleste el warning
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    css: true,
  },
})