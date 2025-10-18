import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'theme-choice'; // 'light' | 'dark' | 'system'

function systemPref(): 'light' | 'dark' {
  if (typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

function apply(choice: 'light' | 'dark' | 'system') {
  if (choice === 'system') {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = choice;
  }
  const effective = choice === 'system' ? systemPref() : choice;
  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: effective } }));
}

export function useThemeChoice() {
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | 'system' | null;
    return stored || 'system';
  });

  useEffect(() => {
    apply(mode);
    if (mode === 'system') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  }, [mode]);

  const cycle = useCallback(() => {
    setMode(prev => prev === 'system' ? 'dark' : prev === 'dark' ? 'light' : 'system');
  }, []);

  return { mode, setMode, cycle, effective: mode === 'system' ? systemPref() : mode };
}
