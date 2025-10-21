import { RouterProvider, type RouterProviderProps } from "react-router-dom";
import { defaultRouter } from "./router";

export interface AppShellProps {
  readonly router?: RouterProviderProps["router"];
}

function AppShell({ router = defaultRouter }: Readonly<AppShellProps>) {
  return <RouterProvider router={router} />;
}

export default AppShell;
