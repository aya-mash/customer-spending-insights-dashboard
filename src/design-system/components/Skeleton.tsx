/**
 * SKELETON COMPONENT
 * Animated loading placeholder with neomorphic design
 * Respects prefers-reduced-motion for accessibility
 */

import { forwardRef, useMemo, type CSSProperties, type HTMLAttributes } from 'react';
import { useTheme, usePrefersReducedMotion } from '../index';
import { radius } from '../tokens';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Width of skeleton */
  readonly width?: string | number;
  /** Height of skeleton */
  readonly height?: string | number;
  /** Border radius variant */
  readonly borderRadius?: 'sm' | 'md' | 'lg' | 'full' | 'none';
  /** Variant style */
  readonly variant?: 'default' | 'circular' | 'rectangular';
}

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

/**
 * Skeleton loading placeholder with smooth shimmer animation.
 * Automatically respects user's motion preferences.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    width = '100%', 
    height = '20px', 
    borderRadius = 'md',
    variant = 'default',
    style,
    ...props 
  }, ref) => {
    const { surface } = useTheme();
    const prefersReducedMotion = usePrefersReducedMotion();
    
    // Determine border radius
    let radiusValue: string = radius.md;
    if (variant === 'circular') {
      radiusValue = '50%';
    } else if (variant === 'rectangular') {
      radiusValue = '0';
    } else if (borderRadius === 'none') {
      radiusValue = '0';
    } else {
      radiusValue = radius[borderRadius];
    }
    
    const skeletonStyles = useMemo(() => createDynamicStyles({
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      borderRadius: radiusValue,
      backgroundColor: surface.surfaceAlt,
      backgroundImage: prefersReducedMotion 
        ? 'none'
        : `linear-gradient(
            90deg,
            transparent,
            ${surface.hover},
            transparent
          )`,
      backgroundSize: '200% 100%',
      animation: prefersReducedMotion 
        ? 'none' 
        : 'skeleton-shimmer 1.5s ease-in-out infinite',
      position: 'relative',
      overflow: 'hidden',
    }), [width, height, radiusValue, surface, prefersReducedMotion]);
    
    return (
      <>
        <style>
          {`
            @keyframes skeleton-shimmer {
              0% {
                background-position: -200% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
          `}
        </style>
        <div
          ref={ref}
          role="status"
          aria-label="Loading"
          aria-live="polite"
          style={{ ...skeletonStyles, ...style }}
          {...props}
        >
          <span className="sr-only">Loading...</span>
        </div>
      </>
    );
  }
);

Skeleton.displayName = 'Skeleton';