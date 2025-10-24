# ADR-0003: API Mocking - MSW

**Status**: Accepted  
**Date**: 2024-11-15

## Context

Need deterministic mock API responses for development and testing without running a real backend. Must work in both browser (dev) and Node (tests) with the same handlers.

## Decision

Chosen **Mock Service Worker (MSW) 2.11** over JSON Server, MirageJS, and hardcoded fetch mocks.

## Rationale

**Why MSW?**

- Intercepts requests at network level (Service Worker API)
- Same handlers for browser and Node environments (dev/test parity)
- Doesn't pollute app code with mocking logic
- Supports REST and GraphQL
- Deterministic data via factory functions

**Alternatives Rejected**:

- **JSON Server**: Requires separate process, no TypeScript types
- **MirageJS**: Heavier bundle, own state management (unnecessary)
- **Manual mocks**: Brittle, no network interception (misses edge cases)

## Implementation

### Handler Structure

```typescript
// src/mocks/handlers.ts
export const handlers = [
  http.get("/api/customers/:id/transactions", ({ request, params }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    return HttpResponse.json(makeTransactions(limit));
  }),
];
```

### Deterministic Factories

```typescript
// src/mocks/factories.ts
export function makeTransactions(limit = 20, offset = 0, category?: string) {
  const seed = `txn-${limit}-${offset}-${category || "all"}`;
  // Seed-based generation for repeatability
}
```

### Browser Setup

```typescript
// src/mocks/browser.ts
if (import.meta.env.VITE_ENABLE_MOCKS === "true") {
  worker.start({ onUnhandledRequest: "warn" });
}
```

## Trade-offs

**Advantages**:

- ✅ Dev/test parity (same mock data)
- ✅ No backend needed for frontend work
- ✅ Easy to simulate errors (404, 500, timeout)
- ✅ Network tab shows realistic requests/responses

**Disadvantages**:

- ❌ 50KB bundle overhead in dev (excluded from prod)
- ❌ Service Worker can be disabled by browser/user → 404s after sleep
- ❌ Requires `npx msw init public` on setup

## Handling MSW Failures

Self-healing retry logic when MSW stops after laptop sleep:

```typescript
// Detect idle 404 (MSW disabled)
if (error.status === 404 && isIdle) {
  await worker.stop();
  await worker.start();
  queryClient.invalidateQueries(); // Refetch
}
```

## Consequences

**Positive**:

- Frontend team ships features without backend dependency
- Integration tests use real network flow (catches CORS, headers)
- Consistent data across environments (predictable demos)

**Negative**:

- MSW initialization race condition in production builds (workaround: disable code splitting temporarily)
- Requires manual reset after long idle periods

## Last Updated

December 2024
