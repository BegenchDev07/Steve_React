import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import Sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression(),
    nodePolyfills(),
    Sitemap({
      outDir: '../keanu-web-scf/client/build',
      hostname: 'https://www.gamehub.cloud'
    }),
    viteStaticCopy({
      targets: [
        // {
        //   src: 'out.js',
        //   dest: '/engine/src/out.js'
        // }
      ]
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    outDir: '../keanu-web-scf/client/build'
  }
})
