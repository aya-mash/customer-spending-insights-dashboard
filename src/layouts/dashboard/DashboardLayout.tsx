import { SettingsDrawer } from '../../components/SettingsDrawer';
import { useState, useRef } from 'react';
import { useDashboard } from './useDashboard';
import { Header } from './Header.tsx';
import { Sidebar } from './Sidebar.tsx';
import { BottomBar } from './BottomBar.tsx';
import { useNavigationTimings } from '../../hooks/useNavigationTimings';
import { Outlet } from 'react-router-dom';

export function DashboardLayout() {
  const { options } = useDashboard();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsBtnRef = useRef<HTMLButtonElement | null>(null);
  useNavigationTimings();
  return (
    <div className="dashboard-root" data-variant={options?.brandVariant || 'neutral'}>
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
        <Sidebar />
        <main id="main-content" className="dashboard-main" role="main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <BottomBar />
      <SettingsDrawer open={settingsOpen} onClose={() => { setSettingsOpen(false); settingsBtnRef.current?.focus(); }} />
    </div>
  );
}

export default DashboardLayout;