import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to your GitHub repo name, e.g. '/personal-page/'
// Update this when you know your repo name
export default defineConfig({
  plugins: [react()],
  base: '/personal-page/',
})
