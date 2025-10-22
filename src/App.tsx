import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/theme';
import AppShell, { type AppShellProps } from './app/AppShell';

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

function App(props: Readonly<AppShellProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppShell {...props} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
