import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    // Split large vendors into their own chunks so they stay cached across
    // page loads even when we ship an app-code update. Order matters —
    // more specific matches first, react last as a catch-all for the
    // remaining node_modules.
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('gsap')) return 'vendor-gsap';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('react-router')) return 'vendor-router';
            if (id.includes('react')) return 'vendor-react';
          }
        },
      },
    },
    // The pre-optimization chunk was ~665 kB; splitting drops it below the
    // default 500 kB warning threshold.
  },
});
