import { useEffect, useState } from 'react';

function getTheme(): 'dark' | 'light' {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function Logo() {
  const [theme, setTheme] = useState<'dark' | 'light'>(getTheme());
  useEffect(() => {
    const handler = () => setTheme(getTheme());
    document.addEventListener('themechange', handler);
    return () => document.removeEventListener('themechange', handler);
  }, []);
  const src = theme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg';
  return <img src={src} alt="Spending Insights" className="app-logo" />;
}