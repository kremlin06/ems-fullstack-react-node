import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'   
// import { dirname } from 'path'
import path from 'path'

const __filename = fileURLToPath(import.meta.url) // get file path
const __dirname = path.dirname(__filename) // get folder path

// we will then gonna use path.resolve() here, look inside alias object

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // '@styles': `${__dirname}/src/styles`,      change this
      '@components': path.resolve(__dirname, './src/components'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@services': path.resolve(__dirname, './src/services'),
      '@Shared': path.resolve(__dirname, './src/components/Dashboards/Shared'),
      '@SVGs': path.resolve(__dirname, './src/components/SVGs'),
    },
  },
  // recharts 3.x + Vite 8 (rolldown-vite) shipped with a Rolldown CJS-wrapper
  // naming collision that produced the runtime error:
  //   Uncaught TypeError: require_isUnsafeProperty is not a function
  // The fix was to downgrade to Vite 7 (classic Rollup), which does not have
  // the bug — so this config no longer needs custom optimizeDeps entries.
  // Pre-bundle warm-up for recharts is kept as a small dev-server speed-up.
  optimizeDeps: {
    include: ['recharts'],
  },
  // ── Production bundle splitting (NFR-06) ──────────────────────────────────
  // Route-level React.lazy() already splits each page into its own chunk.
  // manualChunks goes one step further: it pulls big, rarely-changing vendor
  // libraries into separate cacheable chunks so they are not re-downloaded on
  // every app deploy, and so heavy libs (recharts) never leak into the main
  // bundle that the login page must download.
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // react core — needed on first paint, but cached across deploys
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // recharts is large and only used by the lazy Analytics route
          'recharts': ['recharts'],
          // styling engine — shared by every page
          'styled': ['styled-components'],
        },
      },
    },
  },
  server: {
    port: 5173,

    proxy: {
      // Proxies all /api/* requests from the dev server to the backend.
      // This eliminates CORS issues entirely during development — the browser
      // never talks to localhost:5000 directly; Vite forwards the request.
      //
      // With this in place you can set VITE_API_URL='/api' in .env.development
      // instead of the full 'http://localhost:5000/api'.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // Passes cookies (refresh token) through the proxy correctly.
        secure: false,
      },
    },
  },
})