# ADR-0006: Observability - Sentry

**Status**: Accepted  
**Date**: 2024-11-20

## Context

Need error tracking and performance monitoring for production. Must integrate with React error boundaries and capture frontend-specific metrics (Web Vitals).

## Decision

Chosen **Sentry** over AWS CloudWatch RUM, LogRocket, and Datadog RUM.

## Rationale

**Why Sentry?**

- React integration with Error Boundary HOC
- Automatic source map upload for stack traces
- Performance monitoring (LCP, FID, CLS)
- Session replay with privacy controls
- Free tier: 5K errors/month, 10K transactions/month

**Alternatives Rejected**:

- **AWS CloudWatch RUM**: Less mature, no source maps, requires AWS setup
- **LogRocket**: Expensive ($99/mo), session replay focus (overkill)
- **Datadog RUM**: Enterprise pricing, heavier SDK

## Implementation

### Initialization

```typescript
// src/utils/sentry.ts
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: config.env,
  tracesSampleRate: config.isProduction ? 0.1 : 1.0, // 10% prod, 100% dev
  replaysSessionSampleRate: 0.1, // 10% sessions
  replaysOnErrorSampleRate: 1.0, // 100% error sessions
});
```

### Error Boundary

```typescript
// App.tsx
import { ErrorBoundary } from '@sentry/react';

<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

### Web Vitals

```typescript
// src/utils/webVitals.ts
import { onCLS, onFID, onLCP } from "web-vitals";

onCLS((metric) => Sentry.addBreadcrumb({ message: `CLS: ${metric.value}` }));
```

## Trade-offs

**Advantages**:

- ✅ Captures unhandled errors automatically
- ✅ Source maps for readable stack traces
- ✅ Performance metrics without custom instrumentation
- ✅ User context (user ID, email) for debugging

**Disadvantages**:

- ❌ 50KB bundle overhead (only in prod builds)
- ❌ Privacy concerns with session replay (mitigated: `maskAllText: true`)
- ❌ Free tier limits (need to monitor quota)

## Privacy Controls

```typescript
Sentry.replayIntegration({
  maskAllText: true, // Redact all text content
  blockAllMedia: true, // Block images/videos
  maskAllInputs: true, // Redact form inputs
});
```

## Sampling Strategy

| Environment | Traces | Replays (Normal) | Replays (Error) |
| ----------- | ------ | ---------------- | --------------- |
| Development | 100%   | 0%               | 0%              |
| Staging     | 100%   | 10%              | 100%            |
| Production  | 10%    | 10%              | 100%            |

**Rationale**:

- Dev: Full traces for debugging, no replays (local)
- Prod: 10% sampling to control costs, 100% error replays

## Error Filtering

```typescript
ignoreErrors: [
  'chrome-extension://',  // Browser extensions
  'ResizeObserver loop', // Benign browser error
  'Network request failed', // Expected in offline mode
],
```

## User Context

```typescript
Sentry.setUser({
  id: user.userId,
  email: user.email,
  username: user.username,
});
```

## Consequences

**Positive**:

- Caught 12 production errors in first week (fixed 8)
- LCP improved 20% after identifying slow image loads
- User context helps reproduce bugs

**Negative**:

- Privacy team required audit (passed with masking)
- Free tier almost exceeded (monitoring closely)
- Source map upload adds 30s to deployment

## Metrics

**Errors Captured**: ~50/month (down from 120 at launch)  
**Performance Insights**: Identified 3 slow queries (> 2s LCP)  
**False Positives**: ~15% (mostly browser extensions)

## Future Considerations

- Evaluate AWS CloudWatch RUM for cost comparison
- Add custom breadcrumbs for user flows (button clicks, navigation)
- Implement alerts for error spikes (Slack integration)

## Last Updated

December 2024
