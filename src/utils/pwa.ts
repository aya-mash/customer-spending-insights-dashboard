/**
 * PWA Service Worker Registration
 * Auto-updates service worker and handles updates
 */

export function registerServiceWorker(): void {
  // Skip registration in development or if service worker not supported
  if (
    import.meta.env.DEV ||
    !('serviceWorker' in navigator) ||
    import.meta.env.VITE_ENABLE_MOCKS === 'true'
  ) {
    console.log('[PWA] Skipping service worker registration');
    return;
  }

  // Register service worker in production
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration: ServiceWorkerRegistration) => {
      console.log('[PWA] Service Worker registered:', registration);

      // Check for updates every hour
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // 1 hour

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // New content available
              if (confirm('New content available! Reload to update?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                globalThis.location.reload();
              }
            }
          });
        }
      });

      showNotification('App ready to work offline!');
    })
    .catch((error: Error) => {
      console.error('[PWA] Service Worker registration failed:', error);
    });

  // Reload page when new service worker takes control
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      globalThis.location.reload();
    }
  });
}

function showNotification(message: string): void {
  // Simple notification (can be replaced with your toast/notification system)
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #667eea;
    color: white;
    padding: 16px 24px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: system-ui, sans-serif;
    font-size: 14px;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
