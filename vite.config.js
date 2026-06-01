import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import viteCompression from 'vite-plugin-compression'

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Enable React Fast Refresh for better DX
      fastRefresh: true
    }),
    tailwindcss(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'PitchCraft AI',
        short_name: 'PitchCraft',
        description: 'Transform your innovative ideas into compelling startup pitches with the power of artificial intelligence.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],

  // Static file serving configuration
  publicDir: 'public',
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp'],

  // Development server configuration
  server: {
    host: 'localhost',
    port: process.env.PORT || 3000,
    open: true,
    strictPort: false,
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
    hmr: {
      timeout: 60000,
      overlay: true,
      port: process.env.HMR_PORT || 24678
    },
    watch: {
      usePolling: true,
      interval: 100
    },
    fs: {
      strict: true,
      allow: ['..']
    }
  },

  // Production build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,

    // Minification settings
    minify: 'esbuild',
    target: 'es2020',

    // CSS optimization
    cssMinify: true,
    cssCodeSplit: true,

    // Enhanced code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React dependencies
          'vendor-react': ['react', 'react-dom'],
          // Animation library
          'vendor-motion': ['framer-motion'],
          // Backend service
          'vendor-supabase': ['@supabase/supabase-js'],
          // PDF generation
          'vendor-pdf': ['jspdf', 'html2canvas'],
          // PowerPoint generation
          'vendor-pptx': ['pptxgenjs'],
          // Syntax highlighting
          'vendor-highlight': ['react-syntax-highlighter'],
          // WebGL / Graphics
          'vendor-ogl': ['ogl']
        },
        // Asset naming for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/css/i.test(ext)) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },

    // Chunk size warning
    chunkSizeWarningLimit: 800,

    // Source maps only in development
    sourcemap: mode === 'development',

    // Report compressed size
    reportCompressedSize: true,

    // Asset inlining threshold (4kb)
    assetsInlineLimit: 4096
  },

  // Preview server configuration
  preview: {
    port: 3000,
    strictPort: false,
    open: true
  },

  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      '@supabase/supabase-js'
    ],
    exclude: [],
    force: false
  },

  // Environment variables
  define: {
    __DEV__: JSON.stringify(mode === 'development'),
    __PROD__: JSON.stringify(mode === 'production'),
    __API_TIMEOUT__: JSON.stringify(30000),
    __MAX_RETRIES__: JSON.stringify(3)
  },

  // Base path for deployment
  base: '/',

  // Resolve aliases for cleaner imports
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@assets': '/src/assets',
      '@lib': '/src/lib',
      '@utils': '/src/utils'
    }
  },

  // esbuild configuration for production
  esbuild: {
    // Drop console and debugger in production
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    // Legal comments handling
    legalComments: 'none'
  }
}))