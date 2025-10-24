import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';
import { logger } from './logger';

/**
 * Web Vitals performance monitoring
 * 
 * Core Web Vitals:
 * - LCP (Largest Contentful Paint): < 2.5s (good), < 4s (needs improvement), >= 4s (poor)
 * - CLS (Cumulative Layout Shift): < 0.1 (good), < 0.25 (needs improvement), >= 0.25 (poor)
 * - INP (Interaction to Next Paint): < 200ms (good), < 500ms (needs improvement), >= 500ms (poor)
 * 
 * Other Vitals:
 * - FCP (First Contentful Paint): < 1.8s (good), < 3s (needs improvement), >= 3s (poor)
 * - TTFB (Time to First Byte): < 800ms (good), < 1800ms (needs improvement), >= 1800ms (poor)
 */

export interface VitalsReport {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

function getRating(metric: Metric): 'good' | 'needs-improvement' | 'poor' {
  const { name, value } = metric;
  
  switch (name) {
    case 'CLS':
      return value < 0.1 ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value < 1800 ? 'good' : value < 3000 ? 'needs-improvement' : 'poor';
    case 'LCP':
      return value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value < 800 ? 'good' : value < 1800 ? 'needs-improvement' : 'poor';
    case 'INP':
      return value < 200 ? 'good' : value < 500 ? 'needs-improvement' : 'poor';
    default:
      return 'good';
  }
}

function sendToAnalytics(metric: Metric): void {
  const report: VitalsReport = {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric),
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType
  };

  // Log in development
  if (import.meta.env.DEV) {
    const emoji = report.rating === 'good' ? '✅' : report.rating === 'needs-improvement' ? '⚠️' : '❌';
    logger.info(`${emoji} ${report.name}: ${Math.round(report.value)}ms (${report.rating})`);
  }

  // In production, send to your analytics service
  if (import.meta.env.PROD) {
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
      gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Example: Send to custom analytics endpoint
    // fetch('/api/analytics/vitals', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(report),
    // }).catch(() => {
    //   // Fail silently
    // });
  }
}

/**
 * Initialize Web Vitals monitoring
 * Call this once when your app starts
 */
export function initWebVitals(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Core Web Vitals
    onCLS(sendToAnalytics);
    onLCP(sendToAnalytics);
    onINP(sendToAnalytics);

    // Other important metrics
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);

    logger.info('Web Vitals monitoring initialized');
  } catch (error) {
    logger.error('Failed to initialize Web Vitals:', error);
  }
}

/**
 * Get performance metrics summary
 * Useful for displaying performance data in the app
 */
export function getPerformanceMetrics(): Record<string, number> {
  if (typeof window === 'undefined' || !window.performance) {
    return {};
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');

  return {
    // Navigation timing
    dns: navigation?.domainLookupEnd - navigation?.domainLookupStart,
    tcp: navigation?.connectEnd - navigation?.connectStart,
    ttfb: navigation?.responseStart - navigation?.requestStart,
    download: navigation?.responseEnd - navigation?.responseStart,
    domInteractive: navigation?.domInteractive,
    domComplete: navigation?.domComplete,
    loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,

    // Paint timing
    fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,

    // Memory (if available)
    ...(('memory' in performance) ? {
      usedJSHeapSize: (performance as unknown as { memory: { usedJSHeapSize: number } }).memory.usedJSHeapSize / 1048576, // MB
      totalJSHeapSize: (performance as unknown as { memory: { totalJSHeapSize: number } }).memory.totalJSHeapSize / 1048576, // MB
    } : {})
  };
}
