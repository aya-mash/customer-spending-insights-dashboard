import { forwardRef } from 'react';
import type { ComponentProps } from 'react';

interface DrawerProps extends ComponentProps<'div'> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  position?: 'left' | 'right' | 'bottom';
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(({
  isOpen,
  onClose,
  title,
  position = 'right',
  children,
  className = '',
  ...props
}, ref) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div
        ref={ref}
        className={`drawer drawer--${position} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        {...props}
      >
        {title && (
          <div className="drawer__header">
            <h2 className="drawer__title">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="drawer__close"
              aria-label="Close drawer"
            >
              ×
            </button>
          </div>
        )}
        
        <div className="drawer__content">
          {children}
        </div>
      </div>
    </>
  );
});

Drawer.displayName = 'Drawer';