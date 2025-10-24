# State Management

React Query handles server state. React Context handles UI state. That's it.

## Server State (React Query)

### Query Keys Convention

Hierarchical structure for automatic invalidation:

```typescript
["resource", ...params, ...filters][
  // Examples:
  ("transactions", customerId, filters, page, limit, sortBy)
][("spendingSummary", period, customerId)][("categories", period, customerId)][
  ("trends", customerId, months)
][("goals", customerId)];
```

**Invalidation**: `queryClient.invalidateQueries(['transactions'])` invalidates all transaction queries.

### Cache Strategy

```typescript
// src/features/overview/useOverviewData.ts
const summaryQuery = useQuery({
  queryKey: ["spendingSummary", period, customerId],
  queryFn: ({ signal }) => client.spendingSummary(customerId, period, signal),
  staleTime: 5 * 60 * 1000, // Fresh for 5 minutes
  retry: 2, // Retry twice on failure
  refetchOnWindowFocus: true, // Refetch on tab focus
});
```

| Endpoint     | Stale Time | Retry | Refetch on Focus | Rationale          |
| ------------ | ---------- | ----- | ---------------- | ------------------ |
| summary      | 5 min      | 2     | ✅               | Frequently updated |
| categories   | 5 min      | 2     | ✅               | Frequently updated |
| trends       | 10 min     | 1     | ❌               | Changes daily      |
| transactions | 3 min      | 2     | ✅               | Critical path      |
| goals        | 10 min     | 1     | ❌               | Changes daily      |
| filters      | 1 hour     | 1     | ❌               | Rarely changes     |

### Self-Healing Retry

Handles MSW disabled after laptop sleep:

```typescript
// src/contexts/dashboard/DashboardProvider.tsx
const loadData = useCallback(async () => {
  // Detect idle 404 (MSW stopped)
  if (error?.status === 404 && isIdle) {
    const { worker } = await import("../mocks/browser");
    await worker.stop();
    await worker.start();
  }

  // Refetch all queries
  queryClient.invalidateQueries();
}, [queryClient, error, isIdle]);
```

### Error Handling

```typescript
const { data, error, isLoading } = useQuery({...});

if (error) {
  // Normalized error from axios
  return <ErrorMessage>{error.message}</ErrorMessage>;
}
```

## Client State (React Context)

### Theme Context

```typescript
// src/contexts/theme/ThemeContext.tsx
const ThemeContext = createContext<ThemeContextValue>();

// Persisted in localStorage
localStorage.setItem("theme", "dark");

// Synced to document
document.documentElement.dataset.theme = "dark";
```

### Dashboard Context

```typescript
// src/contexts/dashboard/DashboardProvider.tsx
const DashboardContext = createContext({
  customerId: "user123",
  loadData: () => {},
  resetFilters: () => {},
});
```

### Auth Context (AWS Amplify)

```typescript
import { useAuthenticator } from "@aws-amplify/ui-react";

const { user, signOut } = useAuthenticator();

// Cross-tab logout via BroadcastChannel
const channel = new BroadcastChannel("auth");
channel.postMessage({ type: "logout" });
```

## URL State (React Router)

Filters and tabs persisted in URL query params:

```typescript
// Transactions page
const searchParams = new URLSearchParams(location.search);
const category = searchParams.get("category");
const sortBy = searchParams.get("sortBy") || "date_desc";

// Insights page
const activeTab = searchParams.get("tab") || "compare";
```

**Benefits**: Shareable URLs, browser back/forward works

## Component State (useState)

Local UI state only:

```typescript
const [isDialogOpen, setIsDialogOpen] = useState(false);
const [selectedTransaction, setSelectedTransaction] =
  useState<Transaction | null>(null);
```

**Rule**: If state is used by >1 component, lift to Context or URL.

## Last Updated

December 2024
