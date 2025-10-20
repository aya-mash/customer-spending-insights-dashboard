# Architecture Documentation

## System Overview

The Customer Spending Insights Dashboard follows a modular, feature-driven architecture designed for scalability, performance, and maintainability.

## Architecture Principles

### 1. Feature-Driven Structure
```
src/
├── app/              # Application shell and routing
├── components/       # Shared UI components
├── features/         # Feature-specific modules
│   ├── overview/     # Overview dashboard logic
│   ├── insights/     # Analytics and charts
│   └── transactions/ # Transaction management
├── data/             # Data layer (API, models, mocks)
├── styles/           # Design system and tokens
└── utils/            # Shared utilities
```

### 2. Component Hierarchy
- **App Shell**: Router, global providers, error boundaries
- **Layout Components**: Navigation, responsive containers
- **Feature Components**: Page-specific widgets and logic
- **UI Components**: Reusable, unstyled primitives
- **Chart Components**: Lazy-loaded visualization components

### 3. Data Flow
```
API Client ← → MSW Mocks
     ↓
Data Models (TypeScript)
     ↓
Feature Hooks (React Query/SWR pattern)
     ↓
Component State Management
     ↓
UI Components
```

## Key Design Patterns

### 1. Composition over Inheritance
```typescript
// Good: Composable components
<Card>
  <CardHeader>
    <CardTitle>Spending Overview</CardTitle>
  </CardHeader>
  <CardContent>
    <SpendingChart data={data} />
  </CardContent>
</Card>

// Avoid: Monolithic components
<SpendingOverviewCard data={data} />
```

### 2. Custom Hooks for Business Logic
```typescript
// Feature-specific hook
function useSpendingData(period: TimePeriod) {
  const { data, loading, error } = useQuery(['spending', period], 
    () => client.getSpendingSummary(period)
  );
  
  return useMemo(() => ({
    data: data ? transformSpendingData(data) : null,
    loading,
    error
  }), [data, loading, error]);
}
```

### 3. Token-Based Design System
```css
/* Design tokens */
:root {
  --color-primary-50: #f0f9ff;
  --color-primary-500: #3b82f6;
  --spacing-sp-4: 1rem;
  --elevation-1: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Component styles */
.card {
  background: var(--color-surface);
  padding: var(--spacing-sp-4);
  box-shadow: var(--elevation-1);
  border-radius: var(--radius-md);
}
```

## Performance Architecture

### 1. Code Splitting Strategy
- **Route-level**: Each page is a separate chunk
- **Feature-level**: Heavy components lazy-loaded
- **Library-level**: Charts separated from main bundle

### 2. Bundle Analysis
```
Main Bundle (310kB):
├── React/ReactDOM (45%)
├── Application Code (35%)
├── Utilities/Hooks (15%)
└── Styles/Tokens (5%)

Lazy Chunks:
├── DonutChart.js (26kB)
├── TrendsChart.js (41kB)
└── CategoricalChart.js (267kB)
```

### 3. Performance Monitoring
- **Core Web Vitals**: LCP, CLS, FID tracking
- **Bundle Size**: Automated size regression detection
- **Memory Usage**: Heap growth monitoring
- **Render Performance**: Frame time tracking

## State Management

### 1. Local State Pattern
```typescript
// Feature-specific state
function TransactionFilters() {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    dateRange: 'last-30-days'
  });
  
  const debouncedFilters = useDebounce(filters, 300);
  
  // Share via context if needed by siblings
  return (
    <FilterContext.Provider value={{ filters: debouncedFilters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}
```

### 2. URL State for Persistence
```typescript
// Sync filter state with URL
function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filters = useMemo(() => ({
    category: searchParams.get('category') || 'all',
    period: searchParams.get('period') || 'last-30-days'
  }), [searchParams]);
  
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setSearchParams(prev => {
      const updated = new URLSearchParams(prev);
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) updated.set(key, value);
        else updated.delete(key);
      });
      return updated;
    });
  }, [setSearchParams]);
  
  return { filters, updateFilters };
}
```

## Error Handling Strategy

### 1. Error Boundaries
```typescript
// Route-level error boundary
function RouteErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<ErrorFallback />}
      onError={(error, errorInfo) => {
        console.error('Route Error:', error, errorInfo);
        // Send to error tracking service
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### 2. API Error Handling
```typescript
// Centralized error handling
export class ApiClient {
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.request<T>(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.data?.message || 'Request failed',
          error.response?.status || 500,
          error.config?.url || 'unknown'
        );
      }
      throw error;
    }
  }
}
```

## Testing Architecture

### 1. Testing Pyramid
```
E2E Tests (10%)
├── Critical user journeys
├── Cross-browser compatibility
└── Performance validation

Integration Tests (30%)
├── Feature workflows
├── API integration
└── Component interaction

Unit Tests (60%)
├── Component behavior
├── Utility functions
└── Business logic
```

### 2. Test Organization
```
src/
├── __tests__/           # Unit tests
├── features/*/tests/    # Feature integration tests
└── tests/e2e/          # End-to-end tests
```

## Security Considerations

### 1. Content Security Policy
```javascript
// Recommended CSP headers
{
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.example.com"
  ].join("; ")
}
```

### 2. Input Validation
```typescript
// API input validation
const TransactionFiltersSchema = z.object({
  category: z.string().max(50),
  startDate: z.date(),
  endDate: z.date(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional()
});

export function validateFilters(input: unknown): TransactionFilters {
  return TransactionFiltersSchema.parse(input);
}
```

## Deployment Architecture

### 1. Build Process
```bash
# Type checking
tsc --noEmit

# Bundle optimization
vite build --mode production

# Asset optimization
# - Tree shaking: Remove unused code
# - Code splitting: Separate chunks
# - Compression: Gzip/Brotli
```

### 2. Docker Strategy
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM nginx:alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

## Monitoring & Observability

### 1. Performance Metrics
- **Bundle Size**: Track regression in CI/CD
- **Core Web Vitals**: Real user monitoring
- **Error Rates**: Client-side error tracking
- **API Performance**: Response time monitoring

### 2. Analytics
```typescript
// Performance tracking
export function trackPerformance() {
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'paint') {
        analytics.track('performance.paint', {
          metric: entry.name,
          value: entry.startTime
        });
      }
    });
  }).observe({ entryTypes: ['paint', 'navigation'] });
}
```

## Scalability Considerations

### 1. Component Library
- Prepare for extraction to separate package
- Document component APIs and patterns
- Maintain consistent design token usage

### 2. Feature Modularity
- Each feature should be self-contained
- Clear API boundaries between features
- Shared utilities in dedicated modules

### 3. Performance Budgets
- **Main Bundle**: < 350kB gzipped
- **Route Chunks**: < 50kB gzipped
- **Chart Chunks**: < 300kB gzipped
- **LCP**: < 2.5s on 3G connection