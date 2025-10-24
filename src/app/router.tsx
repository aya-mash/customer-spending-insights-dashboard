import { createBrowserRouter, createMemoryRouter } from 'react-router-dom';
import { Suspense, lazy, createElement, useState, useEffect, Fragment } from 'react';
import { DashboardProvider } from '../contexts/dashboard/DashboardProvider';
import { dashboardConfig } from './config/dashboard.config';
import { ErrorPage } from '../design-system/components/ErrorPage';
import { makeLoadingFallback, overviewLoadingFallback } from './loadingFallback';

// Lazy load DashboardLayout to ensure Amplify.configure() is called before AWS Amplify hooks are imported
const DashboardLayout = lazy(() => import('../layouts/dashboard/DashboardLayout').then(m => ({ default: m.DashboardLayout })));

// Build route objects from dashboardConfig.routes converting lazy component factory to element
function wrapGuard(route: typeof dashboardConfig.routes[number]) {
  const LazyComp = lazy(route.component);
  const { canActivate, fallback } = route;
  // Use LoadingSpinner for route loading states
  const fallbackEl = route.path === '/' ? overviewLoadingFallback : makeLoadingFallback('Loading');
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
      if (allowed === null) return makeLoadingFallback('Checking access');
      if (!allowed) return fallback ? createElement(Fragment, null, fallback) : null;
      return createElement(Suspense, { fallback: fallbackEl }, createElement(LazyComp));
    };
    return createElement(GuardWrapper);
  }
  if (result === false) return fallback ?? createElement('div', null, 'Access denied');
  return createElement(Suspense, { fallback: fallbackEl }, createElement(LazyComp));
}

// Singleton instance created lazily on first access
let _defaultRouter: ReturnType<typeof createBrowserRouter> | undefined;
let _childRoutes: Array<{ path: string; element: React.ReactNode }> | undefined;

function getChildRoutes() {
  _childRoutes ??= dashboardConfig.routes.map(r => ({ path: r.path, element: wrapGuard(r) }));
  return _childRoutes;
}

/**
 * Gets the default router instance, creating it lazily on first call.
 * This avoids circular dependency issues by deferring router creation
 * until the application actually mounts.
 * 
 * DO NOT call this at module level - only call from within component lifecycle.
 */
export function getDefaultRouter() {
  if (!_defaultRouter) {
    const childRoutes = getChildRoutes();
    const routerConfig = [
      {
        path: '/',
        element: createElement(
          DashboardProvider, 
          { config: dashboardConfig }, 
          createElement(Suspense, { fallback: makeLoadingFallback('Loading Dashboard') }, createElement(DashboardLayout))
        ),
        errorElement: createElement(ErrorPage),
        children: childRoutes,
      },
    ];
    _defaultRouter = createBrowserRouter(routerConfig);
  }
  return _defaultRouter;
}

export function buildTestRouter(initialEntries: string[] = ['/']) {
  const childRoutes = getChildRoutes();
  return createMemoryRouter([
    {
      path: '/',
      element: createElement(
        DashboardProvider, 
        { config: dashboardConfig }, 
        createElement(Suspense, { fallback: makeLoadingFallback('Loading Dashboard') }, createElement(DashboardLayout))
      ),
      errorElement: createElement(ErrorPage),
      children: childRoutes,
    },
  ], { initialEntries });
}