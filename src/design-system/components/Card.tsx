/**
 * CARD COMPONENT
 * Flexible container with variants, elevation, and hover states
 */

import React, { forwardRef, type CSSProperties, type ReactNode, type HTMLAttributes } from 'react';
import {
  brand,
  surface,
  spacing,
  radius,
  shadow,
  transition,
  easing,
  type Spacing,
  type ResponsiveValue,
} from '../tokens';
import { useResponsiveValue, usePrefersReducedMotion } from '../index';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'elevated';
  hover?: boolean;
  padding?: ResponsiveValue<Spacing> | Spacing;
  children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hover = false, padding = 6, children, style, onClick, ...props }, ref) => {
    const resolvedPadding = useResponsiveValue(padding);
    const prefersReducedMotion = usePrefersReducedMotion();

    const baseStyles = createDynamicStyles({
      backgroundColor: surface.surface,
      border: `1px solid ${surface.border}`,
      borderRadius: radius.lg,
      padding: spacing[resolvedPadding as Spacing] || spacing[6],
      boxShadow: shadow.sm,
      transition: prefersReducedMotion ? 'none' : `all ${transition.normal} ${easing.standard}`,
      position: 'relative',
    });

    const variantStyles: Record<string, CSSProperties> = {
      default: {},
      primary: {
        borderColor: brand.primary,
        boxShadow: `0 0 0 1px ${brand.primary}, ${shadow.sm}`,
      },
      elevated: {
        boxShadow: shadow.md,
      },
    };

    const hoverStyles: CSSProperties = hover
      ? {
          cursor: 'pointer',
        }
      : {};

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hover && !prefersReducedMotion) {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = shadow.lg;
        e.currentTarget.style.borderColor = brand.primary;
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hover) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = shadow.sm;
        e.currentTarget.style.borderColor = surface.border;
      }
    };

    return (
      <div
        ref={ref}
        style={{
          ...baseStyles,
          ...variantStyles[variant],
          ...hoverStyles,
          ...style,
        }}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
