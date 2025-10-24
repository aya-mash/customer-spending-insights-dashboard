# Testing Guide

Tests use Vitest + Testing Library for units, Playwright for E2E.

## Running Tests

```bash
# Unit/integration tests
yarn test          # Run once
yarn test --watch  # Watch mode
yarn test --coverage  # Coverage report

# E2E tests
npx playwright test
npx playwright test --ui  # Interactive mode
npx playwright test --headed  # See browser
```

## Test Structure

```
src/
├── __tests__/         # Component tests
├── test/
│   ├── setup.ts       # Vitest setup
│   └── utils.tsx      # Test helpers
tests/e2e/             # Playwright E2E
```

## Unit/Integration Tests

### Test Setup (Vitest)

```typescript
// src/test/setup.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock AWS Amplify
vi.mock("@aws-amplify/ui-react", () => ({
  Authenticator: ({ children }) => children({ user: mockUser }),
  useAuthenticator: () => ({ user: mockUser, signOut: vi.fn() }),
}));
```

### Render Helper

```typescript
// src/test/utils.tsx
export function renderWithProviders(ui: ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

### Component Test Example

```typescript
// src/__tests__/overview.spec.tsx
import { renderWithProviders } from '../test/utils';
import { Overview } from '../features/overview/Overview';

describe('Overview', () => {
  it('renders summary cards', async () => {
    const { getByText } = renderWithProviders(<Overview />);

    // Wait for API call (MSW responds)
    await waitFor(() => {
      expect(getByText('Total Spent')).toBeInTheDocument();
    });
  });
});
```

### MSW in Tests

```typescript
// src/test/setup.ts
import { server } from "../mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## E2E Tests (Playwright)

### Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL: "http://localhost:5173" },
  webServer: {
    command: "npm run dev",
    port: 5173,
    reuseExistingServer: true,
  },
});
```

### Test Example

```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from "@playwright/test";

test("navigates between pages", async ({ page }) => {
  await page.goto("/");

  // Click Insights nav
  await page.click('[aria-label="Insights"]');
  await expect(page).toHaveURL("/insights");

  // Check page content
  await expect(page.getByRole("heading", { name: "Insights" })).toBeVisible();
});
```

### Accessibility Testing

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("has no accessibility violations", async ({ page }) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

## Coverage

Run `yarn test --coverage` and check `coverage/index.html`.

**Targets**:

- Critical paths (data fetching, auth): 90%+
- UI components: 80%+
- Utils: 100%

**Exclusions**: `src/mocks/`, `src/test/`, `*.config.ts`

## Last Updated

December 2024
