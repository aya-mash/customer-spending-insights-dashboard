/**
 * THEME CONTEXT
 * React context definition for theme system
 * Separated for Fast Refresh compatibility
 */

import { createContext } from 'react';
import type { ThemeContextValue } from './theme-types';

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Re-export types for convenience
export type { ThemeMode, ThemeContextValue, EffectiveTheme } from './theme-types';
