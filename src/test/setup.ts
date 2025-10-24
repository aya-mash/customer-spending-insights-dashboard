import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import '../i18n/config'; // Initialize i18n for tests

// Mock AWS Amplify Authenticator to bypass authentication in tests
vi.mock('@aws-amplify/ui-react', async () => {
  const actual = await vi.importActual('@aws-amplify/ui-react');
  return {
    ...actual,
    Authenticator: ({ children }: { children: ReactNode | ((props: { signOut?: () => void; user?: unknown }) => ReactNode) }) => {
      // Simulate authenticated state by calling children as function with mock user
      if (typeof children === 'function') {
        return children({ 
          signOut: vi.fn(), 
          user: { 
            username: 'testuser',
            userId: 'test-user-id',
            signInDetails: {}
          }
        });
      }
      return children;
    },
    ThemeProvider: ({ children }: { children: ReactNode }) => children,
    useAuthenticator: () => ({
      user: { 
        username: 'testuser',
        userId: 'test-user-id',
        signInDetails: { loginId: 'testuser@example.com' }
      },
      signOut: vi.fn(),
      authStatus: 'authenticated',
      route: 'authenticated',
    }),
  };
});
beforeEach(() => {
	localStorage.clear();
	sessionStorage.clear();
	delete document.documentElement.dataset.theme;
});

// Polyfill ResizeObserver for Recharts responsive container during tests.
// Fixed: Replace empty methods with explicit no-op implementations
class RO {
	// No-op: ResizeObserver mock for testing - does not track observations
	observe(): void {
		// Intentionally empty - mock implementation
	}
	unobserve(): void {
		// Intentionally empty - mock implementation
	}
	disconnect(): void {
		// Intentionally empty - mock implementation
	}
}

// Only assign if missing to avoid interfering with jsdom updates.
// Provide a loose global interface for adding ResizeObserver
interface GlobalWithRO { ResizeObserver?: typeof RO }
const g = globalThis as unknown as GlobalWithRO;
// Fixed: Use nullish coalescing operator for cleaner assignment
g.ResizeObserver ??= RO;

// Mock window.matchMedia for theme detection
// Fixed: Use globalThis.window instead of window for ES2020 compatibility
Object.defineProperty(globalThis.window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});