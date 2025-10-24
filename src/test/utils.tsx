/**
 * Test Utilities
 * Provides wrapper components with all required providers for component testing
 */

import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/theme';
import { DashboardProvider } from '../contexts/dashboard/DashboardProvider';
import dashboardConfig from '../app/config/dashboard.config';

// Create a new QueryClient for each test to ensure isolation
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface AllTheProvidersProps {
  children: ReactNode;
}

/**
 * Wrapper component that provides all necessary context providers for testing
 */
function AllTheProviders({ children }: AllTheProvidersProps) {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ThemeProvider>
          <DashboardProvider config={dashboardConfig}>{children}</DashboardProvider>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

/**
 * Minimal wrapper - only QueryClient and ThemeProvider (no router, no dashboard)
 */
function MinimalProviders({ children }: AllTheProvidersProps) {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}

/**
 * Custom render function that wraps components with all providers
 * Use this instead of the default render from @testing-library/react
 * 
 * @example
 * import { render, screen } from '../test/utils';
 * 
 * test('renders button', () => {
 *   render(<Button>Click me</Button>);
 *   expect(screen.getByText('Click me')).toBeInTheDocument();
 * });
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

/**
 * Render without router - for tests that manage their own routing
 */
export const renderWithoutRouter = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: MinimalProviders, ...options });

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override the default render with our custom one
export { customRender as render };
