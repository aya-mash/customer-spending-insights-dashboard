/**
 * DESIGN TOKENS - Static Design System Values
 *
 * This file contains ONLY static design values that don't change with theme.
 * For theme-reactive colors (brand, neutral, surface, text), use useThemeTokens() hook.
 *
 * Separation of Concerns:
 * - tokens.ts: Static values (spacing, typography, radius, shadows, etc.)
 * - useThemeTokens.ts: Theme-reactive colors (brand, surface, text, neutral)
 */

// =============================================================================
// SEMANTIC COLORS (static - don't change with theme)
// =============================================================================

export const semantic = {
  success: "#10B981",
  successLight: "#D1FAE5",
  successDark: "#047857",

  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  warningDark: "#D97706",

  error: "#EF4444",
  errorLight: "#FEE2E2",
  errorDark: "#DC2626",

  info: "#3B82F6",
  infoLight: "#DBEAFE",
  infoDark: "#1D4ED8",
} as const;

// =============================================================================
// CATEGORY COLORS (Financial Spending)
// =============================================================================

export const categories = {
  groceries: {
    main: "#10B981",
    light: "#D1FAE5",
    icon: "#059669",
  },
  entertainment: {
    main: "#8B5CF6",
    light: "#EDE9FE",
    icon: "#7C3AED",
  },
  transport: {
    main: "#F59E0B",
    light: "#FEF3C7",
    icon: "#D97706",
  },
  dining: {
    main: "#EF4444",
    light: "#FEE2E2",
    icon: "#DC2626",
  },
  shopping: {
    main: "#EC4899",
    light: "#FCE7F3",
    icon: "#DB2777",
  },
  utilities: {
    main: "#06B6D4",
    light: "#CFFAFE",
    icon: "#0891B2",
  },
} as const;

// =============================================================================
// SPACING SCALE (4px base unit)
// =============================================================================

export const spacing = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
} as const;

// Numeric versions for calculations
export const spacingNum = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

// =============================================================================
// RESPONSIVE PAGE PADDING
// =============================================================================

export const pagePadding = {
  mobile: "16px",
  tablet: "24px",
  desktop: "32px",
} as const;

// =============================================================================
// TYPOGRAPHY SCALE
// =============================================================================

export const fontSize = {
  display: "48px",
  h1: "32px",
  h2: "24px",
  h3: "20px",
  h4: "18px",
  bodyLg: "16px",
  body: "14px",
  bodySm: "12px",
  caption: "11px",
  label: "14px",
} as const;

export const fontSizeNum = {
  display: 48,
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 18,
  bodyLg: 16,
  body: 14,
  bodySm: 12,
  caption: 11,
  label: 14,
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const fontFamily = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: '"SF Mono", Monaco, "Cascadia Code", "Courier New", monospace',
} as const;

// =============================================================================
// BORDER RADIUS - Soft Modern
// =============================================================================

export const radius = {
  sm: "6px",
  md: "10px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  full: "9999px",
} as const;

// =============================================================================
// SHADOWS - Soft Modern Elevation (softer, more diffused)
// =============================================================================

export const shadow = {
  xs: "0 1px 2px rgba(17, 24, 39, 0.04)",
  sm: "0 2px 4px rgba(17, 24, 39, 0.06), 0 1px 2px rgba(17, 24, 39, 0.04)",
  md: "0 4px 8px rgba(17, 24, 39, 0.08), 0 2px 4px rgba(17, 24, 39, 0.04)",
  lg: "0 8px 16px rgba(17, 24, 39, 0.10), 0 4px 6px rgba(17, 24, 39, 0.06)",
  xl: "0 12px 24px rgba(17, 24, 39, 0.12), 0 8px 12px rgba(17, 24, 39, 0.06)",
  "2xl":
    "0 20px 40px rgba(17, 24, 39, 0.16), 0 12px 16px rgba(17, 24, 39, 0.08)",
} as const;

// =============================================================================
// TRANSITIONS
// =============================================================================

export const transition = {
  fast: "150ms",
  normal: "250ms",
  slow: "350ms",
} as const;

export const easing = {
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  decelerate: "cubic-bezier(0, 0, 0.2, 1)",
  accelerate: "cubic-bezier(0.4, 0, 1, 1)",
} as const;

// =============================================================================
// BREAKPOINTS (Mobile-First)
// =============================================================================

export const breakpoints = {
  mobile: 320,
  mobileLg: 480,
  tablet: 768,
  desktop: 1024,
  desktopLg: 1440,
  wide: 1920,
} as const;

export const breakpointsPx = {
  mobile: "320px",
  mobileLg: "480px",
  tablet: "768px",
  desktop: "1024px",
  desktopLg: "1440px",
  wide: "1920px",
} as const;

// Media query strings (mobile-first)
export const mediaQueries = {
  mobile: `(min-width: ${breakpointsPx.mobile})`,
  mobileLg: `(min-width: ${breakpointsPx.mobileLg})`,
  tablet: `(min-width: ${breakpointsPx.tablet})`,
  desktop: `(min-width: ${breakpointsPx.desktop})`,
  desktopLg: `(min-width: ${breakpointsPx.desktopLg})`,
  wide: `(min-width: ${breakpointsPx.wide})`,
} as const;

// =============================================================================
// Z-INDEX SCALE
// =============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1700,
  fixed: 1200,
  overlay: 1300,
  modalBackdrop: 1750,
  drawer: 1800,
  modal: 1800,
  popover: 1500,
  tooltip: 1600,
  navigation: 1200,
  bottomNav: 1700,
} as const;

// =============================================================================
// FOCUS RING (static - uses CSS variable reference)
// =============================================================================

export const focus = {
  ringWidth: "3px",
  ringColor: "var(--brand-primary)", // Reference CSS variable directly
  ringOffset: "2px",
} as const;

// =============================================================================
// LAYOUT CONSTRAINTS
// =============================================================================

export const layout = {
  maxWidth: "1440px",
  contentMaxWidth: "1280px",
  sidebarWidth: "240px",
  sidebarCollapsedWidth: "64px",
  headerHeight: "64px",
  bottomBarHeight: "72px",
} as const;

// =============================================================================
// TOUCH TARGETS
// =============================================================================

export const touchTarget = {
  minimum: "44px",
  comfortable: "48px",
} as const;

// =============================================================================
// RESPONSIVE TYPOGRAPHY (Mobile-First)
// =============================================================================

export interface ResponsiveValue<T> {
  mobile: T;
  tablet?: T;
  desktop?: T;
}

export const responsiveTypography = {
  display: {
    mobile: fontSizeNum.h1, // 32px
    tablet: 40,
    desktop: fontSizeNum.display, // 48px
  },
  h1: {
    mobile: fontSize.h2, // 24px
    tablet: "28px",
    desktop: fontSize.h1, // 32px
  },
  h2: {
    mobile: fontSize.h3, // 20px
    tablet: "22px",
    desktop: fontSize.h2, // 24px
  },
  h3: {
    mobile: fontSize.h4, // 18px
    tablet: fontSize.h3, // 20px
    desktop: fontSize.h3, // 20px
  },
} as const;

// =============================================================================
// RESPONSIVE SPACING
// =============================================================================

export const responsiveSpacing = {
  pageX: {
    mobile: pagePadding.mobile,
    tablet: pagePadding.tablet,
    desktop: pagePadding.desktop,
  },
  pageY: {
    mobile: spacing[6],
    tablet: spacing[8],
    desktop: spacing[12],
  },
  sectionGap: {
    mobile: spacing[6],
    tablet: spacing[8],
    desktop: spacing[12],
  },
  cardPadding: {
    mobile: spacing[4],
    tablet: spacing[5],
    desktop: spacing[6],
  },
  gridGap: {
    mobile: spacing[4],
    tablet: spacing[5],
    desktop: spacing[6],
  },
} as const;

// =============================================================================
// UTILITY TYPE EXPORTS
// =============================================================================

export type Spacing = keyof typeof spacing;
export type FontSize = keyof typeof fontSize;
export type FontWeight = keyof typeof fontWeight;
export type Radius = keyof typeof radius;
export type Shadow = keyof typeof shadow;
export type Breakpoint = keyof typeof breakpoints;
export type CategoryName = keyof typeof categories;

// =============================================================================
// TOKEN COLLECTIONS (for iteration - static tokens only)
// =============================================================================

export const tokens = {
  semantic,
  categories,
  spacing,
  spacingNum,
  pagePadding,
  fontSize,
  fontSizeNum,
  lineHeight,
  fontWeight,
  fontFamily,
  radius,
  shadow,
  transition,
  easing,
  breakpoints,
  breakpointsPx,
  mediaQueries,
  zIndex,
  focus,
  layout,
  touchTarget,
  responsiveTypography,
  responsiveSpacing,
} as const;

export default tokens;
