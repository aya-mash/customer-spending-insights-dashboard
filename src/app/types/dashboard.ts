import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';

export interface BrandingConfig {
  title: string;
  logo?: ReactNode;
  homeUrl?: string;
}

export interface NavigationItemBase {
  id: string;
  label?: string;
  icon?: ReactNode;
  children?: NavigationItem[];
  hidden?: boolean;
}

export interface NavigationPageItem extends NavigationItemBase {
  type: 'page';
  path: string; // React Router path
  exact?: boolean;
}

export interface NavigationGroupItem extends NavigationItemBase {
  type: 'group';
}

export interface NavigationDividerItem extends NavigationItemBase {
  type: 'divider';
}

export type NavigationItem = NavigationPageItem | NavigationGroupItem | NavigationDividerItem;

export interface RouteConfig {
  path: string;
  label: string;
  /** Dynamic import returning component default export */
  component: () => Promise<{ default: React.ComponentType<unknown> }>;
  /** Optional prefetch for heavier data or additional chunks */
  prefetch?: () => Promise<unknown> | void;
  /** Optional activation guard */
  canActivate?: () => boolean | Promise<boolean>;
  /** Optional fallback ReactNode shown if guard resolves false */
  fallback?: ReactNode;
}

export interface DashboardSlots {
  headerActions?: ReactNode;
  accountMenu?: ReactNode;
  sidebarFooter?: ReactNode;
  appTitle?: ReactNode; // Override default title text block
}

export interface DashboardOptions {
  defaultSidebarCollapsed?: boolean;
  sidebarWidth?: number | string;
  brandVariant?: 'capitec' | 'neutral';
}

export interface DashboardConfig {
  branding: BrandingConfig;
  navigation: NavigationItem[];
  routes: RouteConfig[];
  slots?: DashboardSlots;
  options?: DashboardOptions;
}

export interface DashboardContextValue extends DashboardConfig {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export type RouteGenerationResult = RouteObject[];