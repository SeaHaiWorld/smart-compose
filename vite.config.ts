import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        content: 'src/main.ts', // 指定主入口文件
      },
      output: {
        entryFileNames: '[name].js',
        format: 'iife', // 使用 iife 格式使其直接在浏览器中运行
      },
    },
  },
});
