import { useDashboard } from './useDashboard.ts';
import { useEffect, useState } from 'react';

export function Header({ rightActions }: Readonly<{ rightActions?: React.ReactNode }>) {
  const { branding, slots, mobileSidebarOpen, setMobileSidebarOpen } = useDashboard();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function handleResize() { setIsMobile(window.innerWidth < 768); }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <header className="dash-header" role="banner">
      <div className="dash-header-inner">
        {isMobile && (
          <button
            type="button"
            aria-label={mobileSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="dash-burger-btn"
            aria-expanded={mobileSidebarOpen}
            onClick={() => (setMobileSidebarOpen ? setMobileSidebarOpen(!mobileSidebarOpen) : void 0)}
          >☰</button>
        )}
        <a href={branding.homeUrl || '/'} className="dash-brand" aria-label={branding.title}>
          {branding.logo}
        </a>
        {slots?.appTitle || <h1 className="dash-title-text">{branding.title}</h1>}
        <div className="dash-header-grow" />
        {slots?.headerActions}
        {rightActions}
        {slots?.accountMenu}
      </div>
    </header>
  );
}