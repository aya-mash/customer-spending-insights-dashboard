# Customer Spending Insights Dashboard

A production-ready React TypeScript dashboard for analyzing customer spending patterns with enterprise-grade performance, accessibility, and responsive design.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production  
npm run build

# Run tests
npm test

# Run Storybook
npm run storybook

# Docker deployment
docker build -t spending-dashboard .
docker run -p 3000:80 spending-dashboard
```

## 📊 Features

### Dashboard Views
- **Overview**: 30-day spending summary with goals and quick actions
- **Insights**: Interactive donut charts and trend analysis with drill-down
- **Transactions**: Filterable, sortable, paginated transaction management

### Performance & Accessibility
- 🎯 **Lighthouse Scores**: A11y ≥95%, Perf ≥90%, CLS ≤0.10
- ♿ **WCAG AA**: Full keyboard navigation, screen reader support, high contrast
- 📱 **Responsive**: Mobile-first design with touch-friendly interactions
- ⚡ **Optimized**: Code-split routes, lazy-loaded charts, memoized components

### Technology Stack
- **Frontend**: Vite + React 18 + TypeScript (strict)
- **Charts**: Recharts with lazy loading and accessibility
- **Styling**: Native CSS with tokens, Grid/Flex, container queries
- **Testing**: Vitest + Testing Library + Playwright
- **Mocking**: MSW with deterministic data factories

## 🏗️ Architecture

```
src/
├── app/              # Router, shell, config
├── components/       # Reusable UI components 
├── features/         # Feature-specific modules
├── data/             # API client, models, mocks
├── styles/           # Design tokens, base styles
├── utils/            # Performance, accessibility utilities
└── hooks/            # Custom React hooks
```

## 🎨 Design System

### Tokens
- **Colors**: Primary/secondary scales, semantic states, dark theme
- **Spacing**: Consistent scale (sp-1 to sp-64)
- **Typography**: Type scale with semantic sizes
- **Elevation**: Shadow system (1-5 levels)

### Components
- **Cards**: Consistent elevation and spacing
- **Tables**: Zebra rows, sticky headers, mobile cards
- **Charts**: Accessible with screen reader summaries
- **Navigation**: Responsive sidebar/bottom bar

## 📈 Performance Features

### Code Splitting
- **Routes**: Each page lazy-loaded separately
- **Charts**: DonutChart (26kB), TrendsChart (41kB) 
- **Main Bundle**: 310kB optimized

### Optimization
- **LazyImage**: Intersection observer loading
- **VirtualizedList**: Window-based rendering for large datasets
- **Memoization**: Smart re-render prevention
- **Bundle Analysis**: Performance monitoring utilities

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
