import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Clear localStorage before each test to prevent theme persistence between tests
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