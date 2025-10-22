# Customer Spending Insights Dashboard

A production-ready React TypeScript dashboard for analyzing customer spending patterns with enterprise-grade performance, accessibility, and responsive design.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production  
yarn build

# Run tests
yarn test

# Run Storybook
yarn storybook
```

## 📦 Deployment

### AWS Amplify (Recommended)
This project is configured for seamless deployment on AWS Amplify:

1. Connect your repository to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Amplify will automatically detect the `amplify.yml` configuration
3. Set up environment variables if needed (see Environment Configuration section)
4. Deploy automatically on every push

**Important**: Ensure `VITE_API_BASE_URL` is set to `/api` (not `/customers/api`) in Amplify environment variables.

See [docs/deployment.md](docs/deployment.md) and [docs/amplify-setup.md](docs/amplify-setup.md) for detailed instructions.

### Docker (Production & Development)

#### Quick Start with Docker Compose
```bash
# Production build
docker-compose up --build

# Development with hot reload
docker-compose -f docker-compose.dev.yml up
```

Access the application at http://localhost:3000 (production) or http://localhost:5173 (development).

#### Manual Docker Build
```bash
# Build production image (~50MB)
docker build -t customer-insights:latest .

# Run container
docker run -p 3000:8080 customer-insights:latest

# With custom environment variables
docker run -p 3000:8080 \
  -e VITE_API_BASE_URL=/api \
  -e VITE_ENABLE_MOCKS=true \
  customer-insights:latest
```

#### VS Code Dev Containers
Open the project in VS Code and use the "Reopen in Container" command for a consistent development environment with all tools pre-installed.

See [docs/docker-deployment.md](docs/docker-deployment.md) for comprehensive Docker documentation including security, health checks, and production deployment strategies.

## 📊 Features

### Dashboard Views
- **Overview**: 30-day spending summary with goals and quick actions
- **Insights**: Interactive donut charts and trend analysis with drill-down
- **Transactions**: Filterable, sortable, paginated transaction management

### Performance & Accessibility
- 🎯 **Lighthouse Scores**: A11y ≥95%, Perf ≥90%, CLS ≤0.10 (target metrics)
- ♿ **WCAG AA**: Full keyboard navigation, screen reader support, `:focus-visible` indicators
- 🎹 **Keyboard**: Tab/Shift+Tab, Enter/Space, Escape (modals), Arrow keys (tabs), skip links
- 📱 **Responsive**: Mobile-first (320px+), touch-friendly (44px targets), safe-area support (iOS notch)
- ⚡ **Optimized**: Code-split routes, lazy-loaded charts (DonutChart 26kB, TrendsChart 41kB)
- 🎨 **Dark Theme**: Auto-detect via `prefers-color-scheme`, manual toggle, persisted to localStorage
- 🔍 **Screen Readers**: ARIA labels, live regions (`aria-live="polite"`), chart summaries via `aria-describedby`
- 🎭 **Animations**: Respect `prefers-reduced-motion` (disables chart animations, transforms)

### Technology Stack
- **Frontend**: Vite 7.1.7 + React 19.1.1 + TypeScript (strict mode)
- **Routing**: React Router DOM 7.9.4 with lazy loading and prefetch
- **Charts**: Recharts 3.3.0 with accessibility and lazy boundaries
- **Icons**: Lucide React 0.546.0 (professional icon system, replaces emojis)
- **Styling**: Native CSS only (Grid/Flex, custom properties, container queries, logical properties)
- **State**: TanStack React Query 5.90.5 for server state
- **Testing**: Vitest 3.2.4 + Testing Library + Playwright (E2E)
- **Mocking**: MSW 2.11.5 with deterministic factories
- **Storybook**: 8.2.9 for component-driven development
- **Deployment**: AWS Amplify with automatic CI/CD

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

### Design Tokens (Production-Grade)
All visual design decisions are centralized in `src/styles/tokens.css`:
- **Colors**: Primary (#2F70EF blue), Secondary (#1E313E), semantic states, full neutral scale (50-900)
- **Typography**: Scale from 11px→48px with semantic names (fs-caption, fs-body, fs-h1-h6)
- **Spacing**: Consistent 4px-based scale (sp-1→sp-64) for margins, padding, gaps
- **Shadows**: 6-level elevation system (shadow-xs→shadow-2xl) for depth hierarchy
- **Radius**: Border radius tokens (radius-xs→radius-full) for consistent rounding
- **Z-Index**: Layered scale (base→dropdown→sticky→fixed→modal→tooltip→toast→max)
- **Transitions**: Timing tokens (fast 150ms, normal 250ms, slow 350ms) with easing curves
- **Dark Theme**: Professional dark mode with WCAG AA contrast, optimized for low-light viewing

### Components
- **Cards**: Elevation levels 1-5, interactive variant with hover lift, consistent spacing
- **Metric Cards**: 8-metric grid (2-col desktop, 4-col on 1440px+), category-specific icon colors
- **Tables**: Zebra striping, sticky headers with shadow, right-aligned currency, sortable columns
- **Charts**: 
  - DonutChart: Inner label (Top category), rounded segments, click drill-down, SR summaries
  - TrendsChart: Gradient area/line, compact ticks, tooltip with delta, textual summary
- **Tabs**: Pill-style with robust ARIA, keyboard Left/Right, strong :focus-visible
- **Navigation**: 
  - Desktop: Collapsible sidebar (248px→72px) with icon-only mode, unified header toggle
  - Mobile: Bottom nav with safe-area support, icon+label column layout
- **Filters**: Removable category/period pills, "Clear all" button, URL-backed state
- **Interactive States**: 
  - Hover: Subtle transforms (translateY, translateX), shadow elevation
  - Focus: Visible outlines (`:focus-visible` only, no sticky mouse outlines)
  - Active: Tactile press feedback (reduced lift on buttons, cards)

### Responsive Spacing
- **Page Padding**: Progressive 24px (mobile) → 32px (tablet) → 48px (desktop)
- **Max Width**: 1600px with auto centering for large screens
- **Touch Targets**: Minimum 44×44px enforced (buttons, nav links, chips)

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

## 🔧 Environment Configuration

This project uses environment-specific configuration files to manage different deployment environments:

### Environment Files
- **`.env.development`**: Local development (default when running `yarn dev`)
- **`.env.staging`**: Integration/staging environment (deployed from `develop` branch)
- **`.env.production`**: Production environment (deployed from `main` branch)
- **`.env.example`**: Template file showing all available variables

### Available Variables
All environment variables must be prefixed with `VITE_` to be exposed to the client:

- `VITE_ENV`: Environment name (`development`, `staging`, `production`)
- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_APP_NAME`: Application display name
- `VITE_ENABLE_MOCKS`: Enable MSW mock service worker (`true`/`false`)

### Usage in Code
Access environment variables through the type-safe config module:

```typescript
import { config } from './config/env';

// Available properties:
config.env              // 'development' | 'staging' | 'production'
config.apiBaseUrl       // API base URL
config.appName          // Application name
config.enableMocks      // Boolean for MSW
config.isDevelopment    // true if env === 'development'
config.isStaging        // true if env === 'staging'
config.isProduction     // true if env === 'production'
```

### Build Scripts
- `yarn dev`: Start dev server with development env
- `yarn dev:staging`: Start dev server with staging env
- `yarn build`: Production build
- `yarn build:staging`: Staging build
- `yarn build:dev`: Development build

### AWS Amplify Configuration
The `amplify.yml` file automatically detects the deployment branch and uses the appropriate build command:
- `main` branch → `yarn build` (production)
- `develop` branch → `yarn build:staging` (staging)
- Other branches → `yarn build:dev` (development)

## Local Development

### Quick Start
Install deps & start dev server:
```powershell
yarn
yarn dev
```
Visit http://localhost:5173

### VS Code Workspace Setup
This project includes a comprehensive VS Code workspace configuration for a consistent development experience.

**Recommended:** Open the workspace file for the best experience:
```powershell
# Open in VS Code
code customer-spending-insights-dashboard.code-workspace
```

The workspace includes:
- Pre-configured settings (formatting, linting, TypeScript)
- Recommended extensions
- Debug configurations for Chrome and Node
- Task runners for dev, build, test, and more
- File nesting for better organization

See [docs/workspace-setup.md](docs/workspace-setup.md) for detailed setup instructions.

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
