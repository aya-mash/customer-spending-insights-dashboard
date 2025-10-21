/**
 * NAVIGATION COMPONENT
 * Design system navigation with beautiful pill-style design
 * Desktop: Sidebar with expandable pills
 * Mobile: BottomNav with pills
 */

import { forwardRef, type CSSProperties } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { brand, surface, text as textColors, spacingNum, radius, transition, easing } from '../tokens';
import { useBreakpoint } from '../index';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

const transitions = {
  fast: transition.fast,
  normal: transition.normal,
  easeStandard: easing.standard,
};

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface NavigationProps {
  items: NavItem[];
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const Navigation = forwardRef<HTMLElement, NavigationProps>(
  ({ items, isExpanded = false, onToggle }, ref) => {
    const location = useLocation();
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'mobile';

    if (isMobile) return null;

    const sidebarStyles = createDynamicStyles({
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      width: isExpanded ? '240px' : '72px',
      backgroundColor: surface.card,
      borderRight: `1px solid ${surface.border}`,
      padding: `${spacingNum[6]}px ${spacingNum[3]}px`,
      display: 'flex',
      flexDirection: 'column',
      gap: `${spacingNum[4]}px`,
      transition: `width ${transitions.normal} ${transitions.easeStandard}`,
      zIndex: 100,
      overflow: 'hidden',
    });

    const toggleButtonStyles = createDynamicStyles({
      width: '100%',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      border: `1px solid ${surface.border}`,
      borderRadius: radius.lg,
      color: textColors.secondary,
      cursor: 'pointer',
      transition: `all ${transitions.fast} ${transitions.easeStandard}`,
      marginBottom: `${spacingNum[4]}px`,
    });

    const navItemStyles = (isActive: boolean) => createDynamicStyles({
      display: 'flex',
      alignItems: 'center',
      gap: `${spacingNum[3]}px`,
      padding: `${spacingNum[3]}px ${spacingNum[4]}px`,
      borderRadius: radius.full,
      backgroundColor: isActive ? brand.primary : 'transparent',
      color: isActive ? textColors.inverse : textColors.primary,
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: isActive ? 600 : 500,
      transition: `all ${transitions.fast} ${transitions.easeStandard}`,
      cursor: 'pointer',
      border: 'none',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    });

    const iconStyles = createDynamicStyles({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: '20px',
      height: '20px',
    });

    return (
      <aside ref={ref} style={sidebarStyles} role="navigation" aria-label="Main navigation">
        {/* Toggle button */}
        <button
          type="button"
          onClick={onToggle}
          style={toggleButtonStyles}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={isExpanded}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = surface.hover;
            e.currentTarget.style.borderColor = brand.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = surface.border;
          }}
        >
          {isExpanded ? '←' : '→'}
        </button>

        {/* Nav items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: `${spacingNum[2]}px` }}>
          {items.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.id}
                to={item.href}
                style={navItemStyles(isActive)}
                aria-current={isActive ? 'page' : undefined}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = surface.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={iconStyles} aria-hidden="true">
                  {item.icon}
                </span>
                {isExpanded && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    );
  }
);

Navigation.displayName = 'Navigation';
