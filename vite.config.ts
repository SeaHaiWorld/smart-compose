import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/index.tsx',
      name: 'SmartCompose',
      fileName: (format) => `smart-compose.${format}.js`,
    },
    rollupOptions: {
      external: [], // 外部依赖
    },
  },
});
  