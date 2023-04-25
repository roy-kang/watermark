import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      include: ['./lib'],
      outputDir: './types',
      skipDiagnostics: false
    })
  ],
  server: {
    port: 9997,
    host: '0.0.0.0'
  },
  build: {
    rollupOptions: {
      external: [
        'resize-observer-polyfill',
        'lodash-es'
      ]
    },
    lib: {
      entry: './lib/main.ts',
      name: 'Watermark',
      formats: ['es', 'umd'],
      fileName: format => `index.${format}.js`
    }
  }
})
