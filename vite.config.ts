import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// Reverting to standard Vite config for environment variables
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  // No custom 'define' needed; Vite handles VITE_ prefixed vars via import.meta.env by default
});
