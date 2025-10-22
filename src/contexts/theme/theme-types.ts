/**
 * THEME TYPES
 * Shared type definitions for theme system
 */

export type ThemeMode = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

export interface ThemeContextValue {
  /** User's theme choice: 'light' | 'dark' | 'system' */
  mode: ThemeMode;
  /** Actual applied theme after resolving system preference */
  effective: EffectiveTheme;
  /** Change theme mode */
  setMode: (mode: ThemeMode) => void;
  /** Cycle through modes */
  cycle: () => void;
}
