# ADR-0001: Build Tool - Vite

**Status**: Accepted  
**Date**: 2024-11-15  
**Deciders**: Tech Lead, Senior Frontend Engineer

## Context

Need a modern build tool for React + TypeScript with fast dev experience and optimized production builds. Must support HMR, code splitting, and integration with testing tools.

## Decision

Chosen **Vite 7.1** over Create React App (CRA) and Webpack.

## Rationale

### Why Vite?

- **Dev Speed**: Sub-second HMR via native ESM (vs. Webpack's bundled approach)
- **Build Performance**: esbuild for dependencies, Rollup for production (5-10x faster than Webpack)
- **Modern Defaults**: ES modules, tree-shaking, code splitting out of the box
- **Plugin Ecosystem**: Official React plugin with Fast Refresh support
- **TypeScript**: First-class support without extra configuration

### Why Not CRA?

- Deprecated/unmaintained (last major update 2021)
- Slow dev server (Webpack-based)
- Difficult to customize without ejecting
- Large bundle sizes without manual optimization

### Why Not Webpack Directly?

- Complex configuration for modern features (HMR, code splitting)
- Slower dev server and build times
- More boilerplate for TypeScript + React setup

## Trade-offs

**Advantages**:

- ✅ Instant server start (< 1s vs. 30s+ with CRA)
- ✅ HMR without full page reload (preserves React state)
- ✅ Optimized production builds (automatic chunk splitting)
- ✅ Minimal configuration (`vite.config.ts` < 100 lines)

**Disadvantages**:

- ❌ Requires manual chunk configuration for vendor splitting (see `vite.config.ts`)
- ❌ Different dev/prod module systems (ESM dev, bundled prod) can cause edge cases
- ❌ Smaller community than Webpack (but growing rapidly)

## Implementation Details

### Manual Chunk Configuration

```typescript
// vite.config.ts
output: {
  manualChunks: (id) => {
    if (id.includes("react")) return "react-vendor";
    if (id.includes("recharts")) return "charts-vendor";
    if (id.includes("@aws-amplify")) return "aws-vendor";
    return "vendor";
  };
}
```

### Current Bundle Sizes

- `index.js`: ~120KB gzipped (app code)
- `react-vendor.js`: ~140KB gzipped (React + React DOM)
- `charts-vendor.js`: ~100KB gzipped (Recharts)
- **Total**: ~380KB gzipped (under 500KB target)

## Consequences

### Positive

- Development velocity increased (instant HMR)
- Production bundle size decreased by 30% vs. CRA baseline
- TypeScript type-checking integrated into build
- Easy to add plugins (PWA, bundle analyzer)

### Negative

- Team needed to learn Vite-specific patterns (e.g., `import.meta.env` vs. `process.env`)
- AWS Amplify initialization race condition with code splitting (workaround: disabled splitting temporarily)

## Future Considerations

- Monitor Vite releases for SSR support (potential future enhancement)
- Evaluate Turbopack when stable (Vercel's Rust-based bundler)

## Last Updated

December 2024
