import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Polyfill ResizeObserver for Recharts responsive container during tests.
class RO {
	observe() {}
	unobserve() {}
	disconnect() {}
}
// Only assign if missing to avoid interfering with jsdom updates.
// Provide a loose global interface for adding ResizeObserver
interface GlobalWithRO { ResizeObserver?: typeof RO }
const g = globalThis as unknown as GlobalWithRO;
if (typeof g.ResizeObserver === 'undefined') {
	g.ResizeObserver = RO;
}

// Mock window.matchMedia for theme detection
Object.defineProperty(window, 'matchMedia', {
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