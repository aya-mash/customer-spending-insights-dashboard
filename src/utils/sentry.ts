import * as Sentry from '@sentry/react';
import { config } from '../config/env';
import type { ErrorInfo } from 'react';

/**
 * Initialize Sentry error tracking and performance monitoring
 * Only runs in production or when explicitly enabled
 */
export function initSentry(): void {
  // Only initialize in production or staging
  if (!config.isProduction && !config.isDevelopment) {
    return;
  }

  // Check if Sentry DSN is configured
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    console.warn('[Sentry] DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn,
    environment: config.env,
    
    // Performance Monitoring
    tracesSampleRate: config.isProduction ? 0.1 : 1.0, // 10% in prod, 100% in dev
    
    // Session Replay (optional)
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
    
    integrations: [
      Sentry.browserTracingIntegration({
        // Track navigation and page loads
        enableLongTask: true,
        enableInp: true,
      }),
      Sentry.replayIntegration({
        maskAllText: true, // Privacy: mask all text
        blockAllMedia: true, // Privacy: block all media
      }),
    ],
    
    // Filter out known non-critical errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'chrome-extension://',
      'moz-extension://',
      // Network errors that are expected
      'NetworkError',
      'Failed to fetch',
      // ResizeObserver (benign loop limit exceeded)
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
    ],
    
    // Normalize URLs (remove query params, hash)
    beforeSend(event) {
      // Add user context if available (Cognito user)
      if (event.user) {
        event.user = {
          ...event.user,
          ip_address: '{{auto}}', // Use Sentry's IP detection
        };
      }
      
      // Add custom context
      event.contexts = {
        ...event.contexts,
        app: {
          environment: config.env,
          version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        },
      };
      
      return event;
    },
    
    // Add breadcrumbs for better debugging
    beforeBreadcrumb(breadcrumb) {
      // Filter out noisy console logs in production
      if (breadcrumb.category === 'console' && config.isProduction) {
        return breadcrumb.level === 'error' ? breadcrumb : null;
      }
      return breadcrumb;
    },
  });

  console.log('[Sentry] Initialized for environment:', config.env);
}

/**
 * Capture an error manually
 */
export function captureError(error: Error, context?: Record<string, unknown>): void {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture a message (for logging important events)
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
  Sentry.captureMessage(message, level);
}

/**
 * Set user context for error tracking
 */
export function setUser(user: { id: string; email?: string; username?: string } | null): void {
  Sentry.setUser(user);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message: string, category: string, data?: Record<string, unknown>): void {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
}

/**
 * Start a Sentry transaction for performance monitoring
 * @deprecated Sentry v8 uses automatic instrumentation - manual transactions not needed
 */
export function startTransaction(name: string, op: string): void {
  // Sentry v8+ uses automatic instrumentation
  // This function is kept for backwards compatibility but does nothing
  console.debug('[Sentry] Transaction:', name, op);
}

/**
 * Error boundary callback for React error boundaries
 */
export function handleErrorBoundary(error: Error, errorInfo: ErrorInfo): void {
  Sentry.withScope((scope) => {
    scope.setContext('react', {
      componentStack: errorInfo.componentStack,
    });
    Sentry.captureException(error);
  });
}
