import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { dashboardConfig } from '../config/dashboard.config';
import { generateRoutes } from './generateRoutes';

export function AppRoutes() {
  const routeObjects = generateRoutes(dashboardConfig.routes);
  return (
    <Suspense fallback={<div aria-busy={true}>Loading...</div>}>
      <Routes>
        {routeObjects.map(ro => (
          <Route key={ro.path} path={ro.path} element={ro.element} />
        ))}
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;