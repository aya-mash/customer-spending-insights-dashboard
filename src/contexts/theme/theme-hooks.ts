/**
 * THEME HOOKS
 * Custom hooks for theme management
 * Separated from ThemeContext.tsx for Fast Refresh compatibility
 */

import { useContext } from 'react';
import { ThemeContext } from './theme-context';
import type { EffectiveTheme } from './theme-context';

/**
 * Hook to access theme context
 * Use this for components that need to read/change theme mode
 */
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
}

/**
 * Hook to get effective theme (light or dark)
 * Use this for components that only need to read the current theme
 */
export function useTheme(): EffectiveTheme {
  const { effective } = useThemeContext();
  return effective;
}

/**
 * Hook to get effective theme with explicit naming
 * Same as useTheme but more descriptive
 */
export function useEffectiveTheme(): EffectiveTheme {
  const { effective } = useThemeContext();
  return effective;
}
