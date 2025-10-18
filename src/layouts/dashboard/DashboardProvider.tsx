import { createContext, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { pageTitleForPath } from '../../lib/pageTitle';
import type { DashboardContextValue, DashboardConfig } from '../../app/types/dashboard';

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export function DashboardProvider({ config, children }: Readonly<{ config: DashboardConfig; children?: React.ReactNode }>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(!!config.options?.defaultSidebarCollapsed);
  const { pathname } = useLocation();
  const currentTitle = pageTitleForPath(pathname);
  const augmentedConfig = useMemo(() => ({
    ...config,
    slots: {
      ...config.slots,
      appTitle: <h1 className="dash-title-text" data-page-title>{currentTitle}</h1>,
    },
  }), [config, currentTitle]);
  const value = useMemo<DashboardContextValue>(() => ({
    ...augmentedConfig,
    sidebarCollapsed,
    toggleSidebar: () => setSidebarCollapsed(c => !c),
  }), [augmentedConfig, sidebarCollapsed]);
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export { DashboardContext };