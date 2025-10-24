# Architecture Overview

This document describes the system architecture, component structure, data flow patterns, and deployment topology.

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Component Hierarchy](#component-hierarchy)
- [Data Flow](#data-flow)
- [Router & Lazy Loading](#router--lazy-loading)
- [Build & Runtime Topology](#build--runtime-topology)
- [Module Boundaries](#module-boundaries)

## High-Level Architecture

The application follows a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────┐
│            Presentation Layer                    │
│  (React components, routing, UI interactions)   │
├─────────────────────────────────────────────────┤
│         Application/Business Logic               │
│    (Custom hooks, context providers, utils)     │
├─────────────────────────────────────────────────┤
│            Data Access Layer                     │
│   (React Query, Axios client, MSW handlers)     │
├─────────────────────────────────────────────────┤
│         Infrastructure/Platform                  │
│  (Vite, nginx, Docker, AWS Amplify, Sentry)     │
└─────────────────────────────────────────────────┘
```

### Design Principles

1. **Component Composition**: Small, focused components over large monoliths
2. **Declarative Data Fetching**: React Query hooks at component level
3. **Type Safety**: Strict TypeScript, no `any` types, shared interfaces
4. **Progressive Enhancement**: Works without JS (static shell), enhanced with PWA
5. **Performance First**: Code splitting, lazy loading, optimized bundles

## Component Hierarchy

```mermaid
graph TD
    App[App.tsx] --> Auth[Authenticator]
    Auth --> Theme[ThemeProvider]
    Theme --> Query[QueryClientProvider]
    Query --> Router[Router]

    Router --> Layout[DashboardLayout]
    Layout --> Header[Header with Avatar]
    Layout --> Main[Main Content Area]
    Layout --> BottomNav[Bottom Navigation - Mobile]

    Main --> Overview[OverviewRoute - Lazy]
    Main --> Insights[InsightsRoute - Lazy]
    Main --> Transactions[TransactionsRoute - Lazy]
    Main --> Profile[Profile - Lazy]

    Overview --> SummaryCards[Summary Cards]
    Overview --> CategoryChart[Category Breakdown]
    Overview --> Goals[Budget Goals]

    Insights --> Tabs[Tab Navigation]
    Tabs --> DonutChart[Interactive Donut Chart]
    Tabs --> TrendsChart[Line Chart - Lazy]

    Transactions --> FilterDialog[Filter Dialog - Mobile]
    Transactions --> Table[Data Table - Desktop]
    Transactions --> Cards[Transaction Cards - Mobile]
    Transactions --> DetailsDialog[Transaction Details Dialog]

    Profile --> ProfileDrawer[Profile Drawer - Desktop]
    Profile --> ProfilePage[Profile Page - Mobile]

    style App fill:#e1f5ff
    style Layout fill:#fff4e6
    style Overview fill:#e8f5e9
    style Insights fill:#e8f5e9
    style Transactions fill:#e8f5e9
    style Profile fill:#e8f5e9
```

## Data Flow

### Server State Flow (React Query)

```mermaid
sequenceDiagram
    participant User
    participant Component
    participant Hook as Custom Hook
    participant RQ as React Query
    participant Client as Axios Client
    participant MSW as MSW/API

    User->>Component: Trigger action (e.g., change period)
    Component->>Hook: Call useInsightsData(period)
    Hook->>RQ: useQuery(queryKey, queryFn)

    alt Cache Hit (fresh)
        RQ-->>Hook: Return cached data
        Hook-->>Component: { data, isLoading: false }
    else Cache Miss or Stale
        RQ->>Client: Execute queryFn
        Client->>MSW: HTTP GET request
        MSW-->>Client: JSON response
        Client-->>RQ: Normalized data
        RQ->>RQ: Update cache
        RQ-->>Hook: { data, isLoading: false }
        Hook-->>Component: Render with new data
    end

    Component->>User: Display updated UI
```

### Client State Flow (React Context)

```mermaid
graph LR
    ThemeContext[Theme Context] --> Components[Components]
    DashboardContext[Dashboard Context] --> Components
    AuthContext[Auth Context - Amplify] --> Components

    LocalStorage[localStorage] --> ThemeContext
    ThemeContext --> LocalStorage

    BroadcastChannel[BroadcastChannel] --> AuthContext
    AuthContext --> BroadcastChannel

    style ThemeContext fill:#fff3e0
    style DashboardContext fill:#e8eaf6
    style AuthContext fill:#f3e5f5
```

**State Ownership Rules**:

- **Server state**: React Query (cache, refetch, mutations)
- **UI state**: Component state (`useState`)
- **Shared UI state**: Context (theme, modal visibility)
- **Form state**: Local state with controlled inputs
- **URL state**: React Router (filters, active tab)

## Router & Lazy Loading

```mermaid
graph TD
    Start([App Mount]) --> Init[Initialize Amplify]
    Init --> CheckAuth{Authenticated?}

    CheckAuth -->|No| Login[Authenticator Screen]
    CheckAuth -->|Yes| LoadRouter[Load Router]

    LoadRouter --> DashLayout[Dashboard Layout - Lazy]

    DashLayout --> Route1{Route: /}
    DashLayout --> Route2{Route: /insights}
    DashLayout --> Route3{Route: /transactions}
    DashLayout --> Route4{Route: /profile}

    Route1 -->|Lazy Load| Overview[OverviewRoute.tsx]
    Route2 -->|Lazy Load| Insights[InsightsRoute.tsx]
    Route3 -->|Lazy Load| Transactions[TransactionsRoute.tsx]
    Route4 -->|Lazy Load| Profile[Profile.tsx]

    Overview --> Charts1[Lazy Load Charts]
    Insights --> Charts2[Lazy Load TrendsChart]
    Transactions --> Dialog[TransactionDetailsDialog]
    Dialog --> PDF[Lazy Load jspdf]

    style Start fill:#e8f5e9
    style Login fill:#ffebee
    style Overview fill:#e3f2fd
    style Insights fill:#e3f2fd
    style Transactions fill:#e3f2fd
    style Profile fill:#e3f2fd
```

### Route Configuration

Routes are defined in `src/app/config/dashboard.config.ts`:

```typescript
{
  path: '/',
  component: () => import('../routes/OverviewRoute'),
  canActivate: () => isAuthenticated(), // Optional guard
  fallback: <LoadingSpinner /> // Optional loading state
}
```

**Lazy Loading Strategy**:

1. **Route-level**: All page components lazy-loaded via `React.lazy()`
2. **Chart-level**: Heavy libraries (Recharts) lazy-loaded on demand
3. **Feature-level**: Transaction details dialog + jspdf only when opened

## Build & Runtime Topology

### Development Flow

```mermaid
graph LR
    Dev[Developer] -->|yarn dev| Vite[Vite Dev Server]
    Vite -->|HMR| Browser

    Browser -->|HTTP Request| MSW[MSW Service Worker]
    MSW -->|Mock Response| Browser

    Vite -->|Proxy /api| MSW

    Browser -->|WebSocket| Vite
    Vite -->|File Watch| FS[File System]

    style Vite fill:#646cff
    style MSW fill:#ff6a33
    style Browser fill:#e8f5e9
```

### Production Flow

```mermaid
graph TD
    Source[Source Code] -->|yarn build| Vite[Vite Build]
    Vite -->|TypeScript| TSC[tsc Compiler]
    Vite -->|Bundling| Rollup

    Rollup -->|Code Split| React[react-vendor.js]
    Rollup -->|Code Split| Router[router-vendor.js]
    Rollup -->|Code Split| Charts[charts-vendor.js]
    Rollup -->|Code Split| AWS[aws-vendor.js]
    Rollup -->|Code Split| Main[index.js]

    React --> Dist[dist/]
    Router --> Dist
    Charts --> Dist
    AWS --> Dist
    Main --> Dist

    Dist -->|COPY| Docker[Docker Image]
    Docker -->|nginx| Container[Running Container]

    Container -->|Port 8080| Amplify[AWS Amplify]
    Amplify -->|HTTPS| Users[End Users]

    style Vite fill:#646cff
    style Docker fill:#2496ed
    style Amplify fill:#ff9900
```

### Deployment Pipeline

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GH as GitHub
    participant Actions as GitHub Actions
    participant Amplify as AWS Amplify
    participant Users

    Dev->>GH: git push develop
    GH->>Actions: Trigger checks workflow
    Actions->>Actions: yarn install
    Actions->>Actions: tsc (type check)
    Actions->>Actions: eslint (lint)
    Actions->>Actions: vitest (test)
    Actions->>Actions: vite build

    alt Checks Pass
        Actions-->>GH: ✓ Success
        GH->>Amplify: Webhook trigger
        Amplify->>Amplify: Clone repo
        Amplify->>Amplify: yarn install
        Amplify->>Amplify: npx msw init public
        Amplify->>Amplify: yarn build:staging
        Amplify->>Amplify: Deploy to CDN
        Amplify-->>Users: Live on develop.*.amplifyapp.com
    else Checks Fail
        Actions-->>GH: ✗ Failure
        GH-->>Dev: Block merge
    end
```

## Module Boundaries

### Directory Structure

```
src/
├── app/                  # Application setup & routing
│   ├── config/           # Route configuration
│   ├── routes/           # Page-level route components
│   └── router.tsx        # Router factory
│
├── components/           # Shared presentational components
│
├── contexts/             # React Context providers
│   ├── auth/             # Authentication context (Amplify)
│   ├── dashboard/        # Dashboard-specific state
│   └── theme/            # Theme context (light/dark)
│
├── data/                 # Data layer
│   ├── client.ts         # Axios instance + API functions
│   └── models.ts         # TypeScript interfaces
│
├── design-system/        # Design system components & tokens
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Design system hooks
│   └── tokens.ts         # Design tokens (colors, spacing)
│
├── features/             # Feature modules (domain-driven)
│   ├── insights/         # Insights page feature
│   ├── overview/         # Overview dashboard feature
│   ├── profile/          # Profile management
│   └── transactions/     # Transactions feature
│
├── hooks/                # Shared custom hooks
│
├── i18n/                 # Internationalization
│   ├── config.ts         # i18next setup
│   └── locales/          # Translation files
│
├── layouts/              # Layout components
│   └── dashboard/        # Dashboard layout (header, nav)
│
├── lib/                  # Utility libraries
│   ├── categoryUtils.tsx # Category icon mapping
│   ├── chartConfig.ts    # Chart configuration
│   └── contrast.ts       # Color contrast calculations
│
├── mocks/                # MSW mock data layer
│   ├── browser.ts        # Browser MSW setup
│   ├── factories.ts      # Mock data factories
│   ├── handlers.ts       # API endpoint handlers
│   └── server.ts         # Node MSW setup (tests)
│
├── pages/                # Standalone pages (not in dashboard)
│   ├── NotFound.tsx      # 404 page
│   └── Profile.tsx       # Mobile profile page
│
├── styles/               # Global styles
│   ├── base.css          # Reset + global styles
│   └── tokens.css        # CSS custom properties
│
├── test/                 # Test utilities
│   ├── setup.ts          # Vitest setup
│   └── utils.tsx         # Test helpers (renderWithProviders)
│
└── utils/                # Utility functions
    ├── accessibility.ts  # a11y helpers
    ├── currency.ts       # ZAR formatting
    ├── dates.ts          # Date formatting
    ├── logger.ts         # Console logging
    ├── performance.ts    # Web Vitals
    ├── pwa.ts            # Service worker registration
    ├── sentry.ts         # Error tracking
    └── webVitals.ts      # Performance monitoring
```

### Import Rules

1. **No circular dependencies**: Enforced by ESLint
2. **Feature isolation**: Features only import from `src/design-system`, `src/data`, `src/utils`
3. **Design system purity**: No imports from features or pages
4. **Data layer independence**: `src/data` has no UI dependencies

### Dependency Graph

```mermaid
graph TD
    App[app/] --> Features[features/]
    App --> Layouts[layouts/]
    App --> Pages[pages/]

    Features --> DS[design-system/]
    Features --> Data[data/]
    Features --> Utils[utils/]
    Features --> Hooks[hooks/]

    Layouts --> DS
    Layouts --> Contexts[contexts/]

    Pages --> DS
    Pages --> Features

    DS --> Tokens[tokens.ts]

    Data --> Models[models.ts]

    Mocks[mocks/] --> Data
    Mocks --> Factories[factories.ts]

    style App fill:#e1f5ff
    style Features fill:#f3e5f5
    style DS fill:#e8f5e9
    style Data fill:#fff3e0
```

## Request/Response Flow

### Successful Request

```mermaid
sequenceDiagram
    participant UI as Component
    participant Hook as useInsightsData()
    participant RQ as React Query
    participant Axios as Axios Client
    participant API as MSW / Backend API

    UI->>Hook: Mount component
    Hook->>RQ: useQuery({ queryKey, queryFn })
    RQ->>RQ: Check cache

    alt Fresh cache
        RQ-->>Hook: Return cached data
    else Stale or no cache
        RQ->>Axios: queryFn() → client.categories()
        Axios->>API: GET /customers/:id/spending/categories
        API-->>Axios: 200 OK + JSON
        Axios->>Axios: Normalize error (if any)
        Axios-->>RQ: Parsed data
        RQ->>RQ: Update cache
        RQ-->>Hook: { data, isLoading: false }
    end

    Hook-->>UI: Render with data
```

### Error Handling Flow

```mermaid
sequenceDiagram
    participant UI
    participant RQ as React Query
    participant Axios
    participant API
    participant ErrorBoundary
    participant Sentry

    UI->>RQ: useQuery()
    RQ->>Axios: Fetch data
    Axios->>API: GET request

    alt Network Error
        API-->>Axios: Network timeout
        Axios->>Axios: normalizeError()
        Axios-->>RQ: Error object
        RQ->>RQ: Retry (exponential backoff)
        RQ->>Axios: Retry attempt
    else 404 After Idle (MSW disabled)
        API-->>Axios: 404 Not Found
        Axios-->>RQ: Error
        RQ-->>UI: { error, isError: true }
        UI->>UI: Detect idle 404
        UI->>UI: Reset MSW worker
        UI->>RQ: Retry query
    else 500 Server Error
        API-->>Axios: 500 Internal Server Error
        Axios-->>RQ: Error
        RQ-->>UI: { error }
        UI->>ErrorBoundary: Throw error (critical)
        ErrorBoundary->>Sentry: Log error
        ErrorBoundary-->>UI: Fallback UI
    end
```

## State Synchronization

### Cross-Tab Logout

```mermaid
sequenceDiagram
    participant Tab1 as Tab 1
    participant Channel as BroadcastChannel
    participant Tab2 as Tab 2
    participant Tab3 as Tab 3

    Tab1->>Tab1: User clicks "Sign Out"
    Tab1->>Channel: postMessage({ type: 'logout' })
    Tab1->>Tab1: Navigate to /login

    Channel-->>Tab2: Receive 'logout' message
    Tab2->>Tab2: Clear auth state
    Tab2->>Tab2: Navigate to /login

    Channel-->>Tab3: Receive 'logout' message
    Tab3->>Tab3: Clear auth state
    Tab3->>Tab3: Navigate to /login
```

## Performance Considerations

### Code Splitting Strategy

- **Route-level**: All page components lazy-loaded (reduces initial bundle)
- **Library-level**: Heavy deps (Recharts, jspdf) loaded on demand
- **Vendor chunking**: React, Router, AWS Amplify in separate chunks (better caching)

### Cache Strategy

- **React Query**: Stale-while-revalidate (5min stale time, show stale while fetching)
- **Browser**: ServiceWorker caches static assets (HTML, JS, CSS, images)
- **nginx**: Far-future expires headers for static assets (1 year)

### Bundle Analysis

Run `yarn build` and check `dist/stats.html` (generated by `rollup-plugin-visualizer`):

- **Target**: Total JS < 500KB gzipped
- **Current**: ~380KB gzipped (main bundle + vendors)

## Last Updated

December 2024
