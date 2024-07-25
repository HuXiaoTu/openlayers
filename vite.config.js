import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  // 设置别名
  resolve: {
    alias: {
      '@': path.resolve("./src"),
      '#': path.resolve("./public"),
    },
    // 配置可省略不写的文件后缀
    extensions: ['.vue', '.js', '.json', '.css']
  }
})
