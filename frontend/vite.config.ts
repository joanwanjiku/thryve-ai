/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 5173 is what the backend's OAuth redirect URI and CORS default expect.
  server: { port: 5173, strictPort: true },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
