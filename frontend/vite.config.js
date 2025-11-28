import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  base : '/',
  server : {
    proxy : {
      '/api' : {
        target : "http://localhost:5000",
        changeOrigin : true,
      },
      '/socket.io' : {
        target : "http://localhost:5000",
        ws : true,
      }
    },
  },
})
