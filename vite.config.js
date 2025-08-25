import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // 添加跨域代理配置
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // 后端API地址
        changeOrigin: true, // 允许跨域
        rewrite: (path) => path.replace(/^\/api/, '/api'), // 保持路径一致
        // 可选：调试用，打印代理日志
        logLevel: 'debug',
      },
    },
  },
})
