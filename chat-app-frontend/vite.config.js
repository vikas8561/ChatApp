import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://chatapp-backend-x9hk.onrender.com', // your backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
