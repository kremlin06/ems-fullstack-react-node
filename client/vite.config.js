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
})