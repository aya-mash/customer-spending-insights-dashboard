import { useDashboard } from './useDashboard.ts';

export function Header({ rightActions }: Readonly<{ rightActions?: React.ReactNode }>) {
  const { branding, slots } = useDashboard();
  return (
    <header className="dash-header" role="banner">
      <div className="dash-header-inner">
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