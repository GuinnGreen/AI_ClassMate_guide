import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/guide/',
  server: {
    port: 3001,
    host: 'localhost',
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@guide': path.resolve(__dirname, '.'),
    },
  },
});
