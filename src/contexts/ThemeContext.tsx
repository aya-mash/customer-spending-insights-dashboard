/**
 * THEME PROVIDER
 * Centralized theme management with Context API + localStorage persistence
 * No forced re-renders - CSS custom properties handle visual updates
 */

import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { ThemeContext } from './theme-context';
import type { ThemeMode, EffectiveTheme, ThemeContextValue } from './theme-types';

const STORAGE_KEY = 'theme-choice';

function getSystemPreference(): EffectiveTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveEffectiveTheme(mode: ThemeMode): EffectiveTheme {
  return mode === 'system' ? getSystemPreference() : mode;
}

function applyTheme(effective: EffectiveTheme, mode: ThemeMode) {
  if (mode === 'system') {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = mode;
  }
  
  // Dispatch custom event for Logo and other components that need to react
  document.dispatchEvent(new CustomEvent('themechange', { 
    detail: { theme: effective, mode } 
  }));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage or default to system
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return (stored === 'light' || stored === 'dark' || stored === 'system') ? stored : 'system';
  });

  const [effective, setEffective] = useState<EffectiveTheme>(() => resolveEffectiveTheme(mode));

  // Apply theme to DOM and update effective theme
  useEffect(() => {
    const newEffective = resolveEffectiveTheme(mode);
    setEffective(newEffective);
    applyTheme(newEffective, mode);

    // Persist to localStorage
    if (mode === 'system') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  }, [mode]);

  // Listen for system preference changes when in system mode
  useEffect(() => {
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const newEffective = getSystemPreference();
      setEffective(newEffective);
      applyTheme(newEffective, 'system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  const cycle = useCallback(() => {
    setModeState(prev => {
      if (prev === 'system') return 'dark';
      if (prev === 'dark') return 'light';
      return 'system';
    });
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value: ThemeContextValue = useMemo(() => ({
    mode,
    effective,
    setMode,
    cycle,
  }), [mode, effective, setMode, cycle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Hooks are exported from theme-hooks.ts for Fast Refresh compatibility
