import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { config } from '../config/env';

export function useNavigationTimings() {
  const loc = useLocation();
  const startRef = useRef<number>(0);
  
  useEffect(() => {
    startRef.current = performance.now();
  }, []);
  
  useEffect(() => {
    const now = performance.now();
    const duration = now - startRef.current;
    if (config.isDevelopment) {
      console.log(`[nav] Route '${loc.pathname}' rendered in ${duration.toFixed(1)}ms`);
    }
    startRef.current = performance.now();
  }, [loc]);
}