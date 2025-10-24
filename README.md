# Customer Spending Insights Dashboard

A financial analytics platform built with React and TypeScript that helps users understand their spending patterns through interactive visualizations.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19.1-61DAFB)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF)

## Table of Contents

- [Demo](#demo)
- [Tech Stack & Trade-offs](#tech-stack--trade-offs)
- [Quick Start](#quick-start)
  - [Docker Quick Start](#docker-quick-start-recommended)
  - [Development](#development)
  - [Testing](#testing)
  - [Production Build](#production-build)
  - [AWS Amplify Deployment](#aws-amplify-deployment)
- [Feature Overview](#feature-overview)
- [API Usage](#api-usage)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Security](#security)
- [AI Use Disclaimer](#ai-use-disclaimer)
- [Roadmap](#roadmap)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Demo

### Desktop Light Theme

![Desktop Overview](docs/screenshots/desktop-overview-light.png)

### Mobile Dark Theme

![Mobile Transactions](docs/screenshots/mobile-transactions-dark.png)

### Features

- Category breakdowns with interactive donut charts
- Transaction filtering and server-side pagination
- PDF receipt generation
- Responsive design (works on all screen sizes)
- Offline-capable PWA
- Full keyboard navigation and screen reader support

## Tech Stack & Trade-offs

### Core

- **React 19.1** with TypeScript 5.9 (strict mode)
- **Vite 7.1** - Faster than Webpack, simpler config than CRA
- **React Router 7.9** - File-based routing with lazy loading

### State & Data

- **React Query (TanStack Query 5)** - Handles all server state
  - Chose this over Redux because we don't need global client state
  - Better developer experience than SWR for our use case
- **Axios** - HTTP client with request/response interceptors

### Development

- **MSW 2.11** - Mock API in browser and tests (same handlers everywhere)
- **Vitest + Testing Library** - Fast unit tests
- **Playwright** - E2E testing
- **Husky** - Pre-commit hooks (lint, format, type-check)

### UI

- **Recharts 3.3** - D3-based charts (100KB bundle cost but worth it for the features)
- **Lucide React** - Icon library
- **Custom design system** - Token-based theming

### Infrastructure

- **Docker + nginx** - Multi-stage build with security headers
- **AWS Amplify** - Hosting with branch deployments
- **Sentry** - Error tracking (10% sampling in prod)
- **Workbox** - Service worker for offline support

## Quick Start

### Prerequisites

- Node.js 20+ and Yarn 1.22
- Docker (for containerized deployment)

### Docker Quick Start (Recommended)

The fastest way to run the application in a production-like environment:

```bash
# Build the Docker image
docker build -t spending-insights:latest .

# Run the container
docker run -p 8080:8080 spending-insights:latest

# Open browser to http://localhost:8080

# Verify health
curl http://localhost:8080/health
```

**What's included:**

- Multi-stage build (dev, build, production stages)
- nginx web server with security headers
- Production build with code splitting
- Health check endpoint at `/health`
- Non-root user
- Gzip compression

**Docker Compose (with hot-reload for development):**

```bash
# Start dev environment with live reload
docker-compose -f docker-compose.dev.yml up

# Access at http://localhost:5173
```

### Development

```bash
# Install dependencies
yarn install

# Initialize MSW (Mock Service Worker)
npx msw init public

# Start dev server (http://localhost:5173)
yarn dev

# Environment setup (optional)
cp .env.example .env.development
```

**MSW Note**: API calls are mocked by default in development. See [docs/msw-mocking.md](docs/msw-mocking.md) for details.

### Testing

```bash
# Unit/integration tests (Vitest)
yarn test

# Watch mode
yarn test --watch

# Coverage report
yarn test --coverage

# E2E tests (Playwright)
npx playwright test

# E2E with UI
npx playwright test --ui
```

**Coverage**: Aiming for 80%+ on critical paths (data fetching, auth, calculations).

### Production Build

#### Docker Deployment

```bash
# Build production image
docker build -t spending-insights:latest .

# Run container
docker run -p 8080:8080 spending-insights:latest

# Healthcheck
curl http://localhost:8080/health
```

**Multi-stage build**: Dev stage with hot-reload, builder stage with optimizations, production stage with nginx.

#### Local Production Preview

```bash
# Build for production
yarn build

# Preview build
yarn preview
```

### AWS Amplify Deployment

Configured in `amplify.yml` with branch-based environments:

- `main` → Production (`yarn build`)
- `develop` → Staging (`yarn build:staging`)
- Feature branches → Development (`yarn build:dev`)

**Environment Variables** (set in Amplify Console):

```
VITE_API_BASE_URL=https://api.example.com
VITE_ENV=production
VITE_SENTRY_DSN=https://...
VITE_ENABLE_MOCKS=false
```

## Feature Overview

### 1. Overview Dashboard

**Location**: `src/app/routes/OverviewRoute.tsx`, `src/features/overview/`

- 4-column summary cards (total spent, avg transaction, top category, transaction count)
- Period selector (7d, 30d, 90d, 1y) with month-over-month comparison
- Top 5 category breakdown with click-to-filter
- Recent transactions list
- Budget goals with progress indicators

**API**: `GET /customers/:id/spending/summary`, `GET /customers/:id/spending/categories`

### 2. Insights Page

**Location**: `src/app/routes/InsightsRoute.tsx`, `src/features/insights/`

- Tabbed interface: Compare, Category, Trends, Monthly, Merchants
- Interactive donut chart (click segment → filter transactions)
- Month-over-month spending comparison with trend indicators
- Line chart for 12-month spending patterns
- Top 10 merchants with spending bars

**API**: `GET /customers/:id/spending/trends`, `GET /customers/:id/transactions`

### 3. Transactions Management

**Location**: `src/app/routes/TransactionsRoute.tsx`, `src/features/transactions/`

- Server-side pagination (20 per page, configurable)
- Real-time filtering: category dropdown, date range, search
- Sortable columns (date, amount) with `aria-sort` for accessibility
- Mobile: Card-based layout with filter dialog
- Desktop: Data table with inline filters
- **Transaction Details Dialog**: Click row → PDF receipt download (jspdf lazy-loaded)

**API**: `GET /customers/:id/transactions?limit=20&offset=0&category=...&sortBy=date_desc`

### 4. Profile Management

**Location**: `src/pages/Profile.tsx`, `src/features/profile/ProfileDrawer.tsx`

- Desktop: Avatar in header → profile drawer
- Mobile: 4th bottom nav item → full-page profile
- User info from AWS Amplify (`fetchUserAttributes`)
- Sign out with cross-tab logout (BroadcastChannel)

**API**: `GET /customers/:id/profile`

### 5. Self-Healing Retry

**Location**: `src/contexts/dashboard/DashboardProvider.tsx`

Detects idle 404s (MSW disabled after sleep), resets service worker, retries with exponential backoff. Prevents "blank screen" after laptop wake.

### 6. Cross-Tab Logout

**Location**: `src/layouts/dashboard/DashboardLayout.tsx`

Uses `BroadcastChannel` API to sync logout across tabs. Sign out in one tab → all tabs redirect to login.

## API Usage

All 7 endpoints are documented in [docs/api-contract.md](docs/api-contract.md). High-level summary:

| Endpoint                             | Method | Purpose                    | Used By                        |
| ------------------------------------ | ------ | -------------------------- | ------------------------------ |
| `/customers/:id/profile`             | GET    | User account info          | Profile page, header avatar    |
| `/customers/:id/spending/summary`    | GET    | Period-based aggregates    | Overview dashboard cards       |
| `/customers/:id/spending/categories` | GET    | Category breakdown         | Overview, Insights donut chart |
| `/customers/:id/spending/trends`     | GET    | Monthly time series        | Insights trends chart          |
| `/customers/:id/transactions`        | GET    | Paginated transaction list | Transactions page              |
| `/customers/:id/goals`               | GET    | Budget goals               | Overview goals section         |
| `/customers/:id/filters`             | GET    | Filter metadata            | Transaction filters            |

**Query Keys**: See [docs/state-management.md](docs/state-management.md) for React Query cache strategy.

## Accessibility

Built to WCAG 2.1 AA standards:

- Keyboard navigation with visible focus indicators
- Screen reader support with semantic HTML and ARIA labels
- Color contrast ratios meet 4.5:1 minimum
- Respects `prefers-reduced-motion` for animations
- Form labels and error announcements
- Sortable table columns with `aria-sort`

Tested with axe DevTools and Playwright's accessibility scanner.

## Performance

### Targets

- **LCP**: < 2.5s (Largest Contentful Paint)
- **INP**: < 200ms (Interaction to Next Paint)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Optimizations

- Code splitting with React Router lazy loading
- Charts loaded on-demand
- React Query caching with stale-while-revalidate
- nginx cache headers for static assets
- Bundle kept under 500KB gzipped

Web Vitals are sent to Sentry for monitoring.

## Security

### Headers (nginx config)

- `Content-Security-Policy` - Restricts script/style sources
- `Strict-Transport-Security` - HSTS with 1-year max-age
- `X-Frame-Options: SAMEORIGIN` - Clickjacking protection
- `X-Content-Type-Options: nosniff`
- `Permissions-Policy` - Disables camera, microphone, geolocation

### Auth

- AWS Amplify Cognito for user management
- Session tokens in secure cookies
- Cross-tab logout via BroadcastChannel API

Run `yarn audit` before releases.

## AI Use Disclaimer

This app doesn't use AI to generate financial advice. All insights are calculated from your transaction data using standard formulas.

**Planned features** (not implemented yet):

1. Receipt OCR with Google Gemini Vision API
2. Natural language chatbot for spending queries (e.g., "How much did I spend on groceries?")

These will be opt-in features with clear data handling disclosures.

## Roadmap

### Next Up

- Performance budgets in CI
- More E2E test coverage
- Analytics integration (PostHog or Mixpanel)

### Later

- AWS RUM for production metrics
- Storybook for component docs
- Advanced filtering (amount ranges, merchant search)

### Future

- Receipt scanning with Gemini Vision
- Natural language chatbot
- Multi-currency support

## Documentation

- [Architecture Overview](docs/architecture.md) - System design, data flow, Mermaid diagrams
- [API Contract](docs/api-contract.md) - Endpoint specs, request/response examples
- [State Management](docs/state-management.md) - React Query patterns, cache strategy
- [Design System](docs/design-system.md) - Tokens, components, usage guidelines
- [Testing Guide](docs/testing.md) - Unit, integration, E2E test patterns
- [MSW Mocking](docs/msw-mocking.md) - Adding scenarios, simulating errors
- [Accessibility](docs/accessibility.md) - Standards, testing, keyboard nav
- [Performance](docs/performance.md) - Budgets, profiling, optimization checklist
- [Security](docs/security.md) - Headers, CSP, auth, audit process
- [Deployment](docs/deployment.md) - Docker, Amplify, production runbook
- [Troubleshooting](docs/troubleshooting.md) - Common issues, retry flow, Docker gotchas

**Architecture Decision Records**: See [docs/decisions/](docs/decisions/) for trade-offs and rationale.

## Contributing

1. Branch from `develop`
2. Run tests locally (`yarn test`, `npx playwright test`)
3. Submit PR (CI will run lint, type-check, tests, build)

Pre-commit hooks will run automatically via Husky.

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Maintained by**: Aya Mahlat  
**Last Updated**: December 2024
