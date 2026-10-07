import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: parseInt(process.env.PORT || '3000'),
    host: true, // Listen on all local IPs
    open: false
  },
  preview: {
    port: parseInt(process.env.PORT || '5401'),
    host: true, // Listen on all local IPs
  }
});
