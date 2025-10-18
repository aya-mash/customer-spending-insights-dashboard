# API Contracts & Data Client

This document captures the mocked REST contract implemented via MSW and consumed by the axios data client in `src/data/client.ts`.

## Overview
Base URL (client): `/api/customers` with a fixed `customerId` of `user123` (for now). All endpoints return deterministic pseudo-random data generated from a stable seed so tests are repeatable.

Axios instance settings:
- `baseURL: '/api/customers'`
- `timeout: 10_000ms`
- Headers: `Accept: application/json`
- Dev-only response logging interceptor (only in `import.meta.env.DEV`).
- Error normalization: unwraps axios errors to a standard `Error` instance with optional `status` number.
- Cancellation: Pass an `AbortSignal` to any endpoint method.

## Types
Central type declarations live in `src/data/models.ts`:
- Periods: `PeriodPreset = '7d' | '30d' | '90d' | '365d'`
- Sorting: `TransactionSort = 'date_asc' | 'date_desc' | 'amount_asc' | 'amount_desc'`
- Goal status union, response structures for: `Profile`, `SpendingSummary`, `CategoryBreakdown[]`, `SpendingTrends`, `TransactionsPage`, `GoalsResponse`, `FiltersResponse`.
- Parameter interfaces: `CategoriesParams`, `TransactionsParams`, `TrendsParams` (optional query fields omitted if undefined).

## Endpoints
| Endpoint | Method | Query Params | Response |
|----------|--------|--------------|----------|
| `/user123/profile` | GET | - | `Profile` |
| `/user123/spending/summary` | GET | `period` (PeriodPreset) | `SpendingSummary` |
| `/user123/spending/categories` | GET | `period` | `{ categories: CategoryBreakdown[], totalAmount }` |
| `/user123/spending/trends` | GET | `period` | `SpendingTrends` (trend points & rolling avg) |
| `/user123/transactions` | GET | `limit`, `offset`, `sortBy` (TransactionSort) | `TransactionsPage` |
| `/user123/goals` | GET | - | `GoalsResponse` |
| `/user123/filters` | GET | - | `FiltersResponse` |

### Sorting & Paging
`/transactions` supports:
- `limit` number of items (default fallback in handler if omitted)
- `offset` zero-based index
- `sortBy` field-direction union

Handler performs sorting AFTER generating deterministic transaction list to maintain seed invariance.

### Percentages & Totals
`/spending/categories` produces category entries each with:
- `amount` raw number
- `percentOfTotal` rounded to two decimals (may sum slightly > or < 100 due to rounding)
- `color`, `icon` consistently mapped per category label
Total integrity test ensures `sum(amount) === totalAmount`.

### Trends
`/spending/trends` returns arrays of daily points plus a rolling average. Client provides raw numeric values; UI handles formatting.

## Client Usage Examples
```ts
import { client } from '@/data/client';

// Abortable summary request
const controller = new AbortController();
client.spendingSummary('user123', { period: '7d' }, { signal: controller.signal })
  .then(res => console.log(res.totalAmount))
  .catch(err => console.error(err));

// Cancel if needed
controller.abort();
```

Transactions:
```ts
client.transactions('user123', { limit: 20, offset: 0, sortBy: 'amount_desc' })
  .then(page => page.items);
```

## Error Handling
All endpoint helpers throw a normalized `Error` with an added `status` property (if the server responded). Tests can assert `err.status === 404` etc. No axios-specific error leakage beyond message/status.

## Testing Strategy
Contract tests live in `src/data/__tests__/`:
- Summary: shape & period echo
- Categories: sum integrity, color/icon presence
- Transactions: paging + multi-sort determinism
Each test boots MSW server lifecycle via global setup in `src/test/setup.ts`.

Vitest configuration (`vitest.config.ts`) limits test discovery to our source; Playwright specification files are excluded.

## Extensibility
Add a new GET endpoint:
1. Extend `models.ts` with response + params types.
2. Add handler in `src/mocks/handlers.ts` (use factories for deterministic data).
3. Add function in `client.ts` using `get<T>()` helper.
4. Create a spec in `src/data/__tests__/` asserting shape & any param logic.

## Non-Goals
- UI formatting (currency, dates) is intentionally deferred to presentation components.
- POST/PUT/PATCH/DELETE semantics not modeled yet; current focus is read-only analytics data.

## Future Considerations
- Introduce seed override for visualizing different scenarios.
- Add retry/backoff wrapper for transient network errors.
- Expand error type to include a machine-readable `code`.

---
Maintained alongside code—update this file when contracts change.
