import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive';
  elevation?: 1 | 2 | 3 | 4 | 5;
  children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', elevation = 1, className = '', children, ...props }, ref) => {
    const baseClasses = 'card';
    const variantClasses = variant === 'interactive' ? 'card--interactive' : '';
    const elevationClasses = `card--elevation-${elevation}`;
    const classes = [baseClasses, variantClasses, elevationClasses, className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`card__header ${className}`} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`card__content ${className}`} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`card__footer ${className}`} {...props}>
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';