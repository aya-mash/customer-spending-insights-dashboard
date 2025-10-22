/**
 * DESIGN SYSTEM - Core Utilities & Helpers
 * Responsive utilities, media queries, formatters, and type-safe helpers
 */

import { useState, useEffect } from 'react';
import { breakpoints, mediaQueries, type Breakpoint, type ResponsiveValue } from './tokens';

// Re-export unified theme hook from design system hooks folder
export { 
  useTheme, 
  type UseThemeReturn,
  type ThemeTokens, 
  type BrandColors, 
  type NeutralPalette, 
  type SurfaceColors, 
  type TextColors 
} from './hooks/useTheme';

// =============================================================================
// BREAKPOINT HOOKS
// =============================================================================

/**
 * Get current breakpoint based on window width
 * Returns: 'mobile' | 'mobileLg' | 'tablet' | 'desktop' | 'desktopLg' | 'wide'
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (globalThis.window === undefined) return 'desktop';
    const width = globalThis.window.innerWidth;
    if (width >= breakpoints.wide) return 'wide';
    if (width >= breakpoints.desktopLg) return 'desktopLg';
    if (width >= breakpoints.desktop) return 'desktop';
    if (width >= breakpoints.tablet) return 'tablet';
    if (width >= breakpoints.mobileLg) return 'mobileLg';
    return 'mobile';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = globalThis.window.innerWidth;
      let newBreakpoint: Breakpoint;
      if (width >= breakpoints.wide) newBreakpoint = 'wide';
      else if (width >= breakpoints.desktopLg) newBreakpoint = 'desktopLg';
      else if (width >= breakpoints.desktop) newBreakpoint = 'desktop';
      else if (width >= breakpoints.tablet) newBreakpoint = 'tablet';
      else if (width >= breakpoints.mobileLg) newBreakpoint = 'mobileLg';
      else newBreakpoint = 'mobile';
      
      if (newBreakpoint !== breakpoint) {
        setBreakpoint(newBreakpoint);
      }
    };

    globalThis.window.addEventListener('resize', handleResize);
    return () => globalThis.window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return breakpoint;
}

/**
 * Check if current viewport matches a media query
 * @param query - Media query string or breakpoint name
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (globalThis.window === undefined) return false;
    return globalThis.window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = globalThis.window.matchMedia(query);
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // Modern browsers
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

/**
 * Check if viewport is at or above a specific breakpoint
 */
export function useMinWidth(breakpoint: Breakpoint): boolean {
  return useMediaQuery(mediaQueries[breakpoint]);
}

/**
 * Check if viewport is mobile (< tablet)
 */
export function useIsMobile(): boolean {
  return !useMinWidth('tablet');
}

/**
 * Check if viewport is desktop (>= desktop)
 */
export function useIsDesktop(): boolean {
  return useMinWidth('desktop');
}

// =============================================================================
// RESPONSIVE VALUE RESOLUTION
// =============================================================================

/**
 * Get responsive value based on current breakpoint
 * Mobile-first: returns mobile value by default, then tablet, then desktop
 */
export function useResponsiveValue<T>(values: ResponsiveValue<T> | T): T {
  const breakpoint = useBreakpoint();
  
  if (typeof values !== 'object' || values === null || !('mobile' in values)) {
    return values;
  }

  const { mobile, tablet, desktop } = values;

  // Desktop and above
  if (breakpoint === 'wide' || breakpoint === 'desktopLg' || breakpoint === 'desktop') {
    return desktop ?? tablet ?? mobile;
  }
  
  // Tablet
  if (breakpoint === 'tablet') {
    return tablet ?? mobile;
  }
  
  // Mobile
  return mobile;
}

/**
 * Get responsive value without hook (for SSR or static usage)
 */
export function getResponsiveValue<T>(
  values: ResponsiveValue<T> | T,
  currentBreakpoint: Breakpoint
): T {
  if (typeof values !== 'object' || values === null || !('mobile' in values)) {
    return values;
  }

  const { mobile, tablet, desktop } = values;

  if (currentBreakpoint === 'wide' || currentBreakpoint === 'desktopLg' || currentBreakpoint === 'desktop') {
    return desktop ?? tablet ?? mobile;
  }
  
  if (currentBreakpoint === 'tablet' || currentBreakpoint === 'mobileLg') {
    return tablet ?? mobile;
  }
  
  return mobile;
}

// =============================================================================
// MEDIA QUERY GENERATORS
// =============================================================================

/**
 * Generate media query string for min-width
 */
export function minWidth(px: number | string): string {
  const value = typeof px === 'number' ? `${px}px` : px;
  return `(min-width: ${value})`;
}

/**
 * Generate media query string for max-width
 */
export function maxWidth(px: number | string): string {
  const value = typeof px === 'number' ? `${px}px` : px;
  return `(max-width: ${value})`;
}

/**
 * Generate media query string for range
 */
export function between(min: number | string, max: number | string): string {
  const minValue = typeof min === 'number' ? `${min}px` : min;
  const maxValue = typeof max === 'number' ? `${max}px` : max;
  return `(min-width: ${minValue}) and (max-width: ${maxValue})`;
}

// =============================================================================
// MOTION PREFERENCES
// =============================================================================

/**
 * Check if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Get animation duration based on motion preference
 */
export function useAnimationDuration(duration: number): number {
  const prefersReducedMotion = usePrefersReducedMotion();
  return prefersReducedMotion ? 0 : duration;
}

// =============================================================================
// STYLE UTILITIES
// =============================================================================

/**
 * Combine class names, filtering out falsy values
 */
export function cx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Create inline styles object from tokens
 */
export function createStyles<T extends Record<string, string | number>>(styles: T): T {
  return styles;
}

/**
 * Convert spacing token to CSS value
 */
export function spacing(...values: (string | number)[]): string {
  return values.map(v => (typeof v === 'number' ? `${v}px` : v)).join(' ');
}

// =============================================================================
// GRID UTILITIES
// =============================================================================

export interface GridColumns {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}

/**
 * Get grid template columns CSS based on responsive column count
 */
export function getGridColumns(columns: GridColumns | number): string {
  if (typeof columns === 'number') {
    return `repeat(${columns}, 1fr)`;
  }
  // For responsive, return mobile by default (CSS will override with media queries)
  return `repeat(${columns.mobile ?? 1}, 1fr)`;
}

// =============================================================================
// COLOR UTILITIES
// =============================================================================

/**
 * Convert hex to rgba
 */
export function hexToRgba(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Get category color by name
 */
export function getCategoryColor(category: string): string {
  const categoryMap: Record<string, string> = {
    groceries: '#10B981',
    entertainment: '#8B5CF6',
    transport: '#F59E0B',
    dining: '#EF4444',
    shopping: '#EC4899',
    utilities: '#06B6D4',
  };
  return categoryMap[category.toLowerCase()] || '#6B7280';
}

// =============================================================================
// FORMAT UTILITIES
// =============================================================================

/**
 * Format currency (South African Rand)
 */
export function formatCurrency(amount: number, options?: { showSign?: boolean }): string {
  const formatted = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  if (options?.showSign && amount < 0) {
    return `-${formatted}`;
  }
  return formatted;
}

/**
 * Format number with abbreviation (k, M, B)
 */
export function formatNumber(num: number, decimals: number = 1): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(decimals)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(decimals)}k`;
  }
  return num.toString();
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format date
 */
export function formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'long') {
    return d.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return d.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// =============================================================================
// ACCESSIBILITY UTILITIES
// =============================================================================

/**
 * Generate accessible label for screen readers
 */
export function srOnly(): React.CSSProperties {
  return {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  };
}

/**
 * Check if element should be keyboard focusable
 */
export function useKeyboardUser(): boolean {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    globalThis.window.addEventListener('keydown', handleKeyDown);
    globalThis.window.addEventListener('mousedown', handleMouseDown);

    return () => {
      globalThis.window.removeEventListener('keydown', handleKeyDown);
      globalThis.window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return isKeyboardUser;
}

// =============================================================================
// CHART UTILITIES
// =============================================================================

/**
 * Get responsive chart height
 */
export function useChartHeight(): number {
  const breakpoint = useBreakpoint();
  
  if (breakpoint === 'desktop' || breakpoint === 'desktopLg' || breakpoint === 'wide') {
    return 300;
  }
  if (breakpoint === 'tablet') {
    return 250;
  }
  return 200;
}

/**
 * Get abbreviated value for small screens
 */
export function getChartLabel(value: number, isSmallScreen: boolean): string {
  if (isSmallScreen) {
    return formatNumber(value, 0);
  }
  return value.toLocaleString();
}

// =============================================================================
// EXPORTS
// =============================================================================

export * from './tokens';

// Components
export { ErrorPage } from './components/ErrorPage';
export { ErrorBoundary } from './components/ErrorBoundary';
export { Logo } from './components/Logo';
export { AsyncSection as Skeleton } from './components/Skeleton';
export { default as TrendsChart } from './components/TrendsChart';
export { ContrastCheckerPanel } from './components/ContrastCheckerPanel';
export { ContrastCheckerDev as ContrastCheckerFab } from './components/ContrastCheckerFab';

// =============================================================================
// Re-export all tokens for convenience
export * from './tokens';

