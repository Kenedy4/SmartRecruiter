import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Frontend server port
    proxy: {
      '/api': {
        target: 'http://localhost:5555', // Backend server
        changeOrigin: true, // Adjust the origin of the request to match the target
        secure: false, // Disable SSL verification if using https locally
        rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite '/api' prefix
      },
    },
  },
});