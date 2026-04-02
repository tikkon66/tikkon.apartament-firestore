import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 1. Импортируем path

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/tikkon.apartament-firestore/', // Оставляем ваш путь для GitHub Pages
  resolve: {
    alias: {
      // 2. Настраиваем алиас '@' для папки 'src'
      '@': path.resolve(__dirname, './src'),
    },
  },
})
