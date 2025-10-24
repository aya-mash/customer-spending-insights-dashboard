/**
 * Brand-Aligned Chart Configuration for Recharts
 *
 * Production-grade styling for all chart components:
 * - Brand colors for data visualization
 * - Subtle grid lines with proper contrast
 * - Custom tooltips with shadow and padding
 * - Smooth 750ms animations
 * - Clean, minimal axes
 * - Responsive sizing
 * - Accessibility support
 * - Reduced motion respect
 */

import type { CSSProperties } from "react";

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Animation duration - respects reduced motion preference
 */
export const getAnimationDuration = (): number => {
  return prefersReducedMotion() ? 0 : 750;
};

/**
 * CHART COLORS - Brand-aligned palette
 */
export const CHART_COLORS = {
  // Primary data colors
  primary: "#2F70EF" /* Royal Blue */,
  secondary: "#1E313E" /* Te Papa Green */,
  tertiary: "#3B82F6" /* Info Blue */,

  // Semantic colors
  positive: "#10B981", // Success Green
  negative: "#EF4444", // Error Red
  warning: "#F59E0B", // Warning Amber

  // Category colors (financial spending)
  groceries: "#10B981", // Emerald
  entertainment: "#8B5CF6", // Purple
  transport: "#F59E0B", // Amber
  dining: "#EF4444", // Red
  shopping: "#EC4899", // Pink
  utilities: "#06B6D4", // Cyan

  // Multi-series palette (for multiple data lines)
  series: [
    "#2F70EF", // Primary blue
    "#10B981", // Green
    "#F59E0B", // Amber
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#06B6D4", // Cyan
  ],

  // Grid and axes
  grid: "#E5E7EB", // Subtle grid lines (neutral-200)
  axis: "#9CA3AF", // Axis labels (neutral-400)

  // Backgrounds
  tooltipBg: "#FFFFFF",
  tooltipBorder: "#E5E7EB",
};

/**
 * GRID CONFIGURATION - Subtle, minimal grid lines
 */
export const GRID_CONFIG = {
  stroke: CHART_COLORS.grid,
  strokeWidth: 1,
  strokeDasharray: "3 3",
  opacity: 0.5,
};

/**
 * AXIS CONFIGURATION - Clean, minimal styling
 */
export const AXIS_CONFIG = {
  tick: {
    fill: CHART_COLORS.axis,
    fontSize: 12,
    fontFamily: "var(--font-sans)",
  },
  axisLine: {
    stroke: CHART_COLORS.grid,
    strokeWidth: 1,
  },
  tickLine: {
    stroke: CHART_COLORS.grid,
    strokeWidth: 1,
  },
};

/**
 * TOOLTIP CONFIGURATION - Professional, well-styled tooltips
 */
export const TOOLTIP_STYLES: CSSProperties = {
  backgroundColor: CHART_COLORS.tooltipBg,
  border: `1px solid ${CHART_COLORS.tooltipBorder}`,
  borderRadius: "8px",
  padding: "12px 16px",
  boxShadow:
    "0 4px 6px rgba(17, 24, 39, 0.07), 0 2px 4px rgba(17, 24, 39, 0.06)",
  fontSize: "14px",
  fontFamily: "var(--font-sans)",
  color: "#1F2937",
};

export const TOOLTIP_LABEL_STYLE: CSSProperties = {
  fontWeight: 600,
  marginBottom: "8px",
  color: "#111827",
};

export const TOOLTIP_ITEM_STYLE: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "4px",
  fontSize: "13px",
};

/**
 * LEGEND CONFIGURATION - Clean, pill-style legend
 */
export const LEGEND_CONFIG = {
  wrapperStyle: {
    paddingTop: "16px",
    fontSize: "12px",
    fontFamily: "var(--font-sans)",
  },
  iconSize: 12,
  iconType: "circle" as const,
};

/**
 * PIE/DONUT CHART CONFIG - Capitec brand styling
 */
export const PIE_CHART_CONFIG = {
  // Inner radius for donut chart (0 = full pie, 60-70% = donut)
  innerRadius: "60%",
  outerRadius: "85%",

  // Padding between segments
  padAngle: 1,

  // Rounded segment corners
  cornerRadius: 4,

  // Label styling
  label: {
    fill: "#1F2937",
    fontSize: 12,
    fontFamily: "var(--font-sans)",
    fontWeight: 500,
  },

  // Active segment styling (hover)
  activeShape: {
    outerRadius: "90%",
  },
};

/**
 * LINE/AREA CHART CONFIG - Smooth, professional lines
 */
export const LINE_CHART_CONFIG = {
  strokeWidth: 2.5,
  dot: {
    r: 4,
    strokeWidth: 2,
    fill: "#FFFFFF",
  },
  activeDot: {
    r: 6,
    strokeWidth: 2,
  },

  // Area gradient configuration
  areaGradient: {
    id: "areaGradient",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1",
    stopOpacity: [0.8, 0.0],
  },
};

/**
 * BAR CHART CONFIG - Clean, rounded bars
 */
export const BAR_CHART_CONFIG = {
  radius: [8, 8, 0, 0] as [number, number, number, number],
  maxBarSize: 60,
};

/**
 * RESPONSIVE CHART CONTAINER - Proper aspect ratios
 */
export const RESPONSIVE_CONFIG = {
  // Aspect ratio (width / height)
  aspectRatio: {
    standard: 16 / 9, // Wide charts
    square: 1, // Pie/donut charts
    tall: 9 / 16, // Vertical charts
  },

  // Min heights for different chart types
  minHeight: {
    line: 300,
    bar: 280,
    pie: 320,
    area: 300,
  },
};

/**
 * CATEGORY TO COLOR MAPPING
 * @deprecated Use getCategoryColor from categoryUtils.tsx instead
 */
export const getCategoryColor = (
  category: string,
  apiColor?: string
): string => {
  // Use API color if provided
  if (apiColor) {
    return apiColor;
  }

  const normalized = category.toLowerCase();

  if (normalized.includes("grocer") || normalized.includes("food")) {
    return CHART_COLORS.groceries;
  }
  if (normalized.includes("entertainment") || normalized.includes("movie")) {
    return CHART_COLORS.entertainment;
  }
  if (normalized.includes("transport") || normalized.includes("fuel")) {
    return CHART_COLORS.transport;
  }
  if (normalized.includes("dining") || normalized.includes("restaurant")) {
    return CHART_COLORS.dining;
  }
  if (normalized.includes("shopping") || normalized.includes("retail")) {
    return CHART_COLORS.shopping;
  }
  if (normalized.includes("utilities") || normalized.includes("bill")) {
    return CHART_COLORS.utilities;
  }

  return CHART_COLORS.primary;
};

/**
 * FORMAT CURRENCY FOR TOOLTIPS
 */
export const formatTooltipCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * FORMAT PERCENTAGE FOR TOOLTIPS
 */
export const formatTooltipPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * DARK THEME ADJUSTMENTS
 */
export const DARK_THEME_OVERRIDES = {
  grid: "#2E3546",
  axis: "#5A6376",
  tooltipBg: "#1A1F2E",
  tooltipBorder: "#2E3546",
  tooltipText: "#E1E5EC",
};

/**
 * Apply dark theme colors if in dark mode
 */
export const getChartColors = (): typeof CHART_COLORS => {
  if (typeof document === "undefined") return CHART_COLORS;

  const isDark =
    document.documentElement.getAttribute("data-theme") === "dark" ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches &&
      !document.documentElement.getAttribute("data-theme"));

  if (!isDark) return CHART_COLORS;

  return {
    ...CHART_COLORS,
    grid: DARK_THEME_OVERRIDES.grid,
    axis: DARK_THEME_OVERRIDES.axis,
    tooltipBg: DARK_THEME_OVERRIDES.tooltipBg,
    tooltipBorder: DARK_THEME_OVERRIDES.tooltipBorder,
  };
};
