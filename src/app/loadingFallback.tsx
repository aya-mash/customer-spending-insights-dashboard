import { LoadingSpinner } from '../design-system';

/**
 * Loading fallback for route transitions.
 * Shows LoadingSpinner while React route components are loading.
 */
export function makeLoadingFallback(label = 'Loading') {
  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100dvh',
        padding: '48px 24px'
      }}
    >
      <LoadingSpinner size="large" label={label} showLabel />
    </div>
  );
}

/** Convenience for overview route */
export const overviewLoadingFallback = makeLoadingFallback('Loading overview');