import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import './i18n/config';
import App from './App';
import { config } from './config/env';

// Enable MSW in development or when explicitly enabled
if (config.enableMocks) {
  try {
    const { worker } = await import('./mocks/browser.ts');
    await worker.start({ onUnhandledRequest: 'bypass' });
    console.log('[MSW] Mock Service Worker started');
  } catch (error) {
    console.warn('[MSW] Failed to start Service Worker:', error);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
