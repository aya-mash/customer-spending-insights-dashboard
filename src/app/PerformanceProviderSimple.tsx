import React, { Suspense } from 'react';
import { trackBundlePerformance } from '../utils/performance';

// Initialize performance tracking
trackBundlePerformance();

interface AppPerformanceProviderProps {
  children: React.ReactNode;
}

export const AppPerformanceProvider: React.FC<AppPerformanceProviderProps> = ({ children }) => {
  return (
    <Suspense fallback={<div className="loading-skeleton">Loading...</div>}>
      {children}
    </Suspense>
  );
};