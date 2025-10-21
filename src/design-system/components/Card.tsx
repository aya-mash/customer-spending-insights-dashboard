/**
 * CARD COMPONENT
 * Flexible container with variants, elevation, and hover states
 * Optimized with React.memo for performance
 */

import React, { forwardRef, useMemo, useCallback, type CSSProperties, type ReactNode, type HTMLAttributes } from 'react';
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

export const Card = React.memo(
  forwardRef<HTMLDivElement, CardProps>(
    ({ variant = 'default', hover = false, padding = 6, children, style, onClick, ...props }, ref) => {
      const resolvedPadding = useResponsiveValue(padding);
      const prefersReducedMotion = usePrefersReducedMotion();

    // Memoize base styles with theme-aware tokens
    const baseStyles = useMemo(() => createDynamicStyles({
      backgroundColor: surface.surface,
      border: `1px solid ${surface.border}`,
      borderRadius: radius.lg,
      padding: spacing[resolvedPadding as Spacing] || spacing[6],
      boxShadow: shadow.sm,
      transition: prefersReducedMotion ? 'none' : `all ${transition.normal} ${easing.standard}`,
      position: 'relative',
    }), [resolvedPadding, prefersReducedMotion]);

    // Memoize variant styles with theme-aware tokens
    const variantStyles: Record<string, CSSProperties> = useMemo(() => ({
      default: {},
      primary: {
        borderColor: brand.primary,
        boxShadow: `0 0 0 1px ${brand.primary}, ${shadow.sm}`,
      },
      elevated: {
        boxShadow: shadow.md,
      },
    }), []);

    const hoverStyles: CSSProperties = useMemo(() => hover
      ? { cursor: 'pointer' }
      : {}, [hover]);

    const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (hover && !prefersReducedMotion) {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = shadow.lg;
        e.currentTarget.style.borderColor = brand.primary;
      }
    }, [hover, prefersReducedMotion]);

    const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (hover) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = shadow.sm;
        e.currentTarget.style.borderColor = surface.border;
      }
    }, [hover]);

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
  })
);

Card.displayName = 'Card';

