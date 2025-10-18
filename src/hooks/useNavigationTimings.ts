import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function useNavigationTimings() {
  const loc = useLocation();
  const startRef = useRef<number>(performance.now());
  useEffect(() => {
    const now = performance.now();
    const duration = now - startRef.current;
    if (import.meta.env.DEV) {
      console.log(`[nav] Route '${loc.pathname}' rendered in ${duration.toFixed(1)}ms`);
    }
    startRef.current = performance.now();
  }, [loc]);
}