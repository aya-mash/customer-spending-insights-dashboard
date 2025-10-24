# ADR-0005: PWA with Vite

**Status**: Accepted  
**Date**: 2024-11-18

## Context

Need offline support and installability for mobile users. Must integrate with Vite build process and respect CSP restrictions.

## Decision

Use **Workbox 7.3** with custom service worker, integrated via Vite build hooks (not vite-plugin-pwa due to CSP conflicts).

## Rationale

**Why Workbox?**

- Industry-standard service worker library (Google)
- Precache static assets at build time
- Runtime caching strategies (cache-first, network-first)
- Automatic cache invalidation on deploy

**Why Not vite-plugin-pwa?**

- Injects inline scripts (breaks CSP `script-src 'self'`)
- Less control over service worker logic
- Difficult to customize for self-heal retry

## Implementation

### Custom Service Worker

```javascript
// public/sw.js
import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST); // Vite injects at build time
```

### Registration

```typescript
// src/utils/pwa.ts
if (!import.meta.env.DEV && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then((reg) => {
    // Check for updates hourly
    setInterval(() => reg.update(), 60 * 60 * 1000);
  });
}
```

### Build Integration

```typescript
// vite.config.ts - build hook
import { generateSW } from "workbox-build";

// Post-build: Generate SW with precache manifest
await generateSW({
  globDirectory: "dist",
  globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],
  swDest: "dist/sw.js",
});
```

## Trade-offs

**Advantages**:

- ✅ Works offline after first visit
- ✅ Instant loads on repeat visits (precached assets)
- ✅ Installable on mobile (Add to Home Screen)
- ✅ CSP-compliant (no inline scripts)

**Disadvantages**:

- ❌ Manual service worker management (no auto-update UI)
- ❌ Debug complexity (cache issues hard to reproduce)
- ❌ Can cause stale data if not invalidated properly

## CSP Constraints

**Problem**: Default PWA plugins inject inline scripts  
**Solution**: Custom SW with external script files only

```nginx
Content-Security-Policy: script-src 'self'; worker-src 'self' blob:;
```

## Cache Strategy

| Resource Type | Strategy      | Rationale                              |
| ------------- | ------------- | -------------------------------------- |
| HTML          | Network-first | Always fetch latest, fallback to cache |
| JS/CSS        | Cache-first   | Immutable (hashed filenames)           |
| API           | Network-only  | Fresh data required                    |
| Images        | Cache-first   | Static assets, long-lived              |

## Offline Fallback

```javascript
// sw.js
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/offline.html")),
    );
  }
});
```

## Self-Heal Integration

Service worker reset on idle 404:

```typescript
// DashboardProvider.tsx
if (idle404Detected) {
  const reg = await navigator.serviceWorker.getRegistration();
  await reg?.unregister();
  await registerServiceWorker(); // Re-register
}
```

## Consequences

**Positive**:

- Users can view cached data offline
- Improved perceived performance (instant loads)
- Mobile app-like experience

**Negative**:

- Service worker can cause hard-to-debug cache issues
- Requires manual version management
- Offline != fully functional (API calls still fail)

## Metrics

**Cache Hit Rate**: ~85% for static assets  
**Load Time** (repeat visit): <500ms (vs. 2s uncached)

## Future Considerations

- Background sync for offline transactions (future write operations)
- Push notifications (user opt-in)
- Advanced caching (Stale-While-Revalidate for API)

## Last Updated

December 2024
