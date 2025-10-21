import { useDashboard } from './useDashboard.ts';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header({ rightActions }: Readonly<{ rightActions?: React.ReactNode }>) {
  const { 
    branding, 
    slots, 
    sidebarCollapsed, 
    toggleSidebar,
    mobileSidebarOpen, 
    setMobileSidebarOpen 
  } = useDashboard();
  
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    function handleResize() { 
      setIsMobile(window.innerWidth < 768); 
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Unified toggle function for both mobile and desktop
  const handleToggle = () => {
    if (isMobile && setMobileSidebarOpen) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      toggleSidebar();
    }
  };

  const isOpen = isMobile ? mobileSidebarOpen : !sidebarCollapsed;

  return (
    <header className="dash-header" role="banner">
      <div className="dash-header-inner">
        {/* Unified sidebar toggle - works for both mobile and desktop */}
        <button
          type="button"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="dash-burger-btn"
          aria-expanded={isOpen}
          onClick={handleToggle}
        >
          {isOpen ? (
            <X size={20} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Menu size={20} strokeWidth={2} aria-hidden="true" />
          )}
        </button>

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