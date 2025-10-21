/**
 * THEME HOOK
 * Forces re-render when theme changes to update CSS variable-based tokens
 */

import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<string>(() => {
    return document.documentElement.dataset.theme || 'system';
  });

  useEffect(() => {
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          setTheme(document.documentElement.dataset.theme || 'system');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Also listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Force re-render if we're in system mode
      if (!document.documentElement.dataset.theme) {
        setTheme('system-' + (mediaQuery.matches ? 'dark' : 'light'));
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return theme;
}

// Hook to get current effective theme (light or dark)
export function useEffectiveTheme(): 'light' | 'dark' {
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => {
    const dataTheme = document.documentElement.dataset.theme;
    if (dataTheme === 'light' || dataTheme === 'dark') {
      return dataTheme;
    }
    // System mode
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const updateTheme = () => {
      const dataTheme = document.documentElement.dataset.theme;
      if (dataTheme === 'light' || dataTheme === 'dark') {
        setEffectiveTheme(dataTheme);
      } else {
        setEffectiveTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      }
    };

    // Watch for data-theme attribute changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Watch for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', updateTheme);
    };
  }, []);

  return effectiveTheme;
}
