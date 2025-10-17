import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppLayout } from './layouts/AppLayout';
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
      <AppLayout>
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
      </AppLayout>
    </ErrorBoundary>
  );
}

export default App;
