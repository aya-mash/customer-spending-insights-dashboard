import { useMemoryMonitor, usePerformanceObserver } from './performance';

// Bundle analysis utilities
export function logBundleStats() {
  if ('performance' in window && 'getEntriesByType' in performance && import.meta.env.DEV) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const jsResources = resources.filter(r => r.name.endsWith('.js'));
    const cssResources = resources.filter(r => r.name.endsWith('.css'));
    
    console.group('📊 Bundle Analysis');
    console.log('🚀 Navigation Timing:', {
      domContentLoaded: `${(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart).toFixed(2)}ms`,
      loadComplete: `${(navigation.loadEventEnd - navigation.loadEventStart).toFixed(2)}ms`,
      totalTime: `${(navigation.loadEventEnd - navigation.fetchStart).toFixed(2)}ms`
    });
    
    console.log('📦 JS Bundles:', jsResources.map(r => ({
      name: r.name.split('/').pop(),
      size: `${(r.transferSize / 1024).toFixed(2)}KB`,
      loadTime: `${r.duration.toFixed(2)}ms`
    })));
    
    console.log('🎨 CSS Resources:', cssResources.map(r => ({
      name: r.name.split('/').pop(),
      size: `${(r.transferSize / 1024).toFixed(2)}KB`,
      loadTime: `${r.duration.toFixed(2)}ms`
    })));
    console.groupEnd();
  }
}

export function calculateLighthouseScore() {
  return new Promise((resolve) => {
    if ('performance' in window) {
      const paint = performance.getEntriesByType('paint');
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
      const lcp = fcp; // Simplified - would need real LCP observer
      const cls = 0; // Would need layout shift observer
      const fid = 0; // Would need first input delay observer
      
      const score = {
        fcp: fcp < 1800 ? 100 : Math.max(0, 100 - ((fcp - 1800) / 100)),
        lcp: lcp < 2500 ? 100 : Math.max(0, 100 - ((lcp - 2500) / 100)),
        cls: cls < 0.1 ? 100 : Math.max(0, 100 - (cls * 1000)),
        fid: fid < 100 ? 100 : Math.max(0, 100 - fid),
        tti: navigation.domContentLoadedEventEnd < 3800 ? 100 : Math.max(0, 100 - ((navigation.domContentLoadedEventEnd - 3800) / 100))
      };
      
      const overallScore = Object.values(score).reduce((a, b) => a + b, 0) / Object.values(score).length;
      
      resolve({
        overall: Math.round(overallScore),
        details: score
      });
    } else {
      resolve({ overall: 0, details: {} });
    }
  });
}

// Memory leak detector
export class MemoryLeakDetector {
  private measurements: number[] = [];
  
  startMonitoring() {
    if ('memory' in performance) {
      const interval = setInterval(() => {
        const current = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory.usedJSHeapSize;
        this.measurements.push(current);
        
        // Check for memory growth pattern
        if (this.measurements.length > 10) {
          const recent = this.measurements.slice(-10);
          const growth = recent.every((val, i) => i === 0 || val > recent[i - 1]);
          
          if (growth && import.meta.env.DEV) {
            console.warn('🚨 Potential memory leak detected - consistent heap growth');
          }
          
          this.measurements = this.measurements.slice(-20); // Keep last 20 measurements
        }
      }, 10000);
      
      return () => clearInterval(interval);
    }
    
    return () => {}; // No-op if memory API not available
  }
  
  getMemoryReport() {
    if ('memory' in performance) {
      const current = (performance as unknown as { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      return {
        current: `${(current.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        total: `${(current.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        limit: `${(current.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
        usage: `${((current.usedJSHeapSize / current.jsHeapSizeLimit) * 100).toFixed(1)}%`
      };
    }
    return null;
  }
}

// Performance monitoring hook
export function usePerformanceTracking() {
  const memoryInfo = useMemoryMonitor();
  
  usePerformanceObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.entryType === 'measure' && import.meta.env.DEV) {
        console.log(`📏 Performance Measure: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
      }
    });
  });
  
  return { memoryInfo };
}