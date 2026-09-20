import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { FocusModeProvider } from './context/FocusModeContext';
import { GlobalErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Lazy Chunk Auto-Recovery: Catch stale Vite bundle chunk import failures & auto-reload safely
if (typeof window !== 'undefined') {
  const handleChunkLoadFailure = (reason?: string) => {
    try {
      const lastReload = sessionStorage.getItem('nihomi_chunk_reload_ts');
      const now = Date.now();
      // Guard against infinite reload loops by allowing at most 1 reload every 15 seconds
      if (!lastReload || now - parseInt(lastReload, 10) > 15000) {
        sessionStorage.setItem('nihomi_chunk_reload_ts', now.toString());
        console.warn('[Nihomi Chunk Recovery] Auto-refreshing stale dynamic bundle chunk:', reason);
        window.location.reload();
      }
    } catch {}
  };

  // Vite specific preload error event
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    handleChunkLoadFailure('vite:preloadError');
  });

  // Global script import failure detection
  window.addEventListener('error', (event) => {
    const msg = event?.message || '';
    if (
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Importing a module script failed') ||
      msg.includes('Loading chunk') ||
      msg.includes('dynamically imported module')
    ) {
      handleChunkLoadFailure(msg);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reasonMsg = event?.reason?.message || String(event?.reason || '');
    if (
      reasonMsg.includes('Failed to fetch dynamically imported module') ||
      reasonMsg.includes('Importing a module script failed') ||
      reasonMsg.includes('Loading chunk')
    ) {
      handleChunkLoadFailure(reasonMsg);
    }
  });
}

// Service Worker handling:
// In development mode, actively unregister any service workers and clear caches to prevent stale chunks
// and eliminate any possibility of duplicate React runtime instances.
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().catch(() => {});
      }
    }).catch(() => {});
    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const key of keys) {
          caches.delete(key).catch(() => {});
        }
      }).catch(() => {});
    }
  } else if (window.location.protocol === 'https:' && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('Nihomi SW registered successfully:', reg.scope);
        })
        .catch((err) => {
          console.warn('Nihomi SW registration skipped or failed:', err);
        });
    });
  }
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <GlobalErrorBoundary>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <FocusModeProvider>
                <App />
              </FocusModeProvider>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </GlobalErrorBoundary>
    </StrictMode>
  );
}
