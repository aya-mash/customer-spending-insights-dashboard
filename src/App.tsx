import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DashboardProvider } from './layouts/dashboard/DashboardProvider';
import { DashboardLayout } from './layouts/dashboard/DashboardLayout';
import { dashboardConfig } from './app/config/dashboard.config';
import { lazy, Suspense } from 'react';
const Overview = lazy(() => import('./pages/Overview').then(m => ({ default: m.default })));
const Transactions = lazy(() => import('./pages/Transactions').then(m => ({ default: m.default })));
const Insights = lazy(() => import('./pages/Insights').then(m => ({ default: m.default })));
const StyleGuide = lazy(() => import('./pages/StyleGuide').then(m => ({ default: m.default })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.default })));
import { ContrastCheckerDev } from './components/ContrastChecker/ContrastCheckerFab';
import { ErrorFallback } from './pages/ErrorFallback';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <DashboardProvider config={dashboardConfig}>
        <DashboardLayout>
        <Suspense fallback={<div aria-busy="true">Loading...</div>}>
          <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/style-guide" element={<StyleGuide />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ContrastCheckerDev />
        </DashboardLayout>
      </DashboardProvider>
    </ErrorBoundary>
  );
}

export default App;
