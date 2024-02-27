import path from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
})
