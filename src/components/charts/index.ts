import { lazy } from 'react';

// Lazy load chart libraries only when needed
export const DonutChart = lazy(() => import('./DonutChart'));
export const TrendsChart = lazy(() => import('./TrendsChart'));
export const SpendingChart = lazy(() => import('./SpendingChart'));