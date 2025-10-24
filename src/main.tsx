import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import './styles/tokens.css';
import './styles/base.css';
import './i18n/config';
import App from './App';

// Configure Amplify FIRST before rendering app
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || '',
    },
  },
});
import { config } from './config/env';
import { logger } from './utils/logger';
import { initWebVitals } from './utils/webVitals';
import { initSentry } from './utils/sentry';
import { registerServiceWorker } from './utils/pwa';

// Initialize Sentry error tracking (production only)
initSentry();

// Register PWA service worker
registerServiceWorker();

// Enable MSW in development or when explicitly enabled
if (config.enableMocks) {
  try {
    const { worker } = await import('./mocks/browser.ts');
    await worker.start({ onUnhandledRequest: 'bypass' });
    logger.log('[MSW] Mock Service Worker started');
  } catch (error) {
    logger.warn('[MSW] Failed to start Service Worker:', error);
  }
}

// Initialize Web Vitals performance monitoring
initWebVitals();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
