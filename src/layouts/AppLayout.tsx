import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../components/Logo';

function prefetch(page: string) {
  // Fire and forget dynamic import to warm cache
  if (page === 'overview') import('../pages/Overview');
  if (page === 'transactions') import('../pages/Transactions');
  if (page === 'insights') import('../pages/Insights');
  if (page === 'style-guide') import('../pages/StyleGuide');
}

interface AppLayoutProps { readonly children: ReactNode; }

export function AppLayout({ children }: Readonly<AppLayoutProps>) {
  const { pathname } = useLocation();
  const pageTitle = (() => {
    if (pathname === '/' || pathname === '') return 'Overview';
    if (pathname.startsWith('/transactions')) return 'Transactions';
    if (pathname.startsWith('/insights')) return 'Insights';
    if (pathname.startsWith('/style-guide')) return 'Style Guide';
    return 'Page Not Found';
  })();
  return (
    <div className="app-root">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="app-header" role="banner">
        <div className="header-inner">
          <Logo />
          <h1 className="app-title" data-app-title>{pageTitle}</h1>
          <nav aria-label="Main navigation" className="main-nav">
            <ul>
              <li><NavLink to="/" end onMouseEnter={() => prefetch('overview')}>Overview</NavLink></li>
              <li><NavLink to="/transactions" onMouseEnter={() => prefetch('transactions')}>Transactions</NavLink></li>
              <li><NavLink to="/insights" onMouseEnter={() => prefetch('insights')}>Insights</NavLink></li>
              <li><NavLink to="/style-guide" onMouseEnter={() => prefetch('style-guide')}>Style Guide</NavLink></li>
            </ul>
          </nav>
          <div className="grow-spacer" />
          {/* ThemeToggle removed in favor of SettingsDrawer placed in Dashboard layout */}
        </div>
      </header>
      <main id="main-content" className="app-main" role="main">
        {children}
      </main>
    </div>
  );
}