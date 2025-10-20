# Security Guide

## Security Standards

### Overview
This document outlines security practices and considerations for the Customer Spending Insights Dashboard, focusing on client-side security, data protection, and secure deployment practices.

### Security Principles
- **Defense in Depth**: Multiple layers of security controls
- **Principle of Least Privilege**: Minimal access rights
- **Secure by Default**: Secure configurations out of the box
- **Input Validation**: All user inputs validated and sanitized

## Client-Side Security

### Content Security Policy (CSP)
```javascript
// Recommended CSP headers for production
const cspDirectives = {
  "default-src": "'self'",
  "script-src": "'self' 'unsafe-inline'", // Minimize unsafe-inline usage
  "style-src": "'self' 'unsafe-inline'",
  "img-src": "'self' data: https:",
  "font-src": "'self' https://fonts.gstatic.com",
  "connect-src": "'self' https://api.example.com",
  "frame-ancestors": "'none'",
  "base-uri": "'self'",
  "form-action": "'self'"
};

// Express.js example
app.use((req, res, next) => {
  const csp = Object.entries(cspDirectives)
    .map(([directive, sources]) => `${directive} ${sources}`)
    .join('; ');
  
  res.setHeader('Content-Security-Policy', csp);
  next();
});
```

### Input Validation and Sanitization
```typescript
// Client-side input validation
import { z } from 'zod';

const TransactionFilterSchema = z.object({
  category: z.string().max(50).regex(/^[a-zA-Z0-9\s-]+$/),
  startDate: z.date().max(new Date()),
  endDate: z.date().max(new Date()),
  minAmount: z.number().min(0).max(1000000).optional(),
  maxAmount: z.number().min(0).max(1000000).optional()
});

export function validateTransactionFilters(input: unknown): TransactionFilters {
  try {
    return TransactionFilterSchema.parse(input);
  } catch (error) {
    throw new ValidationError('Invalid filter parameters', error);
  }
}

// XSS prevention for dynamic content
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Safe URL generation
export function createSafeUrl(base: string, params: Record<string, string>): string {
  const url = new URL(base);
  
  Object.entries(params).forEach(([key, value]) => {
    // Validate parameter names and values
    if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
      throw new Error(`Invalid parameter name: ${key}`);
    }
    url.searchParams.set(key, encodeURIComponent(value));
  });
  
  return url.toString();
}
```

### Data Protection
```typescript
// Sensitive data handling
class SecureStorage {
  private static readonly ENCRYPTION_KEY = 'user-session-key';
  
  static store(key: string, data: unknown): void {
    try {
      const serialized = JSON.stringify(data);
      const encrypted = this.encrypt(serialized);
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store secure data:', error);
    }
  }
  
  static retrieve<T>(key: string): T | null {
    try {
      const encrypted = sessionStorage.getItem(key);
      if (!encrypted) return null;
      
      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Failed to retrieve secure data:', error);
      return null;
    }
  }
  
  private static encrypt(data: string): string {
    // Simple XOR encryption for demo - use proper encryption in production
    return btoa(data.split('').map((char, index) => 
      String.fromCharCode(char.charCodeAt(0) ^ this.ENCRYPTION_KEY.charCodeAt(index % this.ENCRYPTION_KEY.length))
    ).join(''));
  }
  
  private static decrypt(encrypted: string): string {
    const data = atob(encrypted);
    return data.split('').map((char, index) => 
      String.fromCharCode(char.charCodeAt(0) ^ this.ENCRYPTION_KEY.charCodeAt(index % this.ENCRYPTION_KEY.length))
    ).join('');
  }
}

// PII handling
export function maskSensitiveData(data: string, type: 'email' | 'phone' | 'account'): string {
  switch (type) {
    case 'email':
      const [local, domain] = data.split('@');
      return `${local.slice(0, 2)}***@${domain}`;
    case 'phone':
      return data.replace(/\d(?=\d{4})/g, '*');
    case 'account':
      return `***${data.slice(-4)}`;
    default:
      return data;
  }
}
```

## API Security

### Request Authentication
```typescript
// API client with security headers
class SecureApiClient {
  private baseURL: string;
  private apiKey: string;
  
  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }
  
  async request<T>(config: RequestConfig): Promise<T> {
    const url = new URL(config.endpoint, this.baseURL);
    
    // Validate URL
    if (!url.protocol.startsWith('https')) {
      throw new Error('Only HTTPS requests allowed');
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-Requested-With': 'XMLHttpRequest',
      'X-Client-Version': process.env.VITE_APP_VERSION || '1.0.0',
      ...config.headers
    };
    
    // Request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      const response = await fetch(url.toString(), {
        ...config,
        headers,
        signal: controller.signal,
        credentials: 'same-origin'
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new ApiError(response.status, response.statusText);
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }
}
```

### Rate Limiting
```typescript
// Client-side rate limiting
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  canMakeRequest(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }
}

// Usage in API client
const rateLimiter = new RateLimiter(50, 60000); // 50 requests per minute

export async function makeApiRequest(endpoint: string) {
  const identifier = `${window.location.origin}:${endpoint}`;
  
  if (!rateLimiter.canMakeRequest(identifier)) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  return apiClient.request({ endpoint });
}
```

## Environment Security

### Environment Variables
```typescript
// Environment variable validation
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_ENVIRONMENT: z.enum(['development', 'staging', 'production']),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_ANALYTICS_ID: z.string().optional()
});

export const env = envSchema.parse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  VITE_ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID
});

// Development vs Production configuration
export const config = {
  api: {
    baseURL: env.VITE_API_BASE_URL,
    timeout: env.VITE_ENVIRONMENT === 'production' ? 10000 : 30000,
    retries: env.VITE_ENVIRONMENT === 'production' ? 3 : 1
  },
  security: {
    enableCSP: env.VITE_ENVIRONMENT === 'production',
    enableHSTS: env.VITE_ENVIRONMENT === 'production',
    enableRateLimiting: true
  }
};
```

### Secrets Management
```bash
# .env.example - Template for environment variables
VITE_API_BASE_URL=https://api.example.com
VITE_ENVIRONMENT=development
VITE_SENTRY_DSN=
VITE_ANALYTICS_ID=

# Do not commit actual .env files
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

## Dependency Security

### Dependency Scanning
```json
// package.json security scripts
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix",
    "deps:check": "npx npm-check-updates",
    "deps:update": "npx npm-check-updates -u"
  }
}
```

### Security Headers Configuration
```javascript
// nginx.conf security headers
server {
    listen 80;
    server_name example.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    
    # HSTS (enable only on HTTPS)
    # add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # CSP
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;" always;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

## Error Handling

### Secure Error Messages
```typescript
// Safe error handling
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly userMessage: string;
  
  constructor(
    message: string,
    statusCode = 500,
    isOperational = true,
    userMessage?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.userMessage = userMessage || this.getDefaultUserMessage(statusCode);
    
    Error.captureStackTrace(this, this.constructor);
  }
  
  private getDefaultUserMessage(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'Access denied. You don\'t have permission for this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'An internal error occurred. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}

// Error boundary with safe error display
export class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for developers
    console.error('Error Boundary:', error, errorInfo);
    
    // Send sanitized error to monitoring service
    this.reportError({
      message: error.message,
      stack: error.stack?.split('\n')[0], // Only first line of stack
      component: errorInfo.componentStack?.split('\n')[0],
      timestamp: new Date().toISOString()
    });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry for the inconvenience. Please refresh the page or try again later.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
  
  private reportError(sanitizedError: Record<string, unknown>) {
    // Only send safe, non-sensitive error information
    if (config.monitoring.enabled) {
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedError)
      }).catch(() => {
        // Silently fail error reporting
      });
    }
  }
}
```

## Deployment Security

### Docker Security
```dockerfile
# Multi-stage build for security
FROM node:18-alpine AS builder

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY --chown=nextjs:nodejs . .

# Install dependencies
RUN npm ci --only=production

# Build application
RUN npm run build

# Production image
FROM nginx:alpine AS runtime

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Use non-root user
RUN addgroup -g 1001 -S nginx
RUN adduser -S nginx -u 1001

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chown -R nginx:nginx /var/cache/nginx

# Switch to non-root user
USER nginx

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

### CI/CD Security
```yaml
# .github/workflows/security.yml
name: Security Checks

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run security audit
        run: npm audit --audit-level=high
        
      - name: Check for vulnerabilities
        run: npx audit-ci --config audit-ci.json
        
      - name: SAST scan
        uses: github/super-linter@v4
        env:
          DEFAULT_BRANCH: main
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Security Checklist

### Pre-deployment
- [ ] Dependency audit completed
- [ ] Security headers configured
- [ ] CSP implemented and tested
- [ ] Input validation in place
- [ ] Error handling secure
- [ ] Secrets properly managed

### Ongoing Security
- [ ] Regular dependency updates
- [ ] Security monitoring enabled
- [ ] Incident response plan
- [ ] Security team training
- [ ] Penetration testing scheduled
- [ ] Security code reviews