import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // The key is "@" and the value is the absolute path to your `src` folder
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
