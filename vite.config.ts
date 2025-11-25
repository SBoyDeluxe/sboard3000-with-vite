import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"/sboard3000-with-vite/",

  build:{
    outDir:"docs"
  }
  
})
