import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// Intersection Observer hook for lazy loading
export function useLazyLoad<T extends HTMLElement>() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Debounce hook for performance
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for scroll/resize events
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
}

// Memoized selector hook
export function useMemoizedSelector<T, R>(
  value: T,
  selector: (value: T) => R
): R {
  return useMemo(() => selector(value), [value, selector]);
}

// Performance observer hook
export function usePerformanceObserver(
  onEntry: (entries: PerformanceEntry[]) => void,
  options?: PerformanceObserverInit
) {
  useEffect(() => {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      onEntry(list.getEntries());
    });

    try {
      observer.observe(options || { entryTypes: ['measure', 'navigation', 'paint'] });
    } catch {
      console.warn('Performance Observer not supported for this entry type');
    }

    return () => observer.disconnect();
  }, [onEntry, options]);
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

// Bundle size tracker
export function trackBundlePerformance() {
  if (typeof window === 'undefined') return;

  // Track initial bundle load
  window.addEventListener('load', () => {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const metrics = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
      };

      console.log('Bundle Performance Metrics:', metrics);
    }
  });
}

// Memory usage tracker
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<MemoryInfo | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if ('memory' in performance) {
        setMemoryInfo((performance as unknown as { memory: MemoryInfo }).memory);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}