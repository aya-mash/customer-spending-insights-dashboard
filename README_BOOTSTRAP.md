# Repository Bootstrap Overview

This document summarizes the foundational workflows and policies.

## GitFlow Branches
- `main`: Production.
- `develop`: Ongoing integration.
- `feature/*`: New work → PR into `develop`.
- `release/*`: Stabilization → merged to `main` then back to `develop`.
- `hotfix/*`: Urgent production fixes → merge to `main` and back to `develop`.

## CI Checks Workflow
`checks` runs on PRs to `develop`, `release/*`, and `hotfix/*` branches. It installs dependencies and conditionally runs lint, type-check, build, and tests (tolerant of missing scripts). This workflow will become a required status check.

## Deployment Strategy
The project is configured for **AWS Amplify** deployment with automatic CI/CD:
- Continuous deployment from `main` branch → Production environment
- Continuous deployment from `develop` branch → Staging/Preview environment
- Pull request previews for feature branches

Build configuration is defined in `amplify.yml` in the repository root. Amplify provides:
- Automatic builds on every push
- CDN distribution with SSL/TLS
- Custom domain support
- Branch-based environments
- Build caching for faster deployments

No manual secrets configuration needed - Amplify handles authentication automatically.

## Semantic PR Titles
`semantic-pull-request` workflow enforces Conventional Commit style titles (e.g., `feat(scope): description`).

## Ownership & Updates
All files owned by @aya-mash via `CODEOWNERS`.
Dependabot updates npm and GitHub Actions weekly.

## Contribution & Releases
See `CONTRIBUTING.md` for detailed process including release tagging (`vX.Y.Z`).

---
This bootstrap ensures a production-grade foundation for collaboration, quality, and secure deployments.
