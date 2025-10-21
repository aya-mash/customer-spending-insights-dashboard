/**
 * TEST UTILITIES
 * Shared test helpers and wrappers
 */

import { type ReactElement } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "../contexts";
import { createTestQueryClient } from "./createTestQueryClient";

export function TestProviders({ children }: { children: ReactElement }) {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
