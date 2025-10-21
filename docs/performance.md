# Performance Guide

## Performance Standards

### Target Metrics
- **Lighthouse Performance**: ≥90
- **Lighthouse Accessibility**: ≥95
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): ≤2.5s
  - CLS (Cumulative Layout Shift): ≤0.1
  - FID (First Input Delay): ≤100ms

### Bundle Size Targets
- **Main Bundle**: ≤350kB gzipped
- **Route Chunks**: ≤50kB gzipped each
- **Chart Library**: ≤300kB gzipped
- **Total Initial Load**: ≤400kB gzipped

## Code Splitting Strategy

### 1. Route-Level Splitting
```typescript
// Lazy load route components
const routes = {
  Overview: lazy(() => import('../app/routes/OverviewRoute')),
  Insights: lazy(() => import('../app/routes/InsightsRoute')),
  Transactions: lazy(() => import('../pages/Transactions'))
};

// Wrap in Suspense with meaningful fallbacks
<Suspense fallback={<PageSkeleton />}>
  <Route path="/overview" element={<routes.Overview />} />
</Suspense>
```

### 2. Component-Level Splitting
```typescript
// Heavy chart components
const DonutChart = lazy(() => import('../components/DonutChart'));
const TrendsChart = lazy(() => import('../components/TrendsChart'));

// Use with loading states
function InsightsView() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <DonutChart data={categoryData} />
      <TrendsChart data={trendData} />
    </Suspense>
  );
}
```

### 3. Library-Level Splitting
```typescript
// Recharts is large - split by chart type
const DonutChart = lazy(() => 
  import('recharts').then(module => ({
    default: ({ data }) => (
      <module.PieChart>
        <module.Pie data={data} />
      </module.PieChart>
    )
  }))
);
```

## Performance Optimization Techniques

### 1. React Optimizations

#### Memoization
```typescript
// Memoize expensive calculations
const expensiveData = useMemo(() => {
  return transactions.reduce((acc, transaction) => {
    // Heavy computation
    return processTransaction(acc, transaction);
  }, initialValue);
}, [transactions]);

// Memoize callback functions
const handleFilterChange = useCallback((filters: FilterState) => {
  setFilters(filters);
}, []);

// Memoize components
const ExpensiveComponent = memo(({ data }) => {
  return <ComplexVisualization data={data} />;
}, (prevProps, nextProps) => {
  return prevProps.data.hash === nextProps.data.hash;
});
```

#### Debouncing and Throttling
```typescript
// Debounce search input
const debouncedSearchTerm = useDebounce(searchTerm, 300);

// Throttle scroll events
const throttledScrollHandler = useThrottle((event) => {
  handleScroll(event);
}, 16); // ~60fps
```

### 2. Virtual Scrolling
```typescript
// Large transaction lists
function VirtualizedTransactionList({ transactions }) {
  const containerHeight = 400;
  const itemHeight = 60;
  
  return (
    <VirtualizedList
      items={transactions}
      itemHeight={itemHeight}
      containerHeight={containerHeight}
      renderItem={(transaction, index) => (
        <TransactionRow key={transaction.id} transaction={transaction} />
      )}
    />
  );
}
```

### 3. Image Optimization

#### Lazy Loading
```typescript
// Intersection Observer-based lazy loading
function LazyImage({ src, alt, ...props }) {
  const { ref, isVisible } = useLazyLoad();
  const [loaded, setLoaded] = useState(false);
  
  return (
    <img
      ref={ref}
      src={isVisible ? src : placeholder}
      alt={alt}
      onLoad={() => setLoaded(true)}
      style={{
        opacity: loaded ? 1 : 0.6,
        transition: 'opacity 0.2s'
      }}
      {...props}
    />
  );
}
```

#### Responsive Images
```typescript
// Serve appropriate image sizes
function ResponsiveImage({ src, sizes, alt }) {
  const srcSet = [
    `${src}?w=320 320w`,
    `${src}?w=640 640w`,
    `${src}?w=1024 1024w`
  ].join(', ');
  
  return (
    <img
      src={`${src}?w=640`}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
    />
  );
}
```

## Bundle Analysis

### 1. Build Analysis
```bash
# Analyze bundle composition
npm run build -- --analyze

# Check bundle sizes
npm run bundle-analyzer

# Monitor size over time
npm run size-check
```

### 2. Performance Monitoring
```typescript
// Track bundle performance
export function trackBundlePerformance() {
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    const metrics = {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
    };
    
    console.log('Bundle Performance:', metrics);
    // Send to analytics
  });
}
```

## Memory Management

### 1. Memory Leak Prevention
```typescript
// Clean up event listeners
useEffect(() => {
  const handleResize = () => updateDimensions();
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

// Cancel network requests
useEffect(() => {
  const controller = new AbortController();
  
  fetchData({ signal: controller.signal })
    .then(setData)
    .catch(err => {
      if (!controller.signal.aborted) {
        setError(err);
      }
    });
    
  return () => controller.abort();
}, []);
```

### 2. Memory Monitoring
```typescript
// Monitor memory usage
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState(null);
  
  useEffect(() => {
    if ('memory' in performance) {
      const interval = setInterval(() => {
        setMemoryInfo(performance.memory);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, []);
  
  return memoryInfo;
}
```

## Network Optimization

### 1. API Optimization
```typescript
// Request deduplication
const requestCache = new Map();

export async function fetchWithCache(url: string, options = {}) {
  const cacheKey = `${url}${JSON.stringify(options)}`;
  
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey);
  }
  
  const promise = fetch(url, options).then(res => res.json());
  requestCache.set(cacheKey, promise);
  
  // Clean cache after request completes
  promise.finally(() => {
    setTimeout(() => requestCache.delete(cacheKey), 1000);
  });
  
  return promise;
}
```

### 2. Prefetching
```typescript
// Prefetch route data on hover
function NavigationLink({ to, children }) {
  const prefetchData = () => {
    // Prefetch route-specific data
    import(/* webpackChunkName: "[request]" */ `../routes/${to}Route`)
      .then(module => module.prefetchData?.());
  };
  
  return (
    <Link 
      to={to} 
      onMouseEnter={prefetchData}
      onFocus={prefetchData}
    >
      {children}
    </Link>
  );
}
```

## Performance Testing

### 1. Lighthouse CI
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Audit URLs using Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: '.lighthouserc.json'
          uploadArtifacts: true
```

### 2. Bundle Size Monitoring
```javascript
// .lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": ["http://localhost:3000/overview", "http://localhost:3000/insights"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    }
  }
}
```

### 3. Performance Budgets
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'charts': ['recharts'],
          'utils': ['date-fns', 'lodash']
        }
      }
    }
  },
  plugins: [
    bundleAnalyzer({
      analyzerMode: 'static',
      openAnalyzer: false,
      generateStatsFile: true
    })
  ]
});
```

## Core Web Vitals Optimization

### 1. Largest Contentful Paint (LCP)
```typescript
// Optimize main content loading
function MainContent() {
  return (
    <>
      {/* Critical above-the-fold content */}
      <PrimaryWidget />
      
      {/* Lazy load below-the-fold */}
      <Suspense fallback={<Skeleton />}>
        <SecondaryWidgets />
      </Suspense>
    </>
  );
}
```

### 2. Cumulative Layout Shift (CLS)
```css
/* Reserve space for dynamic content */
.chart-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skeleton {
  width: 100%;
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}
```

### 3. First Input Delay (FID)
```typescript
// Break up long tasks
function processLargeDataset(data) {
  return new Promise(resolve => {
    const chunks = chunkArray(data, 1000);
    let result = [];
    
    function processChunk(index) {
      if (index >= chunks.length) {
        resolve(result);
        return;
      }
      
      // Process chunk
      result = result.concat(processChunkSync(chunks[index]));
      
      // Yield to browser
      setTimeout(() => processChunk(index + 1), 0);
    }
    
    processChunk(0);
  });
}
```

## Performance Checklist

### Pre-deployment
- [ ] Bundle size analysis completed
- [ ] Lighthouse scores meet targets
- [ ] Core Web Vitals optimized
- [ ] Memory leaks tested
- [ ] Performance CI checks passing

### Monitoring
- [ ] Performance metrics dashboard
- [ ] Error tracking configured  
- [ ] Bundle size alerts set up
- [ ] User experience monitoring
- [ ] Regular performance audits scheduled