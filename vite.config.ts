
import { defineConfig } from 'vitest/config';
import path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      outDir: './dist/types',
      entryRoot: './src',
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'MarkdownItSanitizeHtml',
      fileName: (format) => {
        if (format === 'es') { return 'index.mjs'; }
        if (format === 'cjs') { return 'index.cjs'; }
        if (format === 'umd') { return 'index.umd.js'; }
        return `index.${format}.js`;
      },
      formats: ['es', 'cjs', 'umd', 'iife'],
    },
    minify: false,
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
