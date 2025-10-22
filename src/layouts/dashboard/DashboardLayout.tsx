/**
 * DASHBOARD LAYOUT
 * Design system layout with Navigation, BottomNav, and SettingsDrawer
 */

import { useState, useEffect, useContext, type CSSProperties } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  Settings2,
  Home,
  TrendingUp,
  CreditCard,
  BarChart3,
} from "lucide-react";
import {
  Navigation,
  type NavItem,
} from "../../design-system/components/Navigation";
import {
  BottomNav,
  type BottomNavItem,
} from "../../design-system/components/BottomNav";
import { SettingsDrawer } from "../../design-system/components/SettingsDrawer";
import {
  spacingNum,
  zIndex,
  fontSize,
  fontWeight,
  radius,
} from "../../design-system/tokens";
import { useBreakpoint, useTheme } from "../../design-system";
import { DashboardContext } from "../../contexts/dashboard/DashboardProvider";

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

// Page title mapping
const PAGE_TITLES: Record<string, string> = {
  "/": "Overview",
  "/insights": "Insights",
  "/transactions": "Transactions",
  "/style-guide": "Style Guide",
};

export function DashboardLayout() {
  const dash = useContext(DashboardContext);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  const location = useLocation();
  const { brand, surface, text: textColors, mode, setMode } = useTheme();

  const pageTitle = PAGE_TITLES[location.pathname] || "Insights";

  // Close settings on mobile viewport change
  useEffect(() => {
    if (isMobile && settingsOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronizing with breakpoint changes
      setSettingsOpen(false);
    }
  }, [isMobile, settingsOpen]);

  const navItems: NavItem[] = [
    {
      id: "overview",
      label: "Overview",
      href: "/",
      icon: <Home size={20} />,
    },
    {
      id: "insights",
      label: "Insights",
      href: "/insights",
      icon: <TrendingUp size={20} />,
    },
    {
      id: "transactions",
      label: "Transactions",
      href: "/transactions",
      icon: <CreditCard size={20} />,
    },
  ];

  const bottomNavItems: BottomNavItem[] = navItems;

  let sidebarOffset: number | string;
  if (isMobile) {
    sidebarOffset = 0;
  } else if (sidebarExpanded) {
    sidebarOffset = "240px";
  } else {
    sidebarOffset = "72px";
  }

  const headerStyles = createDynamicStyles({
    position: "fixed",
    top: 0,
    left: sidebarOffset,
    right: 0,
    height: "64px",
    backgroundColor: surface.surface,
    borderBottom: `1px solid ${surface.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `0 ${spacingNum[6]}px`,
    zIndex: zIndex.sticky,
    transition: "left 250ms cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "var(--shadow-neumorphic-sm)",
  });

  const logoStyles = createDynamicStyles({
    display: "flex",
    alignItems: "center",
    gap: `${spacingNum[3]}px`,
  });

  const iconWrapperStyles = createDynamicStyles({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: brand.primary,
  });

  const titleStyles = createDynamicStyles({
    fontSize: fontSize.h4,
    fontWeight: fontWeight.semibold,
    color: textColors.strong,
    margin: 0,
  });

  const settingsButtonStyles = createDynamicStyles({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "44px",
    height: "44px",
    borderRadius: radius.md,
    border: "none",
    backgroundColor: "transparent",
    color: brand.primary,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "var(--shadow-neumorphic-sm)",
  });

  const mainStyles = createDynamicStyles({
    marginLeft: sidebarOffset,
    marginTop: "64px",
    marginBottom: isMobile ? "72px" : 0,
    minHeight: "calc(100vh - 64px)",
    backgroundColor: surface.surfaceAlt,
    transition: "margin-left 250ms cubic-bezier(0.4, 0, 0.2, 1)",
  });

  const skipLinkStyles = createDynamicStyles({
    position: "absolute",
    left: "-9999px",
    zIndex: 9999,
    padding: `${spacingNum[3]}px ${spacingNum[4]}px`,
    backgroundColor: brand.primary,
    color: "#FFFFFF",
    textDecoration: "none",
    borderRadius: "4px",
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
          e.currentTarget.style.left = "-9999px";
        }}
      >
        Skip to content
      </a>

      {/* Header */}
      <header style={headerStyles}>
        <div style={logoStyles}>
          {dash?.branding?.logo ? (
            <div style={iconWrapperStyles}>{dash.branding.logo}</div>
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
            e.currentTarget.style.boxShadow = "var(--shadow-neumorphic-md)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-neumorphic-sm)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.boxShadow =
              "var(--shadow-neumorphic-pressed)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-neumorphic-sm)";
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
