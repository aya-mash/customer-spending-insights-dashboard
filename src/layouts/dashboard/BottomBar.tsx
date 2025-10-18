import { NavLink } from 'react-router-dom';
import { useDashboard } from './useDashboard.ts';
import type { NavigationPageItem, NavigationItem } from '../../app/types/dashboard';

function isPage(i: NavigationItem): i is NavigationPageItem { return i.type === 'page'; }

export function BottomBar() {
  const { navigation } = useDashboard();
  const pageItems: NavigationPageItem[] = navigation.filter((n: NavigationItem) => isPage(n));
  const primary = pageItems.filter(p => !p.hidden).slice(0, 4);
  return (
    <nav className="dash-bottom-bar" aria-label="Primary mobile navigation" data-mobile>
      {primary.map(item => (
        <NavLink
          key={item.id}
          to={item.path}
          end={item.path === '/'}
          aria-label={item.label}
          className={({ isActive }) => isActive ? 'active' : undefined}
          onMouseEnter={() => { /* prefetch removed */ }}
          onFocus={() => { /* prefetch removed */ }}
        >
          {({ isActive }) => (
            <span className="dash-bottom-label" aria-current={isActive ? 'page' : undefined}>
              {/* icon slot fallback (could be improved later) */}
              <span className="visually-hidden">{isActive ? 'Current page: ' : ''}</span>
              {item.label}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
