import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    
    // Define additional environment variables if needed
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_ENV || mode),
    },
    
    // Server configuration for development
    server: {
      port: 5173,
      strictPort: false,
      open: true,
    },
    
    // Preview configuration
    preview: {
      port: 4173,
      strictPort: false,
    },
    
    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      // Increase chunk size warning limit since we're code-splitting
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Vendor chunks
            if (id.includes('node_modules')) {
              // React ecosystem
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'react-vendor';
              }
              // Charting library
              if (id.includes('recharts')) {
                return 'charts-vendor';
              }
              // React Query
              if (id.includes('@tanstack/react-query')) {
                return 'query-vendor';
              }
              // AWS Amplify
              if (id.includes('@aws-amplify') || id.includes('aws-amplify')) {
                return 'aws-vendor';
              }
              // MSW (Mock Service Worker) - separate chunk (only loaded in dev)
              if (id.includes('msw')) {
                return 'msw-vendor';
              }
              // i18next
              if (id.includes('i18next')) {
                return 'i18n-vendor';
              }
              // Date utilities
              if (id.includes('date-fns')) {
                return 'date-vendor';
              }
              // Lucide icons
              if (id.includes('lucide-react')) {
                return 'icons-vendor';
              }
              // Other node_modules
              return 'vendor';
            }
          },
        },
        // Tree-shake unused exports
        treeshake: {
          moduleSideEffects: 'no-external',
          preset: 'recommended',
        },
      },
    },
  }
})
