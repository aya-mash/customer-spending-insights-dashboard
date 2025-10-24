# Documentation Index

Navigate the docs based on what you need to do.

## Quick Links by Role

### New Developers

Getting started:

1. [README](../README.md) - Setup and overview
2. [Architecture](architecture.md) - How the app is structured
3. [State Management](state-management.md) - Data flow patterns
4. [Testing](testing.md) - Running and writing tests
5. [MSW Mocking](msw-mocking.md) - Working with mock data

### Designers

Design system documentation:

- [Design System](design-system.md) - Tokens, components, guidelines
- [Accessibility](accessibility.md) - Standards we follow

### DevOps/SRE

Deployment and ops:

- [Deployment](deployment.md) - Docker, Amplify, runbook
- [CI/CD](ci-cd.md) - GitHub Actions
- [Security](security.md) - Headers, CSP, audits
- [Logging & Monitoring](logging-monitoring.md) - Sentry setup

### QA/Testing

Testing resources:

- [Testing Guide](testing.md) - Test patterns
- [MSW Mocking](msw-mocking.md) - Simulating errors
- [Accessibility Testing](accessibility.md) - a11y tests

### Product/PM

Product documentation:

- [README](../README.md) - Features
- [Roadmap](roadmap.md) - What's planned
- [API Contract](api-contract.md) - Backend requirements

## Core Documentation

### Architecture & Design

- [Architecture](architecture.md) - Component structure, data flow, build topology
- [Design System](design-system.md) - Design tokens, component inventory
- [Data Models](data-models.md) - TypeScript interfaces, API response shapes

### Implementation Guides

- [State Management](state-management.md) - React Query patterns, cache keys
- [API Contract](api-contract.md) - 7 endpoints with request/response examples
- [Internationalization](internationalization.md) - i18n setup, adding languages
- [MSW Mocking](msw-mocking.md) - Mock data factories and handlers

### Quality & Performance

- [Testing](testing.md) - Unit, integration, E2E test patterns
- [Accessibility](accessibility.md) - WCAG compliance, keyboard nav, ARIA
- [Performance](performance.md) - Bundle budgets, lazy loading, Web Vitals
- [Security](security.md) - CSP, headers, authentication, cross-tab logout

### Operations

- [Deployment](deployment.md) - Amplify, Docker, environment variables
- [CI/CD](ci-cd.md) - GitHub Actions workflows
- [Logging & Monitoring](logging-monitoring.md) - Sentry setup, breadcrumbs
- [Troubleshooting](troubleshooting.md) - Common issues and solutions

### Decision Records

Architecture Decision Records (ADRs) documenting key technical choices:

- [ADR-0001: Build Tool (Vite)](decisions/adr-0001-build-tool-vite.md)
- [ADR-0002: Server State (React Query)](decisions/adr-0002-server-state-react-query.md)
- [ADR-0003: API Mocking (MSW)](decisions/adr-0003-api-mocking-msw.md)
- [ADR-0004: Charts Library](decisions/adr-0004-charts-library.md)
- [ADR-0005: PWA with Vite](decisions/adr-0005-pwa-with-vite.md)
- [ADR-0006: Observability (Sentry)](decisions/adr-0006-observability-sentry.md)

### Reference

- [Roadmap](roadmap.md) - Short/medium/long-term plans
- [Glossary](glossary.md) - Technical terms and acronyms

## Diagram Index

### Mermaid Diagrams

All diagrams are in Mermaid format for easy editing and version control:

1. **Component & Data Flow** ([architecture.md](architecture.md))
   - React component hierarchy
   - Server state flow (API → React Query → Components)
   - Client state flow (Context providers)

2. **Router & Lazy Loading** ([architecture.md](architecture.md))
   - Route tree with lazy-loaded components
   - Auth guard flow

3. **Build & Runtime Topology** ([architecture.md](architecture.md))
   - Development: Vite HMR + MSW
   - Production: nginx + Docker + Amplify

4. **Request/Response Flow** ([architecture.md](architecture.md))
   - User interaction → React Query → Axios → MSW/API
   - Error handling and retry logic

## Contributing to Docs

### Documentation Standards

- Use clear, direct language (avoid jargon)
- Include code examples where helpful
- Link to related docs using relative paths
- Update "Last updated" section when making changes
- No confidential secrets or credentials

### Adding New Documentation

1. Create file in appropriate `docs/` subdirectory
2. Add entry to this index
3. Link from related docs
4. Update `README.md` if user-facing

### Mermaid Diagrams

- Use Mermaid for all diagrams (text-based, version-controllable)
- Test diagrams at [Mermaid Live Editor](https://mermaid.live/)
- Keep complexity low (max 15-20 nodes per diagram)

## Getting Help

- **Bug reports**: Use `.github/ISSUE_TEMPLATE/bug_report.md`
- **Feature requests**: Use `.github/ISSUE_TEMPLATE/feature_request.md`
- **Questions**: Ask in team Slack channel or open a discussion

## Last Updated

December 2024
