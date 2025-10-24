import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Amplify } from 'aws-amplify';
import { ThemeProvider } from '../contexts/theme';
import { ThemedAuthenticator } from '../contexts/auth';
import { ErrorBoundary } from '../design-system/components';
import { handleErrorBoundary } from '../utils/sentry';

// Configure Amplify - Per official docs, inline config is simplest
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || '',
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: false, // No automatic retries - let user manually retry via UI
      refetchOnWindowFocus: false, // Don't auto-refetch when user returns to tab
      refetchOnReconnect: true, // Do refetch when network reconnects
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
