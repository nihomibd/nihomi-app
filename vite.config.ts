import path from 'path';
import { execSync } from 'child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

let commitHash = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || process.env.VITE_COMMIT_HASH || '';
if (!commitHash) {
  try {
    commitHash = execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    commitHash = 'f1371ed';
  }
}

const previewTelemetryFallback = () => ({
  name: 'preview-telemetry-fallback',
  configurePreviewServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      if (req.url && req.url.startsWith('/api/analytics/track')) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, preview: true }));
        return;
      }
      next();
    });
  }
});

export default defineConfig({
  define: {
    '__COMMIT_HASH__': JSON.stringify(commitHash),
    '__BUILD_DATE__': JSON.stringify(new Date().toISOString().split('T')[0])
  },
  plugins: [react(), tailwindcss(), previewTelemetryFallback()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    hmr: false,
    ws: false,
    allowedHosts: true,
    watch: {
      ignored: ['**/storage/**', '**/FOUNDER-OFFICE/**', '**/dist/**', '**/*.tmp*', '**/scratch_*/**', '**/node_modules/**']
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime']
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom/client'],
    alias: {
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
    }
  },
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('n5_master.json') || id.includes('n4_master.json') || id.includes('n3_master.json') || id.includes('n2_master.json') || id.includes('n1_master.json')) {
            return 'curriculum-master-data';
          }
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('lucide-react')) {
              return 'vendor-framework';
            }
          }
        }
      }
    }
  }
});
