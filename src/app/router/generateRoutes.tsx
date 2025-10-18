import React, { lazy, createElement, useState, useEffect, Fragment } from 'react';
import type { RouteConfig } from '../types/dashboard';
import type { RouteObject } from 'react-router-dom';

function wrapCanActivate(Component: React.ComponentType<unknown>, route: RouteConfig) {
  const { canActivate, fallback } = route;
  if (!canActivate) return createElement(Component);
  const result = canActivate();
  const isPromise = typeof (result as Promise<boolean>)?.then === 'function';
  if (isPromise) {
    const promise = result as Promise<boolean>;
    const GuardWrapper: React.FC = () => {
      const [allowed, setAllowed] = useState<boolean | null>(null);
  useEffect(() => { promise.then(v => setAllowed(v)).catch(() => setAllowed(false)); }, []);
      if (allowed === null) return <div aria-busy="true">Checking access…</div>;
      if (!allowed) return fallback ? <Fragment>{fallback}</Fragment> : null;
      return createElement(Component);
    };
    return createElement(GuardWrapper);
  }
  if (result === false) return fallback ? createElement(() => <Fragment>{fallback}</Fragment>) : createElement(() => null);
  return createElement(Component);
}

export function generateRoutes(configs: RouteConfig[]): RouteObject[] {
  return configs.map(rc => {
    const LazyComp = lazy(rc.component);
    return {
      path: rc.path,
      element: wrapCanActivate(LazyComp, rc),
    };
  });
}

export default generateRoutes;

// Helper to trigger prefetch for a given path using provided RouteConfig list.
export function prefetchRoute(path: string, configs: RouteConfig[]) {
  const cfg = configs.find(c => c.path === path);
  cfg?.prefetch?.();
}