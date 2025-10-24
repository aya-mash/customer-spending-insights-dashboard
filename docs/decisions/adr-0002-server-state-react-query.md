# ADR-0002: Server State - React Query

**Status**: Accepted  
**Date**: 2024-11-15  
**Deciders**: Tech Lead, Senior Frontend Engineer

## Context

Need a robust solution for fetching, caching, and synchronizing server state (API data) with automatic background updates and optimistic UI patterns.

## Decision

Chosen **TanStack Query (React Query) v5** over SWR and Redux Toolkit Query.

## Rationale

### Why React Query?

- **Declarative Data Fetching**: `useQuery` hook replaces useEffect boilerplate
- **Automatic Caching**: Stale-while-revalidate strategy out of the box
- **Background Refetching**: Keeps data fresh without user intervention
- **Devtools**: Excellent debugging with query inspector
- **TypeScript**: Full type inference from query functions

### Why Not SWR?

- Similar API but less mature mutation support
- No built-in devtools
- Smaller plugin ecosystem
- Less granular cache control

### Why Not Redux Toolkit Query (RTK Query)?

- Requires Redux (unnecessary complexity for this app)
- More boilerplate (endpoints, slices, reducers)
- Tighter coupling to Redux patterns
- No global client state needs justify Redux overhead

## Trade-offs

**Advantages**:

- ✅ No `useState` + `useEffect` for data fetching
- ✅ Automatic cache invalidation and refetching
- ✅ Request deduplication (concurrent calls to same endpoint)
- ✅ Optimistic updates for mutations (future)
- ✅ Query cancellation on component unmount

**Disadvantages**:

- ❌ Learning curve for cache key patterns
- ❌ Bundle size: ~40KB gzipped (but replaces custom fetch logic)
- ❌ Can be over-engineered for simple apps (not this one)

## Implementation Pattern

### Query Key Structure

```typescript
// Hierarchical keys for automatic invalidation
["spendingSummary", period, customerId]["spendingSummary"]; // Specific query // Invalidates all summaries
```

### Stale-While-Revalidate

```typescript
useQuery({
  queryKey: ["transactions", customerId, filters],
  queryFn: ({ signal }) => client.transactions(customerId, filters, signal),
  staleTime: 3 * 60 * 1000, // 3 minutes
  refetchOnWindowFocus: true,
  retry: 2,
});
```

**Behavior**:

- Data fresh for 3 minutes (no refetch)
- After 3 minutes: Show stale data, fetch in background
- On window focus: Refetch if stale

### Self-Healing Retry

```typescript
// DashboardProvider.tsx
const loadData = useCallback(() => {
  // Reset MSW if 404 after idle
  if (isIdle404Error) {
    worker.stop().then(() => worker.start());
  }
  queryClient.invalidateQueries(); // Refetch all
}, [queryClient]);
```

## Consequences

### Positive

- Eliminated 200+ lines of manual fetch/loading/error logic
- Automatic background sync keeps data fresh
- Improved UX: Instant navigation (cached data), background refetch
- Easier to add mutations (future POST/PUT/DELETE operations)

### Negative

- Query key management requires discipline (naming conventions)
- Over-refetching if stale times not tuned correctly (fixed via profiling)
- Devtools bundle in dev builds (excluded from prod)

## Metrics

**Cache Hit Rate**: ~75% (most navigations use cached data)  
**Background Refetches**: ~3-5 per session (window focus, stale data)  
**Request Reduction**: ~40% fewer API calls vs. fetch-on-mount pattern

## Future Considerations

- Add mutations for future write operations (budget goals, preferences)
- Implement infinite queries for transaction scrolling
- Explore persisted cache (react-query-persist-client) for offline

## Last Updated

December 2024
