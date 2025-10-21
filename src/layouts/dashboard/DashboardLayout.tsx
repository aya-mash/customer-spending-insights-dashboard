/**
 * DASHBOARD LAYOUT
 * Design system layout with Navigation, BottomNav, and SettingsDrawer
 */

import { useState, useEffect, useContext, type CSSProperties } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Settings2, Home, TrendingUp, CreditCard, BarChart3 } from 'lucide-react';
import { Navigation, type NavItem } from '../../design-system/components/Navigation';
import { BottomNav, type BottomNavItem } from '../../design-system/components/BottomNav';
import { SettingsDrawer } from '../../design-system/components/SettingsDrawer';
import { useThemeContext } from '../../contexts';
import { brand, surface, spacingNum, zIndex, text as textColors, fontSize, fontWeight } from '../../design-system/tokens';
import { useBreakpoint } from '../../design-system';
import { DashboardContext } from './DashboardProvider';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

// Page title mapping
const PAGE_TITLES: Record<string, string> = {
  '/': 'Spending Overview',
  '/insights': 'Spending Insights',
  '/transactions': 'Spending Transactions',
  '/style-guide': 'Style Guide',
};

export function DashboardLayout() {
  const dash = useContext(DashboardContext);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { mode, setMode } = useThemeContext();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] || 'Spending Insights';

  // Close settings on mobile viewport change
  useEffect(() => {
    if (isMobile && settingsOpen) {
      setSettingsOpen(false);
    }
  }, [isMobile, settingsOpen]);

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      href: '/',
      icon: <Home size={20} />,
    },
    {
      id: 'insights',
      label: 'Insights',
      href: '/insights',
      icon: <TrendingUp size={20} />,
    },
    {
      id: 'transactions',
      label: 'Transactions',
      href: '/transactions',
      icon: <CreditCard size={20} />,
    },
  ];

  const bottomNavItems: BottomNavItem[] = navItems;

  const headerStyles = createDynamicStyles({
    position: 'fixed',
    top: 0,
    left: isMobile ? 0 : sidebarExpanded ? '240px' : '72px',
    right: 0,
    height: '64px',
    backgroundColor: surface.card,
    borderBottom: `1px solid ${surface.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${spacingNum[6]}px`,
    zIndex: zIndex.sticky,
    transition: 'left 250ms cubic-bezier(0.4, 0, 0.2, 1)',
  });

  const logoStyles = createDynamicStyles({
    display: 'flex',
    alignItems: 'center',
    gap: `${spacingNum[3]}px`,
  });

  const iconWrapperStyles = createDynamicStyles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: brand.primary,
  });

  const titleStyles = createDynamicStyles({
    fontSize: fontSize.h4,
    fontWeight: fontWeight.semibold,
    color: textColors.strong,
    margin: 0,
  });

  const settingsButtonStyles = createDynamicStyles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: 'transparent',
    color: brand.primary,
    cursor: 'pointer',
    transition: 'background-color 150ms ease',
  });

  const mainStyles = createDynamicStyles({
    marginLeft: isMobile ? 0 : sidebarExpanded ? '240px' : '72px',
    marginTop: '64px',
    marginBottom: isMobile ? '72px' : 0,
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: surface.surfaceAlt,
    transition: 'margin-left 250ms cubic-bezier(0.4, 0, 0.2, 1)',
  });

  const skipLinkStyles = createDynamicStyles({
    position: 'absolute',
    left: '-9999px',
    zIndex: 9999,
    padding: `${spacingNum[3]}px ${spacingNum[4]}px`,
    backgroundColor: brand.primary,
    color: '#FFFFFF',
    textDecoration: 'none',
    borderRadius: '4px',
  });

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        style={skipLinkStyles}
        onFocus={(e) => {
          e.currentTarget.style.left = `${spacingNum[4]}px`;
          e.currentTarget.style.top = `${spacingNum[4]}px`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = '-9999px';
        }}
      >
        Skip to content
      </a>

      {/* Header */}
      <header style={headerStyles}>
        <div style={logoStyles}>
          {dash?.branding?.logo ? (
            <div style={iconWrapperStyles}>
              {dash.branding.logo}
            </div>
          ) : (
            <div style={iconWrapperStyles}>
              <BarChart3 size={24} />
            </div>
          )}
          <h1 style={titleStyles}>{pageTitle}</h1>
        </div>
        <button
          type="button"
          aria-label="Open settings"
          style={settingsButtonStyles}
          onClick={() => setSettingsOpen(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = surface.hover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Settings2 size={20} />
        </button>
      </header>

      {/* Navigation (Desktop Sidebar / Mobile Bottom Nav) */}
      <Navigation
        items={navItems}
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />
      <BottomNav items={bottomNavItems} />

      {/* Main Content */}
      <main id="main-content" style={mainStyles} role="main" tabIndex={-1}>
        <Outlet />
      </main>

      {/* Settings Drawer */}
      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        mode={mode}
        onModeChange={setMode}
      />
    </>
  );
}

export default DashboardLayout;
