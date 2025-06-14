import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/todoList/',
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
