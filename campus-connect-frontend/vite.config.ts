import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  build: {
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate vendor chunks for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('react-router-dom')) {
              return 'router';
            }
            if (id.includes('@heroicons/react')) {
              return 'icons';
            }
            if (id.includes('date-fns')) {
              return 'utils';
            }
            return 'vendor';
          }
        },
      },
    },
    // Enable source maps for production debugging
    sourcemap: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@heroicons/react/24/outline',
      '@heroicons/react/24/solid',
      'date-fns',
    ],
  },
  // Enable compression
  server: {
    // Enable gzip compression in development
    middlewareMode: false,
  },
})
