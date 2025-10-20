import { createElement } from 'react';

/**
 * Returns an accessible Suspense fallback element.
 * Adds aria-busy and a descriptive aria-label for route-specific context.
 */
export function makeLoadingFallback(label: string) {
  return createElement('div', { 'aria-busy': 'true', 'aria-label': label }, 'Loading...');
}

/** Convenience for overview route */
export const overviewLoadingFallback = makeLoadingFallback('Loading overview data');