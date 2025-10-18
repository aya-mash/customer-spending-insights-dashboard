import { useEffect, useState } from 'react';

function resolveLogo(): string {
  const themeAttr = document.documentElement.dataset.theme; // 'light' | 'dark' | undefined (system)
  const prefersDark = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
  let effective: 'light' | 'dark';
  if (themeAttr === 'dark') effective = 'dark';
  else if (themeAttr === 'light') effective = 'light';
  else effective = prefersDark ? 'dark' : 'light';
  return effective === 'dark' ? '/logo-dark.svg' : '/logo-light.svg';
}

export function Logo() {
  const [src, setSrc] = useState(resolveLogo());
  useEffect(() => {
    function onThemeChange() {
      setSrc(resolveLogo());
    }
    document.addEventListener('themechange', onThemeChange);
    return () => document.removeEventListener('themechange', onThemeChange);
  }, []);
  return (
    <img src={src} alt="Spending Insights" className="app-logo" />
  );
}
