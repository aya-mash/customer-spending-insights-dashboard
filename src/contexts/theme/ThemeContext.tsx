/**
 * THEME PROVIDER
 * Centralized theme management with Context API + localStorage persistence
 * Instant theme switching via root data attributes and color-scheme
 */

import {
  useState,
  useLayoutEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { ThemeContext } from "./theme-context";
import type {
  ThemeMode,
  EffectiveTheme,
  ThemeContextValue,
} from "./theme-types";

const STORAGE_KEY = "theme-choice";

function getSystemPreference(): EffectiveTheme {
  if (globalThis.window === undefined) return "light";
  return globalThis.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveEffectiveTheme(mode: ThemeMode): EffectiveTheme {
  return mode === "system" ? getSystemPreference() : mode;
}

function applyTheme(effective: EffectiveTheme, mode: ThemeMode) {
  const root = document.documentElement;
  const body = document.body;

  // Add transitioning class to prevent flicker
  body.classList.add('theme-transitioning');

  // ALWAYS set both attributes - never clear them
  root.dataset.theme = effective; // The effective theme (what's actually applied)
  root.dataset.mode = mode; // The user's selection (system/light/dark)

  // Set color-scheme for native browser UI
  root.style.colorScheme = effective;

  // Remove transitioning class after a frame to allow smooth transitions
  requestAnimationFrame(() => {
    setTimeout(() => {
      body.classList.remove('theme-transitioning');
    }, 0);
  });

  // Dispatch custom event for components that need instant updates
  document.dispatchEvent(
    new CustomEvent("themechange", {
      detail: { theme: effective, mode },
    })
  );
}

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  // Initialize from localStorage or default to LIGHT (production-ready default)
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (globalThis.window === undefined) return "light";
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : "light";
  });

  const [effective, setEffective] = useState<EffectiveTheme>(() =>
    resolveEffectiveTheme(mode)
  );

  // Apply theme to DOM BEFORE paint (prevents flicker)
  useLayoutEffect(() => {
    const newEffective = resolveEffectiveTheme(mode);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronizing derived state from mode prop
    setEffective(newEffective);
    applyTheme(newEffective, mode);

    // Persist to localStorage
    if (mode === "system") {
      localStorage.setItem(STORAGE_KEY, "system");
    } else {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  }, [mode]);

  // Listen for system preference changes when in system mode
  useLayoutEffect(() => {
    if (mode !== "system") return;

    const mediaQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const newEffective = getSystemPreference();
      setEffective(newEffective);
      applyTheme(newEffective, "system");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode]);

  const cycle = useCallback(() => {
    setMode((prev: ThemeMode) => {
      if (prev === "system") return "dark";
      if (prev === "dark") return "light";
      return "system";
    });
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value: ThemeContextValue = useMemo(
    () => ({
      mode,
      effective,
      setMode,
      cycle,
    }),
    [mode, effective, setMode, cycle]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Hooks are exported from theme-hooks.ts for Fast Refresh compatibility
