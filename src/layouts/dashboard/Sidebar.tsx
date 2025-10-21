import { useEffect } from 'react';
import { useDashboard } from './useDashboard.ts';
import { NavList } from './NavList.tsx';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen } = useDashboard();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !sidebarCollapsed) {
        toggleSidebar();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [sidebarCollapsed, toggleSidebar]);

  const baseClass = sidebarCollapsed ? 'dash-sidebar collapsed' : 'dash-sidebar';
  const cls = mobileSidebarOpen ? baseClass + ' open' : baseClass;
  
  return (
    <aside 
      className={cls} 
      data-testid="sidebar" 
      aria-label="Primary navigation" 
      aria-hidden={sidebarCollapsed}
    >
      {/* NavList now shows icons in collapsed mode, labels when expanded */}
      <NavList 
        collapsed={sidebarCollapsed}
        onNavigate={() => { /* close on mobile after navigation if desired */ }} 
      />
    </aside>
  );
}