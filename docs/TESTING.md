# Testing Strategy

## Coverage Overview

### Unit Tests
**Location**: `src/__tests__/`, `src/design-system/__tests__/`

**Focus**:
- Design system components (Button, Card, Tabs, Table)
- Utility functions (currency formatting, date helpers, contrast checker)
- Custom hooks (useTheme, useResponsiveValue, useChartHeight)
- Theme context (mode switching, breakpoint detection)

**Tools**: Vitest + React Testing Library

**Example**:
```tsx
// Button renders with correct variant styles
// Tabs handle keyboard navigation (Arrow keys, Home, End)
// useTheme returns correct breakpoint for window width
```

### Integration Tests
**Location**: `src/__tests__/`

**Focus**:
- Theme toggle persistence (localStorage)
- Layout responsiveness (sidebar collapse, bottom nav appearance)
- Data fetching + error states (MSW mocked responses)
- Filter/sort interactions in Transactions page

**Tools**: Vitest + MSW (Mock Service Worker)

### E2E Tests (Playwright)
**Location**: `tests/e2e/`

**Focus**:
- Auth flows (sign-up, sign-in, sign-out)
- Theme persistence across page reloads
- Language switcher updates UI text
- Transaction filtering + pagination
- Goal creation/edit/delete
- Mobile navigation (bottom nav, drawer)
- Contrast checker widget interactions

**Tools**: Playwright

**Smoke Test Outline**:
1. Load dashboard → auth form appears
2. Sign in → Overview page loads with data
3. Toggle theme → colors update instantly
4. Navigate to Insights → charts render
5. Switch language → text changes
6. Filter transactions → table updates
7. Create goal → dialog opens, saves, closes
8. Resize viewport → mobile bottom nav appears

**Run**: `npm run test:e2e` (requires backend or MSW)

## Test Data Strategy

- **MSW Handlers**: `src/mocks/handlers.ts` provides consistent test data
- **Factories**: `src/mocks/factories.ts` generates random transactions/goals
- **Seeding**: Deterministic data for E2E (reset between tests)

## CI/CD Integration

[TODO: Add GitHub Actions/GitLab CI config for running tests on PRs]

**Ideal Pipeline**:
1. Lint + Typecheck
2. Unit + Integration tests (Vitest)
3. E2E tests (Playwright on staging)
4. Lighthouse CI (performance/a11y audit)

## Writing New Tests

- **Unit**: Test logic, not implementation details. Use Testing Library queries (`getByRole`, `getByLabelText`).
- **Integration**: Mock API calls with MSW. Test user workflows across multiple components.
- **E2E**: Use `page.locator('[aria-label="..."]')` for robust selectors. Avoid CSS classes.

---

**Current Status**: Unit + integration tests implemented. E2E tests pending Playwright setup.
