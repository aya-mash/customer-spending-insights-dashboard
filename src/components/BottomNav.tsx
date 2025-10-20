import { forwardRef } from 'react';
import type { ComponentProps } from 'react';
import { useMediaQuery } from '../utils/accessibility';

interface BottomNavProps extends ComponentProps<'nav'> {
  items: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    href: string;
    isActive?: boolean;
  }>;
}

export const BottomNav = forwardRef<HTMLElement, BottomNavProps>(({
  items,
  className = '',
  ...props
}, ref) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (!isMobile) return null;

  return (
    <nav
      ref={ref}
      className={`bottom-nav ${className}`}
      role="navigation"
      aria-label="Main navigation"
      {...props}
    >
      <div className="bottom-nav__container">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`bottom-nav__item ${item.isActive ? 'bottom-nav__item--active' : ''}`}
            aria-current={item.isActive ? 'page' : undefined}
          >
            <span className="bottom-nav__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="bottom-nav__label">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
});

BottomNav.displayName = 'BottomNav';