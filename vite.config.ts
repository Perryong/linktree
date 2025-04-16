import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // Set your base path here:
  // If your project is served at https://<username>.github.io/linktree/
  // then the base should be "/linktree/".
  base: '/linktree/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
