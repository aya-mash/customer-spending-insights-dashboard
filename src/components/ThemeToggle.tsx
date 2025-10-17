import { useEffect, useState } from 'react';

const STORAGE_KEY = 'theme-choice'; // 'light' | 'dark' | 'system'

function apply(choice: 'light' | 'dark') {
  if (choice === 'dark') {
    document.documentElement.dataset.theme = 'dark';
  } else {
    delete document.documentElement.dataset.theme; // light is implicit
  }
  // Notify listeners (StyleGuide) that theme changed
  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: choice } }));
}

function systemPref(): 'light' | 'dark' {
  if (typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

export function ThemeToggle() {
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | 'system' | null;
    return stored || 'system';
  });

  useEffect(() => {
    const effective = mode === 'system' ? systemPref() : mode;
    apply(effective);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const effective = mode === 'system' ? systemPref() : mode;
  const next = effective === 'light' ? 'dark' : 'light';
  const label = effective === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
  const icon = effective === 'light' ? '☀️' : '🌙';

  return (
    <div className="theme-toggle-group">
      <button
        type="button"
        className="theme-icon-btn"
        aria-pressed={effective === 'dark'}
        aria-label={label}
        title={label}
        onClick={() => setMode(next)}
      >
        <span aria-hidden="true" className="theme-icon">{icon}</span>
      </button>
      {mode !== 'system' && (
        <button
          type="button"
          className="theme-reset-btn"
          aria-label="Reset to system theme"
          onClick={() => setMode('system')}
        >↺</button>
      )}
    </div>
  );
}
