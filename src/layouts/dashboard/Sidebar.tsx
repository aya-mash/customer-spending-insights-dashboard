import { useEffect } from 'react';
import { useDashboard } from './useDashboard.ts';
import { NavList } from './NavList.tsx';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useDashboard();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !sidebarCollapsed) {
        toggleSidebar();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [sidebarCollapsed, toggleSidebar]);

  return (
    <aside className={sidebarCollapsed ? 'dash-sidebar collapsed' : 'dash-sidebar'} data-testid="sidebar" aria-label="Primary navigation">
      <button type="button" className="dash-sidebar-toggle" onClick={toggleSidebar} aria-expanded={!sidebarCollapsed} aria-controls="main-content">{sidebarCollapsed ? 'Open' : 'Collapse'} Nav</button>
      {!sidebarCollapsed && <NavList onNavigate={() => { /* close on mobile after navigation if desired */ }} />}
    </aside>
  );
}