import { useLocation } from 'react-router-dom';
import { useMediaQuery } from '../utils/accessibility';
import { BottomNav } from '../components/BottomNav';
import { Tooltip } from '../components/Tooltip';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavigationProps {
  items: NavItem[];
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export function Navigation({ items, onMenuToggle, isMenuOpen = false }: NavigationProps) {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const navItems = items.map(item => ({
    ...item,
    isActive: location.pathname === item.href
  }));

  if (isMobile) {
    return <BottomNav items={navItems} />;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`sidebar ${isMenuOpen ? 'sidebar--expanded' : 'sidebar--collapsed'}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="sidebar__content">
          <button
            type="button"
            onClick={onMenuToggle}
            className="sidebar__toggle"
            aria-label={isMenuOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={isMenuOpen}
          >
            <span className="sidebar__toggle-icon">
              {isMenuOpen ? '←' : '→'}
            </span>
          </button>

          <nav className="sidebar__nav">
            <ul className="nav-list" role="list">
              {navItems.map((item) => (
                <li key={item.id} className="nav-list__item">
                  {isMenuOpen ? (
                    <a
                      href={item.href}
                      className={`nav-link ${item.isActive ? 'nav-link--active' : ''}`}
                      aria-current={item.isActive ? 'page' : undefined}
                    >
                      <span className="nav-link__icon" aria-hidden="true">
                        {item.icon}
                      </span>
                      <span className="nav-link__label">
                        {item.label}
                      </span>
                    </a>
                  ) : (
                    <Tooltip content={item.label} position="right">
                      <a
                        href={item.href}
                        className={`nav-link nav-link--icon-only ${item.isActive ? 'nav-link--active' : ''}`}
                        aria-label={item.label}
                        aria-current={item.isActive ? 'page' : undefined}
                      >
                        <span className="nav-link__icon" aria-hidden="true">
                          {item.icon}
                        </span>
                      </a>
                    </Tooltip>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile menu overlay */}
      {isMobile && isMenuOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onMenuToggle}
          aria-hidden="true"
        />
      )}
    </>
  );
}