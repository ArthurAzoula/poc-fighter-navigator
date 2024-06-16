import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
      exclude: []
    })
  ],
  preview: {
    port: 8080,
    strictPort: true
  },
  server: {
    port: 8080,
    strictPort: true,
    host: true
  },
  define: {
    // global: {}
  },
  // resolve: {
  //   alias: {
  //     'events': 'rollup-plugin-node-polyfills/polyfills/events',
  //   }
  // }
})
