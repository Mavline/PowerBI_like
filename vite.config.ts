
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    },
    watch: {
      usePolling: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    allowedHosts: [
      '*.replit.dev',
      '*.pike.replit.dev',
      '9a12a054-4196-44e8-af44-a703c4aebce3-00-u5wvyvfmz33h.pike.replit.dev'
    ]
  },
  preview: {
    host: '0.0.0.0',
    port: 5173
  }
})
