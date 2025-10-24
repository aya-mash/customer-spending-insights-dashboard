# Quick Reference: Production Features

## 🎯 Sentry Error Tracking

### Setup
1. Get your Sentry DSN from https://sentry.io
2. Add to `.env.production`:
   ```bash
   VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
   ```

### Usage in Code
```typescript
import { captureError, captureMessage, setUser, addBreadcrumb } from '@/utils/sentry';

// Capture errors with context
try {
  // risky operation
} catch (error) {
  captureError(error, { component: 'MyComponent', action: 'fetchData' });
}

// Log messages
captureMessage('Payment processing started', 'info');

// Identify users (for support)
setUser({ id: user.id, email: user.email, username: user.name });

// Add breadcrumbs for debugging
addBreadcrumb({
  category: 'user-action',
  message: 'User clicked export button',
  level: 'info',
});
```

### Features
- ✅ Automatic error capture
- ✅ Performance monitoring (10% sampling)
- ✅ Session replay (10% sessions, 100% errors)
- ✅ User context and breadcrumbs
- ✅ Privacy-first (masks sensitive data)

---

## 📱 PWA Features

### Installation
Users can install the app on:
- **Desktop**: Chrome, Edge, Safari → "Install App" prompt
- **iOS**: Safari → Share → "Add to Home Screen"
- **Android**: Chrome → Menu → "Install App"

### Offline Support
- Works without internet connection
- Caches API responses (1 hour)
- Shows offline fallback page
- Auto-syncs when online

### Service Worker
```javascript
// Manual update check (if needed)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.update();
  });
}
```

### Caching Strategy
- **API calls**: Network-first (fallback to cache)
- **Static assets**: Cache-first (update in background)
- **Navigation**: Offline page when unavailable

---

## 📊 Web Vitals Monitoring

### Metrics Tracked
- **CLS** (Cumulative Layout Shift) - Target: < 0.1
- **LCP** (Largest Contentful Paint) - Target: < 2.5s
- **FID** (First Input Delay) - Target: < 100ms
- **FCP** (First Contentful Paint) - Target: < 1.8s
- **TTFB** (Time to First Byte) - Target: < 600ms
- **INP** (Interaction to Next Paint) - Target: < 200ms

### View Results
- Development: Check browser console
- Production: View in Sentry Performance tab

---

## 🔒 Security Headers

### Configured in `nginx.conf`
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
```

### Testing
```bash
curl -I https://your-domain.com
```

---

## ✅ Pre-commit Hooks

### What's Checked
- ESLint fixes and validation
- Prettier formatting
- TypeScript type checking
- JSON/Markdown formatting

### Bypass (if needed)
```bash
git commit --no-verify -m "message"
```

### Manual Run
```bash
yarn lint-staged
```

---

## 🧪 E2E Tests

### Run All Tests
```bash
yarn test:e2e
```

### Run Specific Test
```bash
npx playwright test tests/e2e/auth.spec.ts
```

### Debug Mode
```bash
npx playwright test --debug
```

### View Report
```bash
npx playwright show-report
```

### Tests Cover
- Authentication flows
- Dashboard navigation
- Transactions (filtering, sorting, pagination)
- Insights visualization
- Settings management
- Theme switching
- Responsive design
- Accessibility

---

## 🚀 Deployment Commands

### Build for Production
```bash
yarn build
```

### Preview Production Build
```bash
yarn preview
```

### Deploy to AWS Amplify
```bash
git push origin main  # Automatic deployment configured
```

### Manual Deployment
```bash
# Build
yarn build

# Deploy dist/ folder to your hosting
# Ensure nginx.conf is configured
# Verify environment variables are set
```

---

## 📦 Bundle Analysis

### Current Sizes
- Main: 91KB (27KB gzip) ✅
- React vendor: 353KB (112KB gzip)
- Charts: 195KB (52KB gzip)
- AWS: 263KB (60KB gzip)

### View Bundle Composition
```bash
yarn build
# Check dist/stats.html (if visualizer re-enabled)
```

---

## 🔧 Environment Variables

### Required for Production
```bash
VITE_ENV=production
VITE_API_BASE_URL=https://api.your-domain.com
VITE_ENABLE_MOCKS=false
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### Optional
```bash
VITE_APP_NAME=Your App Name
VITE_AWS_USER_POOL_ID=us-east-1_xxxxx
VITE_AWS_USER_POOL_CLIENT_ID=xxxxx
VITE_AWS_REGION=us-east-1
```

---

## 🐛 Troubleshooting

### Service Worker Not Updating
```javascript
// Force update in console
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
  location.reload();
});
```

### Sentry Not Reporting
- Verify `VITE_SENTRY_DSN` is set
- Check browser console for Sentry logs
- Ensure `VITE_ENV=production`

### Build Errors
```bash
# Clean and rebuild
rm -rf dist node_modules
yarn install
yarn build
```

### PWA Not Installable
- Verify `manifest.json` is served correctly
- Check service worker is registered
- Ensure HTTPS (required for PWA)

---

## 📚 Documentation

- [Sentry Configuration](src/utils/sentry.ts)
- [PWA Service Worker](public/sw.js)
- [Web Vitals Monitoring](src/utils/webVitals.ts)
- [E2E Tests](tests/e2e/)
- [Security Headers](nginx.conf)
- [Bundle Config](vite.config.ts)

---

## 🎯 Production Checklist

Before deploying:
- [ ] Set all environment variables
- [ ] Test build locally (`yarn build && yarn preview`)
- [ ] Run E2E tests (`yarn test:e2e`)
- [ ] Verify Sentry DSN is configured
- [ ] Test PWA installation
- [ ] Test offline functionality
- [ ] Check security headers
- [ ] Review Web Vitals

After deploying:
- [ ] Verify app loads correctly
- [ ] Test all routes and features
- [ ] Check Sentry is receiving events
- [ ] Confirm PWA is installable
- [ ] Validate security headers
- [ ] Monitor Web Vitals
- [ ] Check error rates in Sentry

---

**Need Help?**
- Check `PRODUCTION_COMPLETE.md` for full details
- Review individual feature documentation
- Test locally with `yarn dev` or `yarn preview`
