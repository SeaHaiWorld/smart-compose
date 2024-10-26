import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        content: 'src/main.ts', // 内容脚本入口
        popup: 'src/popup.ts'   // 弹出页面入口
      },
      output: {
        entryFileNames: '[name].js', // 保持文件名一致
        format: 'es',               // 使用 iife 格式
        inlineDynamicImports: false,
      },
    },
  },
});
