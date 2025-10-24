import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../contexts/theme';
import { ThemedAuthenticator } from '../contexts/auth';
import { ErrorBoundary } from '../design-system/components';
import { handleErrorBoundary } from '../utils/sentry';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - balance between freshness and caching
      gcTime: 10 * 60 * 1000, // 10 minutes - keep unused data in cache
      retry: 1, // Retry once on failure (network blips are common)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true, // Dashboard should show fresh data when user returns
      refetchOnReconnect: true, // Refresh on network reconnect
      refetchOnMount: true, // Ensure fresh data on component mount
    },
  },
});

export interface AppProviderProps {
  readonly children: ReactNode;
}

/**
 * AppProvider wraps the application with all necessary providers:
 * - ErrorBoundary for error handling (with Sentry integration)
 * - QueryClientProvider for data fetching
 * - ThemeProvider for theme management
 * - ThemedAuthenticator for authentication
 */
export function AppProvider({ children }: Readonly<AppProviderProps>) {
  return (
    <ErrorBoundary onError={handleErrorBoundary}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ThemedAuthenticator>
            {children}
          </ThemedAuthenticator>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
