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
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'query-vendor': ['@tanstack/react-query'],
            'charts-vendor': ['recharts'],
          },
        },
      },
    },
  }
})
