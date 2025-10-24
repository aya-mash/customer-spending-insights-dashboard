import type { DashboardConfig } from "../types/dashboard";
import { Logo } from "../../design-system/components/Logo";
import { createElement } from "react";
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Palette,
  Lock,
} from "lucide-react";

function renderLogo() {
  return createElement(Logo);
}
function renderIcon(Icon: typeof LayoutDashboard) {
  return createElement(Icon, { size: 20, strokeWidth: 2 });
}

export const dashboardConfig: DashboardConfig = {
  branding: {
    title: "Customer Insights Dashboard",
    logo: renderLogo(),
    homeUrl: "/",
  },
  navigation: [
    {
      id: "nav-overview",
      type: "page",
      label: "Overview",
      path: "/",
      icon: renderIcon(LayoutDashboard),
    },
    {
      id: "nav-transactions",
      type: "page",
      label: "Transactions",
      path: "/transactions",
      icon: renderIcon(Receipt),
    },
    {
      id: "nav-insights",
      type: "page",
      label: "Insights",
      path: "/insights",
      icon: renderIcon(TrendingUp),
    },
    {
      id: "nav-style",
      type: "page",
      label: "Style Guide",
      path: "/style-guide",
      icon: renderIcon(Palette),
      hidden: process.env.NODE_ENV === "production",
    },
    {
      id: "nav-protected",
      type: "page",
      label: "Protected",
      path: "/protected",
      icon: renderIcon(Lock),
      hidden: true,
    },
  ],
  routes: [
    {
      path: "/",
      label: "Spending Overview",
      component: () =>
        import("../routes/OverviewRoute").then((m) => ({ default: m.default })),
      prefetch: () => import("../routes/OverviewRoute"),
    },
    {
      path: "/transactions",
      label: "Spending Transactions",
      component: () =>
        import("../routes/TransactionsRoute").then((m) => ({
          default: m.default,
        })),
      prefetch: () => import("../routes/TransactionsRoute"),
    },
    {
      path: "/insights",
      label: "Spending Insights",
      component: () =>
        import("../routes/InsightsRoute").then((m) => ({ default: m.default })),
      prefetch: () => import("../routes/InsightsRoute"),
    },
    {
      path: "/profile",
      label: "Profile",
      component: () =>
        import("../../pages/Profile").then((m) => ({ default: m.Profile })),
      prefetch: () => import("../../pages/Profile"),
    },
    {
      path: "/style-guide",
      label: "Style Guide",
      component: () =>
        import("../../pages/StyleGuide").then((m) => ({ default: m.default })),
      prefetch: () => import("../../pages/StyleGuide"),
    },
    {
      path: "/protected",
      label: "Protected",
      component: () =>
        import("../routes/OverviewRoute").then((m) => ({ default: m.default })),
      canActivate: () => false,
      fallback: createElement("div", null, "Access denied"),
    },
    {
      path: "*",
      label: "Not Found",
      component: () =>
        import("../../pages/NotFound").then((m) => ({ default: m.default })),
    },
  ],
  slots: {},
  options: {
    brandVariant: "neutral",
    defaultSidebarCollapsed: false,
    sidebarWidth: 248,
  },
};

export default dashboardConfig;
