import '@testing-library/jest-dom';

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