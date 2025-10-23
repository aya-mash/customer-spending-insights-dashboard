import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Amplify } from "aws-amplify";
import { ThemeProvider } from "./contexts/theme";
import { ThemedAuthenticator } from "./contexts/auth";
import AppShell, { type AppShellProps } from "./app/AppShell";

// Configure Amplify - Per official docs, inline config is simplest
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || "",
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || "",
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

function App(props: Readonly<AppShellProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ThemedAuthenticator>
          <AppShell {...props} />
        </ThemedAuthenticator>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
