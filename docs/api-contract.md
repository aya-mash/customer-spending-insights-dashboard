# API Contract

This document specifies all 7 backend endpoints, their request/response contracts, and exact UI integration points.

## Base URL

```
Development: http://localhost:5173/api (proxied to MSW)
Production: ${VITE_API_BASE_URL} (configured in environment)
```

All endpoints require authentication via AWS Cognito tokens (handled by Amplify SDK).

## Endpoints Summary

| Endpoint                             | Method | Purpose                | Cache Key                                  | Components                  |
| ------------------------------------ | ------ | ---------------------- | ------------------------------------------ | --------------------------- |
| `/customers/:id/profile`             | GET    | User account info      | `['userAttributes', username]`             | ProfileDrawer, Profile page |
| `/customers/:id/spending/summary`    | GET    | Period aggregates      | `['spendingSummary', period, customerId]`  | Overview summary cards      |
| `/customers/:id/spending/categories` | GET    | Category breakdown     | `['categories', period, customerId]`       | Overview, Insights donut    |
| `/customers/:id/spending/trends`     | GET    | Monthly time series    | `['trends', customerId, months?]`          | Insights trends chart       |
| `/customers/:id/transactions`        | GET    | Paginated transactions | `['transactions', customerId, filters...]` | Transactions page           |
| `/customers/:id/goals`               | GET    | Budget goals           | `['goals', customerId]`                    | Overview goals section      |
| `/customers/:id/filters`             | GET    | Filter metadata        | `['filters', customerId]`                  | Transaction filters         |

---

## 1. Customer Profile

### `GET /customers/:customerId/profile`

Retrieves user account information and lifetime spending summary.

**Path Parameters**:

- `customerId` (string, required): Unique customer identifier

**Query Parameters**: None

**Response** (`Profile`):

```json
{
  "customerId": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "joinDate": "2023-01-15",
  "accountType": "premium",
  "totalSpent": 125430.5,
  "currency": "ZAR"
}
```

**Date Format**: `joinDate` is YYYY-MM-DD

**UI Integration**:

- **Component**: `src/features/profile/ProfileDrawer.tsx` (desktop), `src/pages/Profile.tsx` (mobile)
- **Query Key**: `['userAttributes', username]` (uses Amplify `fetchUserAttributes()` instead)
- **Display**: Avatar initials, name, email in drawer/page header
- **Note**: Currently uses Amplify user attributes; this endpoint is for future API-backed profiles

**Error States**:

- `404`: Customer not found → Show error boundary
- `401`: Unauthorized → Redirect to login

---

## 2. Spending Summary

### `GET /customers/:customerId/spending/summary`

Returns aggregated spending metrics for a specific period with comparison to previous period.

**Path Parameters**:

- `customerId` (string, required)

**Query Parameters**:

- `period` (PeriodPreset, optional, default: `"30d"`): One of `7d`, `30d`, `90d`, `1y`

**Example Request**:

```
GET /customers/user123/spending/summary?period=30d
```

**Response** (`SpendingSummary`):

```json
{
  "period": "30d",
  "totalSpent": 12450.75,
  "transactionCount": 87,
  "averageTransaction": 143.11,
  "topCategory": "Groceries",
  "comparedToPrevious": {
    "spentChange": -5.2,
    "transactionChange": 12.0
  }
}
```

**Field Semantics**:

- `totalSpent`: Total amount spent in period (ZAR cents converted to rands in UI)
- `averageTransaction`: Mean transaction amount
- `comparedToPrevious.spentChange`: Percentage change vs. previous period (negative = decrease)
- `comparedToPrevious.transactionChange`: Percentage change in transaction count

**UI Integration**:

- **Component**: `src/features/overview/Overview.tsx`
- **Query Key**: `['spendingSummary', period, customerId]`
- **Hook**: `useOverviewData(customerId, period)`
- **Display**:
  - Summary cards at top of overview page
  - Trend indicators (up/down arrows) based on `comparedToPrevious`
  - Period selector dropdown (7d/30d/90d/1y)
- **Stale Time**: 5 minutes (frequently changing data)

**Error States**:

- `404`: Customer not found
- Empty data: Show "No transactions in this period"

---

## 3. Spending by Category

### `GET /customers/:customerId/spending/categories`

Returns spending breakdown by category with percentages and transaction counts.

**Path Parameters**:

- `customerId` (string, required)

**Query Parameters**:

- `period` (PeriodPreset, optional, default: `"30d"`)
- `startDate` (string, optional): Custom range start (YYYY-MM-DD)
- `endDate` (string, optional): Custom range end (YYYY-MM-DD)

**Example Request**:

```
GET /customers/user123/spending/categories?period=30d
```

**Response** (`CategoryBreakdown`):

```json
{
  "dateRange": {
    "startDate": "2024-11-01",
    "endDate": "2024-11-30"
  },
  "totalAmount": 12450.75,
  "categories": [
    {
      "name": "Groceries",
      "amount": 4230.5,
      "percentage": 34.0,
      "transactionCount": 28,
      "color": "#10b981",
      "icon": "shopping-cart"
    },
    {
      "name": "Transport",
      "amount": 2100.0,
      "percentage": 16.9,
      "transactionCount": 12,
      "color": "#3b82f6",
      "icon": "car"
    }
  ]
}
```

**Field Semantics**:

- `categories`: Sorted by amount descending
- `percentage`: Calculated as (amount / totalAmount) \* 100
- `color`: Hex color for UI consistency
- `icon`: Icon name (lucide-react icon names)

**UI Integration**:

- **Components**:
  - `src/features/overview/Overview.tsx` (top 5 categories)
  - `src/features/insights/Insights.tsx` (full category breakdown)
- **Query Key**: `['categories', period, customerId]`
- **Hooks**:
  - `useOverviewData()` → Top 5 for quick view
  - `useInsightsData()` → All categories for donut chart
- **Display**:
  - Donut chart with interactive segments (click → filter transactions)
  - Legend with category chips (icon + name + amount)
  - Mobile: Compact chips with transaction counts
- **Interaction**: Click category → Navigate to `/transactions?category={name}`

**Error States**:

- Empty: Show "No spending in this period" with illustration

---

## 4. Spending Trends

### `GET /customers/:customerId/spending/trends`

Returns monthly spending time series for trend analysis.

**Path Parameters**:

- `customerId` (string, required)

**Query Parameters**:

- `months` (number, optional, default: `12`, max: `24`): Number of months to retrieve

**Example Request**:

```
GET /customers/user123/spending/trends?months=12
```

**Response** (`SpendingTrends`):

```json
{
  "trends": [
    {
      "month": "2024-11",
      "totalSpent": 12450.75,
      "transactionCount": 87,
      "averageTransaction": 143.11
    },
    {
      "month": "2024-10",
      "totalSpent": 13200.0,
      "transactionCount": 92,
      "averageTransaction": 143.48
    }
  ]
}
```

**Field Semantics**:

- `trends`: Sorted by month descending (most recent first)
- `month`: YYYY-MM format
- `averageTransaction`: totalSpent / transactionCount

**UI Integration**:

- **Component**: `src/features/insights/Insights.tsx` (Trends tab)
- **Query Key**: `['trends', customerId, months]`
- **Hook**: `useInsightsData(customerId)`
- **Display**:
  - Line chart with X-axis = month, Y-axis = totalSpent
  - Lazy-loaded via `React.lazy(() => import('TrendsChart'))`
  - Month labels formatted as "Nov 2024" using `toLocaleDateString()`
  - Month-over-month comparison in "Compare" tab
- **Stale Time**: 10 minutes (changes daily at most)

**Error States**:

- Empty: Show "No spending data available"

---

## 5. Transactions

### `GET /customers/:customerId/transactions`

Returns paginated, filterable, sortable transaction list.

**Path Parameters**:

- `customerId` (string, required)

**Query Parameters**:

- `limit` (number, optional, default: `20`, max: `100`): Results per page
- `offset` (number, optional, default: `0`): Pagination offset
- `category` (string, optional): Filter by category name
- `startDate` (string, optional): Filter by date range start (YYYY-MM-DD)
- `endDate` (string, optional): Filter by date range end (YYYY-MM-DD)
- `sortBy` (TransactionSort, optional, default: `"date_desc"`): One of `date_desc`, `date_asc`, `amount_desc`, `amount_asc`

**Example Request**:

```
GET /customers/user123/transactions?limit=20&offset=0&category=Groceries&sortBy=date_desc
```

**Response** (`TransactionsPage`):

```json
{
  "transactions": [
    {
      "id": "txn_001",
      "date": "2024-11-28T14:30:00Z",
      "merchant": "Woolworths",
      "category": "Groceries",
      "amount": 450.5,
      "description": "Weekly shopping",
      "paymentMethod": "Debit Card",
      "icon": "shopping-cart",
      "categoryColor": "#10b981"
    }
  ],
  "pagination": {
    "total": 450,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

**Field Semantics**:

- `date`: ISO 8601 timestamp (UTC)
- `amount`: Transaction amount (positive = debit)
- `pagination.hasMore`: `true` if more results exist beyond current page

**Sorting Behavior**:

- `date_desc`: Most recent first (default)
- `date_asc`: Oldest first
- `amount_desc`: Highest amount first
- `amount_asc`: Lowest amount first

**UI Integration**:

- **Component**: `src/features/transactions/Transactions.tsx`
- **Query Key**: `['transactions', customerId, filters, page, perPage, sortBy]`
- **Hook**: `useTransactionsData(customerId, filters, page, perPage, sortBy)`
- **Display**:
  - Desktop: Data table with sortable columns (click header → toggle asc/desc)
  - Mobile: Card list with filter drawer
  - Pagination: First/Previous/Page X of Y/Next/Last buttons
  - Filters: Category dropdown, date range picker
  - Click row → Open `TransactionDetailsDialog` with PDF download
- **Accessibility**: `aria-sort` on table headers, `aria-label` on pagination
- **Stale Time**: 3 minutes (moderately fresh)

**Error States**:

- Empty after filters: Show "No transactions match your filters"
- 404 after idle: Trigger self-heal retry (reset MSW, refetch)

---

## 6. Goals

### `GET /customers/:customerId/goals`

Returns budget goals with current spending and status.

**Path Parameters**:

- `customerId` (string, required)

**Query Parameters**: None

**Response** (`GoalsResponse`):

```json
{
  "goals": [
    {
      "id": "goal_001",
      "category": "Groceries",
      "monthlyBudget": 5000.0,
      "currentSpent": 4230.5,
      "percentageUsed": 84.6,
      "daysRemaining": 3,
      "status": "warning"
    },
    {
      "id": "goal_002",
      "category": "Entertainment",
      "monthlyBudget": 1000.0,
      "currentSpent": 1200.0,
      "percentageUsed": 120.0,
      "daysRemaining": 3,
      "status": "over"
    }
  ]
}
```

**Field Semantics**:

- `percentageUsed`: (currentSpent / monthlyBudget) \* 100
- `daysRemaining`: Days left in current month
- `status`: `on_track` (< 75%), `warning` (75-100%), `over` (> 100%)

**UI Integration**:

- **Component**: `src/features/overview/Overview.tsx` (Goals section)
- **Query Key**: `['goals', customerId]`
- **Hook**: `useOverviewData(customerId)`
- **Display**:
  - Progress bars with color coding (green/yellow/red)
  - Status badges: "On Track" / "Warning" / "Over Budget"
  - Days remaining indicator
  - Sorted by percentageUsed descending (most critical first)
- **Stale Time**: 10 minutes (updated daily)

**Error States**:

- Empty: Show "Set up budget goals to track spending"

---

## 7. Filters

### `GET /customers/:customerId/filters`

Returns filter metadata for transaction filtering (categories and date presets).

**Path Parameters**:

- `customerId` (string, required)

**Query Parameters**: None

**Response** (`FiltersResponse`):

```json
{
  "categories": [
    {
      "name": "Groceries",
      "color": "#10b981",
      "icon": "shopping-cart"
    },
    {
      "name": "Transport",
      "color": "#3b82f6",
      "icon": "car"
    }
  ],
  "dateRangePresets": [
    { "label": "Last 7 days", "value": "7d" },
    { "label": "Last 30 days", "value": "30d" },
    { "label": "Last 90 days", "value": "90d" },
    { "label": "Last year", "value": "1y" }
  ]
}
```

**Field Semantics**:

- `categories`: All available categories (from customer's transaction history)
- `dateRangePresets`: Quick-select date ranges for filtering

**UI Integration**:

- **Component**: `src/features/transactions/Transactions.tsx` (FilterDialog)
- **Query Key**: `['filters', customerId]`
- **Hook**: Not currently used (categories from category breakdown endpoint)
- **Display**:
  - Category dropdown in filter dialog/toolbar
  - Date range quick-select buttons
- **Stale Time**: 1 hour (rarely changes)

**Note**: Currently, category list is derived from the `/spending/categories` endpoint. This endpoint provides additional filter metadata for future enhancements (merchant filters, custom date ranges).

---

## Common Patterns

### Date Formats

- **Query params**: `YYYY-MM-DD` (e.g., `2024-11-28`)
- **Response timestamps**: ISO 8601 (e.g., `2024-11-28T14:30:00Z`)
- **Month identifiers**: `YYYY-MM` (e.g., `2024-11`)

### Currency

- **API**: Amounts in ZAR (South African Rand) as floating-point numbers
- **UI**: Formatted via `formatRand()` utility (e.g., `R 1,234.50`)

### Pagination

- **Offset-based**: Use `limit` + `offset` (e.g., page 2 with 20 per page = offset 20)
- **Total count**: `pagination.total` for "Page X of Y" calculation
- **Has more**: `pagination.hasMore` for enabling/disabling "Next" button

### Error Responses

Standard error format (not enforced by MSW, but recommended):

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Customer not found"
  }
}
```

**HTTP Status Codes**:

- `200 OK`: Successful request
- `400 Bad Request`: Invalid query parameters
- `401 Unauthorized`: Missing/invalid auth token
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Cache Strategy (React Query)

| Endpoint     | Stale Time | Retry | Refetch on Window Focus |
| ------------ | ---------- | ----- | ----------------------- |
| profile      | 15 min     | 1     | No                      |
| summary      | 5 min      | 2     | Yes                     |
| categories   | 5 min      | 2     | Yes                     |
| trends       | 10 min     | 1     | No                      |
| transactions | 3 min      | 2     | Yes                     |
| goals        | 10 min     | 1     | No                      |
| filters      | 1 hour     | 1     | No                      |

**Rationale**:

- Frequently changing data (summary, transactions): Short stale time, refetch on focus
- Static/slowly changing (trends, goals, filters): Long stale time, no refetch
- Retry: 2 attempts for critical paths (transactions, summary), 1 for less critical

### Self-Healing Retry Logic

When a 404 occurs after idle (laptop sleep, MSW disabled):

1. Detect idle state (no requests for > 5 minutes)
2. On 404, reset MSW service worker: `worker.stop() → worker.start()`
3. Retry request with exponential backoff (1s, 2s, 4s)
4. If still failing after 3 attempts, show error boundary

**Implementation**: `src/contexts/dashboard/DashboardProvider.tsx`

---

## Code Examples

### Fetching with Custom Hook

```typescript
// src/features/overview/useOverviewData.ts
import { useQuery } from "@tanstack/react-query";
import * as client from "../../data/client";

export function useOverviewData(customerId: string, period: PeriodPreset) {
  const summaryQuery = useQuery({
    queryKey: ["spendingSummary", period, customerId],
    queryFn: ({ signal }) => client.spendingSummary(customerId, period, signal),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return {
    summary: summaryQuery.data,
    isLoading: summaryQuery.isLoading,
    error: summaryQuery.error,
  };
}
```

### Direct Client Call

```typescript
// src/data/client.ts
export function transactions(
  customerId: string,
  params: TransactionsParams = {},
  signal?: AbortSignal,
): Promise<TransactionsPage> {
  const { limit = 20, offset = 0, category, sortBy = "date_desc" } = params;
  const query = buildQuery({ limit, offset, category, sortBy });
  return get<TransactionsPage>(`/${customerId}/transactions${query}`, signal);
}
```

### MSW Handler

```typescript
// src/mocks/handlers.ts
http.get('/api/customers/:customerId/transactions', ({ request }) => {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const offset = parseInt(url.searchParams.get('offset') || '0', 10);
  const category = url.searchParams.get('category') || undefined;

  const payload = makeTransactions(limit, offset, category);
  return HttpResponse.json(payload);
}),
```

## Last Updated

December 2024
