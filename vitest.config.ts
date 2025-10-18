import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: 'src/test/setup.ts',
    globals: true,
    // Limit included test files to our source/unit tests.
    include: [
      'src/**/*.{test,spec}.?(c|m)[jt]s?(x)',
      'src/**/__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)',
      'src/__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)',
      'src/data/__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)'
    ],
    // Exclude dependency test suites & e2e playwright specs.
    exclude: ['node_modules/**', 'dist/**', 'tests/e2e/**'],
  },
});
