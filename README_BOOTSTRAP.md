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

## Deployment Workflow
`deploy-aws.yml` deploys:
- From `develop` → Integration environment (S3 + CloudFront). Uses secrets: `AWS_ROLE_ARN`, `S3_BUCKET_INT`, `CF_DIST_ID_INT`.
- From `main` → Production environment. Uses secrets: `AWS_ROLE_ARN`, `S3_BUCKET_PROD`, `CF_DIST_ID_PROD`.
OIDC is used for secure AWS auth (no long-lived keys). Region: `af-south-1`.

## Semantic PR Titles
`semantic-pull-request` workflow enforces Conventional Commit style titles (e.g., `feat(scope): description`).

## Ownership & Updates
All files owned by @aya-mash via `CODEOWNERS`.
Dependabot updates npm and GitHub Actions weekly.

## Contribution & Releases
See `CONTRIBUTING.md` for detailed process including release tagging (`vX.Y.Z`).

---
This bootstrap ensures a production-grade foundation for collaboration, quality, and secure deployments.
