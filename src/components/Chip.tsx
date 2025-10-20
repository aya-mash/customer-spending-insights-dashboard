import { forwardRef } from 'react';
import type { ComponentProps } from 'react';

export interface ChipProps extends ComponentProps<'button'> {
  variant?: 'default' | 'selected' | 'filter' | 'legend';
  size?: 'sm' | 'md';
  onRemove?: () => void;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(({
  variant = 'default',
  size = 'md',
  onRemove,
  children,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'chip';
  const variantClass = variant !== 'default' ? `chip--${variant}` : '';
  const sizeClass = size !== 'md' ? `chip--${size}` : '';
  
  const classes = [baseClasses, variantClass, sizeClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
      {onRemove && (
        <span 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="chip__remove"
          aria-label="Remove"
        >
          ×
        </span>
      )}
    </button>
  );
});

Chip.displayName = 'Chip';