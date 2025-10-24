import { RouterProvider, type RouterProviderProps } from "react-router-dom";
import { defaultRouter } from "./router";
import { AppProvider } from "./AppProvider";

export interface AppShellProps {
  readonly router?: RouterProviderProps["router"];
}

function AppShell({ router = defaultRouter }: Readonly<AppShellProps>) {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default AppShell;
