import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        tools: resolve(__dirname, 'tools.html'),
        playground: resolve(__dirname, 'playground.html'),
      },
    },
  },
});
