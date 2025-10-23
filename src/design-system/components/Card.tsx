/**
 * Neomorphic card container with soft depth and optional hover lift.
 * Use for metric cards, transaction items, and content grouping. Supports click actions.
 * @remarks Accessible: interactive cards have implicit button role and keyboard support
 * @example
 * ```tsx
 * <Card variant="elevated" hover onClick={...}>
 *   <Heading level={3}>Total Spent</Heading>
 *   <Text>R 3,584.03</Text>
 * </Card>
 * ```
 */

import React, { forwardRef, useMemo, useCallback, type CSSProperties, type ReactNode, type HTMLAttributes } from 'react';
import {
  spacing,
  radius,
  easing,
  type Spacing,
  type ResponsiveValue,
} from '../tokens';
import { useTheme, useResponsiveValue, usePrefersReducedMotion } from '../index';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card visual style */
  variant?: 'default' | 'primary' | 'elevated';
  /** Enable hover effect */
  hover?: boolean;
  /** Padding inside card */
  padding?: ResponsiveValue<Spacing> | Spacing;
  /** Card content */
  children: ReactNode;
}

export const Card = React.memo(
  forwardRef<HTMLDivElement, CardProps>(
    ({ variant = 'default', hover = false, padding = 6, children, style, onClick, ...props }, ref) => {
      const { brand, surface } = useTheme();
      const resolvedPadding = useResponsiveValue(padding);
      const prefersReducedMotion = usePrefersReducedMotion();

    // Memoize base styles with neomorphic shadows
    const baseStyles = useMemo(() => createDynamicStyles({
      backgroundColor: surface.surface,
      border: `1px solid ${surface.border}`,
      borderRadius: radius.lg,
      padding: spacing[resolvedPadding] || spacing[6],
      boxShadow: 'var(--shadow-neumorphic-sm)',
      transition: prefersReducedMotion ? 'none' : `all 300ms ${easing.standard}`,
      position: 'relative',
    }), [resolvedPadding, prefersReducedMotion, surface]);

    // Memoize variant styles with theme-aware tokens
    const variantStyles: Record<string, CSSProperties> = useMemo(() => ({
      default: {},
      primary: {
        borderColor: brand.primary,
        boxShadow: `0 0 0 1px ${brand.primary}, var(--shadow-neumorphic-sm)`,
      },
      elevated: {
        boxShadow: 'var(--shadow-neumorphic-md)',
      },
    }), [brand]);

    const hoverStyles: CSSProperties = useMemo(() => hover
      ? { cursor: 'pointer' }
      : {}, [hover]);

    const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (hover && !prefersReducedMotion) {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-neumorphic-lg)';
        e.currentTarget.style.borderColor = brand.primary;
      }
    }, [hover, prefersReducedMotion, brand]);

    const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (hover) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-neumorphic-sm)';
        e.currentTarget.style.borderColor = surface.border;
      }
    }, [hover, surface]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
    }, [onClick]);

    // Only render as interactive if onClick is provided
    const interactiveProps = onClick ? {
      onClick,
      onKeyDown: handleKeyDown,
      role: 'button' as const,
      tabIndex: 0,
      style: { cursor: 'pointer', ...baseStyles, ...variantStyles[variant], ...hoverStyles, ...style },
    } : {
      style: { ...baseStyles, ...variantStyles[variant], ...hoverStyles, ...style },
    };

    return (
      <div
        ref={ref}
        {...interactiveProps}
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

