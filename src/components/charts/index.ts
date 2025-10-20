import { lazy } from 'react';

// Lazy load chart libraries only when needed
export const DonutChart = lazy(() => import('./DonutChart.js'));
export const TrendsChart = lazy(() => import('./TrendsChart.js'));
export const SpendingChart = lazy(() => import('./SpendingChart.js'));