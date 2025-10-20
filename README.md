# Customer Spending Insights Dashboard

Project documentation expansion in progress.

## Key Features
- System-aware light/dark theme with manual override & reset.
- Semantic CSS custom properties (design tokens) targeting WCAG AA.
- Accessible theme toggle (`aria-pressed`) & skip navigation link.
- Lazy routes + hover prefetch for faster perceived navigation.
- Skeleton loaders with `aria-busy` and polite live region content swap.
- Dev-only Contrast Checker (tokens dropdowns, hex inputs, swap/reset, large text toggle, ESC close).
- Adaptive logo & favicon per theme.
- Unit-tested contrast utilities (`src/lib/contrast.ts`).
- Playwright smoke tests (theme persistence, contrast ratio correctness).
- Storybook component explorer.
- Typed axios data client + deterministic MSW API mocks (see `docs/api-contracts.md`).

## Accessibility Statement
We aim for WCAG 2.1 AA compliance:
- Contrast: ≥ 4.5:1 normal text; ≥ 3:1 large text (≥24px normal or ≥19px bold approximated).
- Keyboard: All interactive elements focusable with visible outline; ESC closes the dev contrast panel.
- Color scheme: `color-scheme: light dark` enables native UI theming alignment.
- Live regions: Async content replaces skeleton within a polite `aria-live` container to avoid disruption.

Planned improvements: Reduced-motion alternatives, more granular focus management, expanded screen reader announcements.

## Theming & Tokens
Source tokens live in `src/styles/tokens.css` (semantic, not raw HSL brand values) and are applied via `data-theme` attribute switching. User preference is persisted while a reset control restores system `prefers-color-scheme` behavior.

## Dev Contrast Checker
The floating action button appears when:
- In development (`import.meta.env.DEV`) OR
- URL has `?devtools=1` or `?contrastWidget=1` query.

Panel capabilities:
- Dropdown tokens resolve current computed values.
- Normalizes hex input (short syntax -> full #RRGGBB, strips invalid chars).
- Large text toggle adjusts AA/AAA thresholds.
- Swap & Reset controls; ESC closes panel.

Utilities underpinning it: `src/lib/contrast.ts` (relative luminance, ratio, AA/AAA evaluation, large text helpers).

## Storybook
Launch interactive component explorer:
```powershell
yarn storybook
```
Build static story bundle:
```powershell
yarn storybook:build
```

## Tests
Run unit/integration (Vitest):
```powershell
yarn test
```
Run Playwright smoke tests:
```powershell
yarn playwright test
```

## Local Development
Install deps & start dev server:
```powershell
yarn
yarn dev
```
Visit http://localhost:5173

## Performance & Loading
- Route-level code splitting via `React.lazy` + Suspense fallbacks.
- Hover prefetch warms next-route chunk before navigation.
- Skeleton loader component (`AsyncSection`) keeps layout stable; replaces with live content using an aria-live region.
- Minimal JS for initial paint; assets adapt (logo, favicon) to current theme to avoid layout shift.

## Routing Architecture
All application routing is defined centrally in `src/app/router.tsx` using `createBrowserRouter`. Pages are declared in `dashboard.config.ts` as a list of `RouteConfig` objects:

`{ path, label, component: () => import('...'), prefetch?, canActivate? }`

Key points:
- Lazy loading: Each route component is wrapped with `React.lazy` and a Suspense fallback that includes `aria-busy="true"` and a route-specific `aria-label` when helpful (e.g. Overview route has `"Loading overview data"`).
- Guards: Optional `canActivate` may return boolean or Promise<boolean>. Pending async guard states render a labeled busy indicator (`Checking access…`).
- Provider composition: The router root wraps `DashboardLayout` with `DashboardProvider` so hooks relying on location/navigation context never mount outside a Router.
- Error boundary: `errorElement` uses `ErrorFallback` for route-level errors.

### Test Router Helper
Unit tests that need navigation or location context use the memory router helper:

`buildTestRouter(initialEntries?: string[])` returns a `createMemoryRouter` instance preconfigured with the same route list & provider composition. Pass this into `<App router={testRouter} />` to avoid duplicate `<Router>` nesting.

This pattern ensures tests exercise the full layout shell (header, sidebar, bottom bar) while still allowing deterministic initial route entries.

## Accessible Loading Fallbacks
Suspense fallbacks and initial data fetch placeholders follow a consistent pattern:
- Include `aria-busy="true"` on the container.
- Provide a descriptive `aria-label` (e.g. `"Loading overview data"`, `"Loading charts"`) instead of generic "Loading" so screen reader users understand context.
- Use a polite live region (`aria-live="polite"`) only when incremental updates will announce; for simple skeleton-to-content swap, labeling + busy state is sufficient.
- Test queries prefer `getByLabelText` for these containers to assert presence before data resolves.

Guideline: When adding a new page with a data-heavy initial load, supply a scoped label: `aria-label="Loading {page} data"` and reuse the `aria-busy` pattern for parity and testability.

## Using the Dashboard Layout
The refactored shell exposes a provider + layout pair:

`DashboardProvider` supplies config (branding, navigation, routes, slots, options). `DashboardLayout` renders Header, Sidebar (desktop), BottomBar (mobile), and wraps page content.

### Rollback Instructions
If you need to revert to the pre-dashboard single layout implementation:
1. Replace the contents of `src/App.tsx` with the prior simple route shell (remove `DashboardProvider` and `DashboardLayout` wrappers, render routes directly).
2. Delete the `src/layouts/dashboard/` directory and remove any imports referencing it.
3. Remove `dashboard.css` import from `main.tsx` and delete `src/styles/dashboard.css`.
4. Remove dashboard-specific tokens only if unused elsewhere (keep base theme tokens to avoid breaking styling).
5. Delete new types from `src/app/types/dashboard.ts` if they are no longer referenced (or keep if planning future re-introduction).
6. Update `dashboard.config.ts` to original route list or delete it and inline routes where they were previously defined.
7. Run `yarn lint` and `yarn test` to confirm no stale references remain.
8. Clean up README sections referencing "Dashboard Layout" to avoid misleading documentation.

To reapply the dashboard later, restore the layout directory and wrap your routes with `DashboardProvider` and `DashboardLayout` again. Keep the contrast tooling as optional by gating with `import.meta.env.DEV`.

### Contrast Report CLI
Run a lightweight contrast check on key color pairs:
```powershell
node ./scripts/contrast-report.mjs
```
Extend `pairs` inside `scripts/contrast-report.mjs` to add more token combinations.

Config lives in `src/app/config/dashboard.config.ts` and follows types in `src/app/types/dashboard.ts`:
BrandingConfig: `{ title, logo?, homeUrl? }`  
RouteConfig: `{ path, label, component: () => import(...), prefetch?, canActivate? }`  
NavigationItem: discriminated union (`page | group | divider`).  
Options: `{ brandVariant: 'capitec' | 'neutral', sidebarWidth, defaultSidebarCollapsed }`.

To add a new page:
1. Create page file under `src/pages/`.
2. Append a `RouteConfig` entry + matching navigation item.
3. (Optional) add a `prefetch` function for hover/focus warming.

Brand variants adapt tokens only—components never hardcode hex values.

## Future Improvements
- Integrate real charts (e.g. Recharts or Visx) behind additional lazy boundaries.
- Lighthouse CI & performance budget enforcement.
- More Playwright scenarios (prefetch verification, keyboard nav, reduced-motion behavior).
- Automated palette contrast audit in CI.
- Internationalization (i18n) scaffolding.

## Contributing
See `CONTRIBUTING.md` for setup, branch, and PR conventions. Run tests before submitting changes. For security concerns consult `SECURITY.md`.

## License
Private / Internal usage only. Not licensed for external distribution.
