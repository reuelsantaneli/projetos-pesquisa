import { defineConfig } from 'vite'
export default defineConfig({
  root: '.',            // onde está seu index.html
  build: {
    outDir: 'dist'      // pasta de saída
  }
})