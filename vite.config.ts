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
    //
    // three.js and @react-three/* are DELIBERATELY NOT LISTED here so
    // Rollup keeps them inside the dynamic chunk that imports them
    // (the MarbleExplorer). Otherwise a static "vendor-react" chunk
    // would eagerly ship ~1 MB of 3D code on every page load.
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return;
          if (id.includes('/three/') || id.includes('@react-three')) return; // stays with lazy importer
          if (id.includes('gsap')) return 'vendor-gsap';
          if (id.includes('lucide-react')) return 'vendor-icons';
          if (id.includes('react-router')) return 'vendor-router';
          // Match only the react/react-dom packages themselves, not any
          // package that happens to have "react" in its name (e.g.
          // @react-three/fiber).
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'vendor-react';
        },
      },
    },
    // The pre-optimization chunk was ~665 kB; splitting drops it below the
    // default 500 kB warning threshold. The one exception is the MarbleExplorer
    // chunk which pulls in three.js — deliberately lazy-loaded on user click,
    // so a ~1 MB chunk that never runs on first paint is acceptable.
    chunkSizeWarningLimit: 1100,
  },
});
