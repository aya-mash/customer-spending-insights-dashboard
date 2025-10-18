import { createContext, useState, useMemo } from 'react';
import type { DashboardContextValue, DashboardConfig } from '../../app/types/dashboard';

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export function DashboardProvider({ config, children }: Readonly<{ config: DashboardConfig; children: React.ReactNode }>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(!!config.options?.defaultSidebarCollapsed);
  const value = useMemo<DashboardContextValue>(() => ({
    ...config,
    sidebarCollapsed,
    toggleSidebar: () => setSidebarCollapsed(c => !c),
  }), [config, sidebarCollapsed]);
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export { DashboardContext };