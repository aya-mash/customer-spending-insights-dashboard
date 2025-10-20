import { SettingsDrawer } from '../../components/SettingsDrawer';
import { useState, useRef, useEffect } from 'react';
import { useDashboard } from './useDashboard';
import { Header } from './Header.tsx';
import { Sidebar } from './Sidebar.tsx';
import { BottomBar } from './BottomBar.tsx';
import { useNavigationTimings } from '../../hooks/useNavigationTimings';
import { Outlet } from 'react-router-dom';

export function DashboardLayout() {
  const { options, mobileSidebarOpen, setMobileSidebarOpen } = useDashboard();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsBtnRef = useRef<HTMLButtonElement | null>(null);
  useNavigationTimings();
  // Auto-hide settings drawer when switching to mobile (viewport < 640px)
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640 && settingsOpen) {
        setSettingsOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [settingsOpen]);
  return (
    <div className={mobileSidebarOpen ? 'dashboard-root mobile-sidebar-open' : 'dashboard-root'} data-variant={options?.brandVariant || 'neutral'}>
      <a href="#main-content" className="skip-link" onClick={e => { e.preventDefault(); document.getElementById('main-content')?.focus(); }}>Skip to content</a>
      <Header rightActions={(
        <button
          type="button"
          ref={settingsBtnRef}
          aria-label="Settings"
          className="settings-trigger"
          onClick={() => setSettingsOpen(o => !o)}
        >⚙️</button>
      )} />
      <div className="dashboard-body">
        {/* Sidebar (desktop sticky, mobile off-canvas controlled by mobileSidebarOpen) */}
        <Sidebar />
        <main id="main-content" className="dashboard-main" role="main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <BottomBar />
  {mobileSidebarOpen && <div className="mobile-nav-backdrop" aria-hidden="true" onClick={() => setMobileSidebarOpen?.(false)} />}
      <SettingsDrawer open={settingsOpen} onClose={() => { setSettingsOpen(false); settingsBtnRef.current?.focus(); }} />
    </div>
  );
}

export default DashboardLayout;