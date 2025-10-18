import { createBrowserRouter, createMemoryRouter } from 'react-router-dom';
import { Suspense, lazy, createElement, useState, useEffect, Fragment } from 'react';
import { DashboardLayout } from '../layouts/dashboard/DashboardLayout';
import { DashboardProvider } from '../layouts/dashboard/DashboardProvider';
import { dashboardConfig } from './config/dashboard.config';
import { ErrorFallback } from '../pages/ErrorFallback';

// Build route objects from dashboardConfig.routes converting lazy component factory to element
function wrapGuard(route: typeof dashboardConfig.routes[number]) {
  const LazyComp = lazy(route.component);
  const { canActivate, fallback } = route;
  // Provide an accessible, route-specific loading label so tests (and users with AT) can immediately identify loading state
  const loadingLabel = route.path === '/' ? 'Loading overview data' : 'Loading...';
  const fallbackEl = createElement('div', { 'aria-busy': 'true', 'aria-label': loadingLabel }, 'Loading...');
  if (!canActivate) {
    return createElement(Suspense, { fallback: fallbackEl }, createElement(LazyComp));
  }
  const result = canActivate();
  const isPromise = typeof (result as Promise<boolean>)?.then === 'function';
  if (isPromise) {
    const p = result as Promise<boolean>;
    const GuardWrapper: React.FC = () => {
      const [allowed, setAllowed] = useState<boolean | null>(null);
      useEffect(() => { p.then(v => setAllowed(v)).catch(() => setAllowed(false)); }, []);
      if (allowed === null) return createElement('div', { 'aria-busy': 'true', 'aria-label': `Checking access for ${route.path}` }, 'Checking access…');
      if (!allowed) return fallback ? createElement(Fragment, null, fallback) : null;
      return createElement(Suspense, { fallback: fallbackEl }, createElement(LazyComp));
    };
    return createElement(GuardWrapper);
  }
  if (result === false) return fallback ?? createElement('div', null, 'Access denied');
  return createElement(Suspense, { fallback: fallbackEl }, createElement(LazyComp));
}

export const childRoutes = dashboardConfig.routes.map(r => ({ path: r.path, element: wrapGuard(r) }));

export const router = createBrowserRouter([
  {
    path: '/',
  element: createElement(DashboardProvider, { config: dashboardConfig }, createElement(DashboardLayout)),
    errorElement: createElement(ErrorFallback),
    children: childRoutes,
  },
]);

// Test helper to build an in-memory router with initial entries.
export function buildTestRouter(initialEntries: string[] = ['/']) {
  return createMemoryRouter([
    {
      path: '/',
      element: createElement(DashboardProvider, { config: dashboardConfig }, createElement(DashboardLayout)),
      errorElement: createElement(ErrorFallback),
      children: childRoutes,
    },
  ], { initialEntries });
}

export default router;