import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 🔑 FIX: This enables the HTML History API fallback for client-side routing.
  // It tells the dev server to serve index.html for any path that doesn't 
  // match a file, preventing 404 errors on refresh.
  base: '/', 
})