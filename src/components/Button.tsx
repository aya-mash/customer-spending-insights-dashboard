import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', loading = false, className = '', children, disabled, ...props }, ref) => {
    const baseClasses = 'btn';
    const variantClasses = `btn--${variant}`;
    const sizeClasses = size === 'small' ? 'btn--small' : size === 'large' ? 'btn--large' : '';
    const classes = [baseClasses, variantClasses, sizeClasses, className].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="btn__spinner" aria-hidden="true">⟳</span>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';