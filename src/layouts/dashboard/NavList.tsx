import { NavLink } from 'react-router-dom';
import { useDashboard } from './useDashboard';
import type { NavigationPageItem, NavigationItem } from '../../app/types/dashboard';
import { dashboardConfig } from '../../app/config/dashboard.config';

function triggerPrefetch(path: string) {
  const cfg = dashboardConfig.routes.find(r => r.path === path);
  cfg?.prefetch?.();
}

function isPage(item: NavigationItem): item is NavigationPageItem { return item.type === 'page'; }

export function NavList({ onNavigate }: Readonly<{ onNavigate?: () => void }>) {
  const { navigation } = useDashboard();

  const pages: NavigationPageItem[] = navigation.filter(isPage).filter(i => !i.hidden);
  return (
    <ul className="dash-nav-list">
      {pages.map(item => (
        <li key={item.id} className="dash-nav-item">
          <NavLink
            to={item.path}
            end={item.path === '/'}
            aria-label={item.label}
            onClick={onNavigate}
            onMouseEnter={() => { triggerPrefetch(item.path); }}
            onFocus={() => { triggerPrefetch(item.path); }}
            className={({ isActive }) => isActive ? 'active' : undefined}
          >
            {({ isActive }) => (
              <span className="dash-nav-label" aria-current={isActive ? 'page' : undefined}>{item.label}</span>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}