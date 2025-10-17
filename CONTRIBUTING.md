# Contributing

## Git Flow Branching Model
We use GitFlow to manage releases and ongoing development:
- `main`: Production-ready code. Only updated via merge from a `release/*` branch or hotfix.
- `develop`: Integration branch for features. All feature work branches off here.
- `feature/*`: New features or enhancements. Merge into `develop` via PR.
- `release/*`: Preparation for a production release. Branched from `develop` when we stabilize for version `X.Y.Z`. Final fixes occur here, then merged into `main` and back into `develop`.
- `hotfix/*`: Urgent fixes on production. Branch from `main`, then merged back into both `main` and `develop`.

## Conventional Commits
All commits (and PR titles) must follow Conventional Commits:
`<type>(<scope>): <description>`
Examples:
- `feat(auth): add MFA setup screen`
- `fix(chart): correct axis label overflow`
- `chore(deps): update react-router-dom`
Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `perf`, `ci`, `build`, `revert`.

## Pull Request Guidelines
1. Link the related Issue (e.g., `Closes #123`).
2. Use a Conventional Commit style PR title.
3. Ensure the CI `checks` workflow passes.
4. At least one approval required; ask for domain review when needed.
5. Update tests and docs where applicable.
6. Avoid committing secrets or sensitive data.
7. Keep PRs small and focused; large changes should be split.

## Release Flow
1. Create `release/x.y.z` from `develop` when ready.
2. Perform final QA and only allow `fix:`/`chore:` commits or doc updates.
3. Merge `release/x.y.z` into `main` using a PR titled `release: vX.Y.Z`.
4. Tag the merge commit: `vX.Y.Z`.
5. Back-merge `main` into `develop` to sync changes.
6. Announce release and update any deployment notes.

## Testing & Quality
- Prefer unit tests with Vitest and React Testing Library.
- Mock network calls using MSW; do not rely on external services in tests.
- Ensure accessibility (a11y) for UI components.

## Local Setup
1. Install dependencies: `yarn install`.
2. Start dev server: `yarn dev`.
3. Run tests: `yarn test`.

## Code Owners
All paths are owned by @aya-mash; please request review as needed.

## Security
Do not open public issues for sensitive vulnerabilities; follow `SECURITY.md`.

Thanks for contributing! 🎉
