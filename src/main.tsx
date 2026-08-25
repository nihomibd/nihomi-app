import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { FocusModeProvider } from './context/FocusModeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Register Service Worker for offline resilience
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol === 'https:') {
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

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <FocusModeProvider>
                <App />
              </FocusModeProvider>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
