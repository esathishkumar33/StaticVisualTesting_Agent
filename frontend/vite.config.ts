import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 5173,
    middlewareMode: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/health': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    middleware: [
      (req, res, next) => {
        // For all GET requests that aren't for files, serve index.html
        if (
          req.method === 'GET' &&
          !req.url.includes('.') &&
          !req.url.startsWith('/api') &&
          !req.url.startsWith('/health')
        ) {
          const indexHtml = path.join(__dirname, 'index.html')
          if (fs.existsSync(indexHtml)) {
            res.end(fs.readFileSync(indexHtml, 'utf-8'))
            return
          }
        }
        next()
      },
    ],
  },
  preview: {
    port: 5173,
  },
})
