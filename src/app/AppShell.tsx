import { RouterProvider, type RouterProviderProps } from "react-router-dom";
import { AppProvider } from "./AppProvider";
import { useState, useEffect } from "react";

export interface AppShellProps {
  readonly router?: RouterProviderProps["router"];
}

// Dynamically import router to avoid circular dependency at module load time
const getRouterAsync = () => import("./router").then(m => m.getDefaultRouter());

function AppShell({ router }: Readonly<AppShellProps>) {
  const [defaultRouter, setDefaultRouter] = useState<RouterProviderProps["router"] | null>(null);
  
  useEffect(() => {
    if (!router) {
      getRouterAsync().then(setDefaultRouter);
    }
  }, [router]);
  
  const activeRouter = router ?? defaultRouter;
  
  if (!activeRouter) {
    return (
      <AppProvider>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          fontSize: '1.25rem',
          color: 'var(--color-text-secondary)'
        }}>
          Loading...
        </div>
      </AppProvider>
    );
  }
  
  return (
    <AppProvider>
      <RouterProvider router={activeRouter} />
    </AppProvider>
  );
}

export default AppShell;
