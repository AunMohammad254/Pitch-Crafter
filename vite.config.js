import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  // Static file serving configuration
  publicDir: 'public',
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp'],
  server: {
    host: 'localhost',
    port: process.env.PORT || 3000,
    open: true, // Automatically open browser
    strictPort: false, // Allow fallback to next available port
    // Enhanced CORS configuration
    cors: {
      origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://generativelanguage.googleapis.com'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-goog-api-key']
    },
    // Enhanced HMR and automatic reloading settings
    hmr: {
      timeout: 60000,
      overlay: true,
      port: process.env.HMR_PORT || 24678
    },
    // Watch options for better file change detection
    watch: {
      usePolling: true,
      interval: 100
    },
    // Middleware for better error handling and logging
    middlewareMode: false,
    fs: {
      strict: true,
      allow: ['..']
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Enhanced build optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'styled-components'],
          supabase: ['@supabase/supabase-js']
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for better debugging
    sourcemap: true
  },
  // Enhanced network and performance settings
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', '@supabase/supabase-js'],
    exclude: []
  },
  // Define environment variables for better API handling
  define: {
    __DEV__: JSON.stringify(true), // Default to development mode
    __API_TIMEOUT__: JSON.stringify(30000), // 30 seconds
    __MAX_RETRIES__: JSON.stringify(3)
  },
  base: './'
})