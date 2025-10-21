# PR Draft: Typed Axios Data Client & MSW Parity

## Summary
Implements a typed axios-based data client (`src/data/client.ts`) with deterministic MSW handlers alignment. Adds contract-focused tests (summary, categories, transactions) and isolates unit test discovery to project sources. Enhances contrast widget tests and updates project docs.

## Scope
- Types: `src/data/models.ts` centralizes endpoint contracts
- Client: axios instance (timeout, headers, dev logging, cancellation, error normalization)
- Mock Handlers: sorting logic for `/transactions` with `sortBy` param
- Tests: `src/data/__tests__/client.*.spec.ts` + updated `theme-and-contrast.spec.tsx`
- Config: `vitest.config.ts` include/exclude patterns
- Docs: `docs/api-contracts.md` & README link

## Motivation
Unifies data access behind a consistent abstraction while ensuring mocks reflect production contract. Deterministic generation supports stable assertions and reduces flakiness. Separation of e2e Playwright specs prevents accidental execution in unit test runs.

## Implementation Notes
- Error normalization wraps axios errors to standard `Error` with optional `status` numeric property
- Query building omits undefined/empty values
- Sorting applied post-generation to retain deterministic seed order
- Multiple accessible names for contrast close buttons handled via `getAllByRole`

## Testing
Run:
```powershell
yarn test
```
All 22 unit/integration tests pass locally.
Playwright e2e tests remain runnable separately:
```powershell
yarn playwright test
```

## Security & Accessibility
- No external network calls beyond axios baseURL placeholder
- Contrast checker gated to dev or query flags; a11y attributes preserved

## Follow-ups (Optional)
- Add endpoints: goals, filters, trends tests for parity coverage
- Introduce cancellation test (AbortSignal) & retry logic
- Seed override for scenario variability
- Add performance budget & Lighthouse CI

## Checklist
- [x] Types added & exported
- [x] Axios client implemented
- [x] MSW handlers updated
- [x] Contract tests added & green
- [x] Vitest config tightened
- [x] Docs updated (contracts + README)
- [x] Contrast gating tests updated
- [ ] Additional endpoint tests (trends/goals/filters) (future) 
- [ ] Cancellation test (future)

## Issues Referenced
Fixes #8, #9, #10 (adjust numbering to actual repo issues if different).

---
Please review focus on data layer; no UI visuals altered aside from test alignment.
