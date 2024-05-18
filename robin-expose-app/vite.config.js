import { fileURLToPath, URL } from 'node:url'
import { join } from 'node:path'
import { readFile } from 'node:fs'
import slash from 'slash'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'
import { run } from './scripts/expose'

const exposes = run()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'remote_app',
      filename: 'remoteEntry.js',
      exposes: exposes,
      shared: ['vue']
    })
  ],
  build: {
    target: "esnext",
    minify: false,
    polyfillModulePreload: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
