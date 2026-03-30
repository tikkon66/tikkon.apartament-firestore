import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Указываем название вашего репозитория между слэшами
  base: '/tikkon.apartament-firestore/', 
})
