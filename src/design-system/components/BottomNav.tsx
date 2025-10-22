/**
 * BOTTOM NAVIGATION COMPONENT
 * Design system bottom navigation with beautiful pill-style design
 * Mobile only - shown at viewport bottom with safe area support
 */

import { forwardRef, type CSSProperties } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { spacingNum, radius } from '../tokens';
import { useBreakpoint, useTheme } from '../index';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface BottomNavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface BottomNavProps {
  items: BottomNavItem[];
}

export const BottomNav = forwardRef<HTMLElement, BottomNavProps>(
  ({ items }, ref) => {
    const location = useLocation();
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'mobile';
    const { brand, surface, text: textColors } = useTheme();

    if (!isMobile) return null;

    const containerStyles = createDynamicStyles({
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '72px',
      backgroundColor: surface.surface,
      borderTop: `1px solid ${surface.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: `${spacingNum[2]}px ${spacingNum[4]}px`,
      paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      zIndex: 1000,
      boxShadow: 'var(--shadow-neumorphic-md)',
    });

    const navItemStyles = (isActive: boolean) => createDynamicStyles({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: `${spacingNum[1]}px`,
      padding: `${spacingNum[2]}px ${spacingNum[3]}px`,
      borderRadius: radius.md,
      backgroundColor: isActive ? `${brand.primary}15` : 'transparent',
      color: isActive ? brand.primary : textColors.secondary,
      textDecoration: 'none',
      fontSize: '11px',
      fontWeight: isActive ? 600 : 500,
      transition: `all 0.2s ease`,
      cursor: 'pointer',
      minWidth: '64px',
      textAlign: 'center',
      WebkitTapHighlightColor: 'transparent',
      touchAction: 'manipulation',
    });

    const iconWrapperStyles = (isActive: boolean) => createDynamicStyles({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '44px',
      height: '44px',
      borderRadius: radius.md,
      backgroundColor: isActive ? brand.primary : 'transparent',
      color: isActive ? textColors.inverse : textColors.secondary,
      transition: `all 0.2s ease`,
      boxShadow: isActive ? 'var(--shadow-neumorphic-sm)' : 'none',
    });

    return (
      <nav ref={ref} style={containerStyles} role="navigation" aria-label="Main navigation">
        {items.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.id}
              to={item.href}
              style={navItemStyles(isActive)}
              aria-current={isActive ? 'page' : undefined}
            >
              <div style={iconWrapperStyles(isActive)}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }
);

BottomNav.displayName = 'BottomNav';
