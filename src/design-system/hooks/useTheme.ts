/**
 * USE THEME HOOK
 * Unified theme hook providing:
 * - Theme mode management (light/dark/system)
 * - Effective theme (resolved light or dark)
 * - Dynamic theme-reactive color tokens
 * 
 * Architecture:
 * - Context: /contexts/theme/ThemeContext.tsx (theme state management)
 * - Hook: /design-system/hooks/useTheme.ts (this file - unified API)
 * - Tokens: /design-system/tokens.ts (static design values only)
 */

import { useContext, useState, useEffect, useMemo } from 'react';
import { ThemeContext } from '../../contexts/theme/theme-context';
import type { EffectiveTheme } from '../../contexts/theme/theme-context';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface BrandColors {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  secondary: string;
  secondaryHover: string;
  accent: string;
  accentHover: string;
}

export interface NeutralPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface SurfaceColors {
  bg: string;
  surface: string;
  card: string;
  surfaceAlt: string;
  surfaceElevated: string;
  hover: string;
  border: string;
  borderStrong: string;
  overlay: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  strong: string;
  muted: string;
  disabled: string;
  inverse: string;
  placeholder: string;
}

export interface ThemeTokens {
  brand: BrandColors;
  neutral: NeutralPalette;
  surface: SurfaceColors;
  text: TextColors;
}

export interface UseThemeReturn {
  // Theme mode management
  mode: 'light' | 'dark' | 'system';
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  cycle: () => void;
  
  // Effective theme
  effective: EffectiveTheme;
  
  // Dynamic color tokens
  tokens: ThemeTokens;
  
  // Convenience - direct access to token categories
  brand: BrandColors;
  neutral: NeutralPalette;
  surface: SurfaceColors;
  text: TextColors;
  
  // Responsive breakpoints
  breakpoint: 'mobile' | 'mobileLg' | 'tablet' | 'desktop' | 'desktopLg' | 'wide';
  isMobile: boolean;
  isDesktop: boolean;
}

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

function getCSSVar(varName: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback;
}

function computeThemeTokens(): ThemeTokens {
  return {
    brand: {
      primary: getCSSVar('--brand-primary', '#2F70EF'),
      primaryHover: getCSSVar('--brand-primary-hover', '#1E5CD8'),
      primaryActive: getCSSVar('--brand-primary-active', '#0F47B5'),
      secondary: getCSSVar('--brand-secondary', '#1E313E'),
      secondaryHover: getCSSVar('--brand-secondary-hover', '#152530'),
      accent: getCSSVar('--brand-accent', '#4111A4'),
      accentHover: getCSSVar('--brand-accent-hover', '#2E0B73'),
    },
    neutral: {
      50: getCSSVar('--neutral-50', '#F9FAFB'),
      100: getCSSVar('--neutral-100', '#F3F4F6'),
      200: getCSSVar('--neutral-200', '#E5E7EB'),
      300: getCSSVar('--neutral-300', '#D1D5DB'),
      400: getCSSVar('--neutral-400', '#9CA3AF'),
      500: getCSSVar('--neutral-500', '#6B7280'),
      600: getCSSVar('--neutral-600', '#4B5563'),
      700: getCSSVar('--neutral-700', '#374151'),
      800: getCSSVar('--neutral-800', '#1F2937'),
      900: getCSSVar('--neutral-900', '#111827'),
    },
    surface: {
      bg: getCSSVar('--color-bg', '#EBF0F5'),
      surface: getCSSVar('--color-surface', '#EBF0F5'),
      card: getCSSVar('--color-surface', '#EBF0F5'),
      surfaceAlt: getCSSVar('--color-surface-alt', '#F0F4F8'),
      surfaceElevated: getCSSVar('--color-surface-elevated', '#EBF0F5'),
      hover: getCSSVar('--color-surface-alt', '#F3F4F6'),
      border: getCSSVar('--color-border', 'rgba(163, 177, 198, 0.15)'),
      borderStrong: getCSSVar('--color-border-strong', 'rgba(163, 177, 198, 0.25)'),
      overlay: getCSSVar('--color-overlay', 'rgba(0, 0, 0, 0.4)'),
    },
    text: {
      primary: getCSSVar('--color-text', '#1F2937'),
      secondary: getCSSVar('--color-text-muted', '#6B7280'),
      strong: getCSSVar('--color-text-strong', '#111827'),
      muted: getCSSVar('--color-text-muted', '#6B7280'),
      disabled: getCSSVar('--color-text-disabled', '#9CA3AF'),
      inverse: getCSSVar('--color-text-inverse', '#FFFFFF'),
      placeholder: getCSSVar('--color-text-placeholder', '#9CA3AF'),
    },
  };
}

// =============================================================================
// UNIFIED HOOK
// =============================================================================

/**
 * Unified theme hook providing theme management and dynamic color tokens.
 * 
 * @returns {UseThemeReturn} Complete theme API
 * 
 * @example
 * ```tsx
 * // Use in components for theme management
 * function ThemeToggle() {
 *   const { mode, setMode, effective } = useTheme();
 *   return (
 *     <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
 *       Current: {effective}
 *     </button>
 *   );
 * }
 * 
 * // Use in components for dynamic colors
 * function Card() {
 *   const { brand, surface, text } = useTheme();
 *   return (
 *     <div style={{
 *       backgroundColor: surface.card,
 *       color: text.primary,
 *       borderColor: brand.primary
 *     }}>
 *       Content
 *     </div>
 *   );
 * }
 * ```
 */
export function useTheme(): UseThemeReturn {
  // Get theme context
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  const { mode, setMode, cycle, effective, breakpoint, isMobile, isDesktop } = context;
  
  // Force re-computation trigger - increments when theme changes
  const [recomputeTrigger, setRecomputeTrigger] = useState(0);
  
  // Listen for theme changes and trigger recomputation
  useEffect(() => {
    const handleThemeChange = () => {
      setRecomputeTrigger(prev => prev + 1);
    };
    
    document.addEventListener('themechange', handleThemeChange);
    return () => document.removeEventListener('themechange', handleThemeChange);
  }, []);
  
  // Compute tokens reactively - recalculates when trigger changes
  // recomputeTrigger IS necessary - it's our reactive signal to force token recomputation
  // when theme switches. computeThemeTokens() reads CSS vars from DOM.
  const tokens = useMemo<ThemeTokens>(() => {
    return computeThemeTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recomputeTrigger is intentional for forcing recalculation
  }, [recomputeTrigger]);
  
  // Memoize return object to prevent unnecessary re-renders
  return useMemo(() => ({
    // Theme mode management
    mode,
    setMode,
    cycle,
    effective,
    
    // Tokens
    tokens,
    
    // Convenience - direct access
    brand: tokens.brand,
    neutral: tokens.neutral,
    surface: tokens.surface,
    text: tokens.text,
    
    // Responsive breakpoints
    breakpoint,
    isMobile,
    isDesktop,
  }), [mode, setMode, cycle, effective, tokens, breakpoint, isMobile, isDesktop]);
}
