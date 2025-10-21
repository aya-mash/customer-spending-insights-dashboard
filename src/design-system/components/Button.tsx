/**
 * BUTTON COMPONENT
 * Primary UI button with variants, sizes, loading states, and icons
 */

import React, { forwardRef, useMemo, useCallback, type CSSProperties, type ReactNode, type ButtonHTMLAttributes } from 'react';
import {
  brand,
  semantic,
  text as textColors,
  surface,
  spacing,
  spacingNum,
  fontSize,
  fontWeight,
  radius,
  easing,
  touchTarget,
  focus,
  fontFamily,
} from '../tokens';
import { usePrefersReducedMotion } from '../index';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children: ReactNode;
}

export const Button = React.memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        variant = 'primary',
        size = 'medium',
        fullWidth = false,
        loading = false,
        icon,
        iconPosition = 'left',
        children,
        disabled,
        style,
        ...props
      },
      ref
    ) => {
      const prefersReducedMotion = usePrefersReducedMotion();

      // Memoize size styles - Soft Modern (larger touch targets)
      const sizeStyles = useMemo<Record<string, CSSProperties>>(() => ({
        small: {
          padding: `${spacingNum[2]}px ${spacingNum[3]}px`,
          fontSize: fontSize.bodySm,
          minHeight: touchTarget.minimum,
          minWidth: touchTarget.minimum,
        },
        medium: {
          padding: `${spacingNum[3]}px ${spacingNum[5]}px`,
          fontSize: fontSize.body,
          minHeight: touchTarget.comfortable,
          minWidth: touchTarget.comfortable,
        },
        large: {
          padding: `${spacingNum[4]}px ${spacingNum[6]}px`,
          fontSize: fontSize.bodyLg,
          minHeight: '52px',
          minWidth: touchTarget.comfortable,
        },
      }), []);

      // Memoize variant styles with neomorphic shadows
      const variantStyles = useMemo<Record<string, CSSProperties>>(() => ({
        primary: {
          backgroundColor: brand.primary,
          color: textColors.inverse,
          border: `1px solid ${brand.primary}`,
          boxShadow: 'var(--shadow-neumorphic-sm)',
        },
        secondary: {
          backgroundColor: surface.surface,
          color: textColors.primary,
          border: `1px solid ${surface.border}`,
          boxShadow: 'var(--shadow-neumorphic-sm)',
        },
        ghost: {
          backgroundColor: 'transparent',
          color: textColors.primary,
          border: 'none',
          boxShadow: 'none',
        },
        danger: {
          backgroundColor: semantic.error,
          color: textColors.inverse,
          border: `1px solid ${semantic.error}`,
          boxShadow: 'var(--shadow-neumorphic-sm)',
        },
      }), []);

      // Memoize base styles combining size and variant
      const baseStyles = useMemo(() => createDynamicStyles({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        borderRadius: radius.md,
        fontWeight: fontWeight.medium,
        fontFamily: fontFamily.sans,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: prefersReducedMotion ? 'none' : `all 200ms ${easing.standard}`,
        width: fullWidth ? '100%' : 'auto',
        ...sizeStyles[size],
        ...variantStyles[variant],
      }), [size, variant, disabled, loading, prefersReducedMotion, fullWidth, sizeStyles, variantStyles]);

      const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || loading || prefersReducedMotion) return;

        switch (variant) {
          case 'primary':
            e.currentTarget.style.backgroundColor = brand.primaryHover;
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-neumorphic-md)';
            break;
          case 'secondary':
            e.currentTarget.style.backgroundColor = surface.surfaceAlt;
            e.currentTarget.style.borderColor = brand.primary;
            e.currentTarget.style.boxShadow = 'var(--shadow-neumorphic-md)';
            break;
          case 'ghost':
            e.currentTarget.style.backgroundColor = surface.surfaceAlt;
            break;
          case 'danger':
            e.currentTarget.style.backgroundColor = semantic.errorDark;
            e.currentTarget.style.boxShadow = 'var(--shadow-neumorphic-md)';
            break;
        }
      }, [variant, disabled, loading, prefersReducedMotion]);

      const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || loading) return;

        e.currentTarget.style.transform = 'translateY(0)';

        switch (variant) {
          case 'primary':
            e.currentTarget.style.backgroundColor = brand.primary;
            e.currentTarget.style.boxShadow = 'var(--shadow-neumorphic-sm)';
            break;
          case 'secondary':
            e.currentTarget.style.backgroundColor = surface.surface;
            e.currentTarget.style.borderColor = surface.border;
            e.currentTarget.style.boxShadow = 'var(--shadow-neumorphic-sm)';
            break;
          case 'ghost':
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
            break;
          case 'danger':
            e.currentTarget.style.backgroundColor = semantic.error;
            e.currentTarget.style.boxShadow = 'var(--shadow-neumorphic-sm)';
            break;
        }
      }, [variant, disabled, loading]);

      const handleMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || loading) return;
        if (variant !== 'ghost') {
          e.currentTarget.style.boxShadow = 'var(--shadow-neumorphic-pressed)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }, [variant, disabled, loading]);

      const handleMouseUp = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || loading) return;
        if (variant !== 'ghost') {
          e.currentTarget.style.boxShadow = 'var(--shadow-neumorphic-sm)';
        }
      }, [variant, disabled, loading]);

      const handleFocus = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
        e.currentTarget.style.outline = `${focus.ringWidth} solid ${focus.ringColor}`;
        e.currentTarget.style.outlineOffset = focus.ringOffset;
      }, []);

      const handleBlur = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
        e.currentTarget.style.outline = 'none';
      }, []);

      return (
        <button
          ref={ref}
          style={{ ...baseStyles, ...style }}
          disabled={disabled || loading}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        >
          {loading && <span aria-hidden="true">⟳</span>}
          {!loading && icon && iconPosition === 'left' && icon}
          <span>{loading ? 'Loading...' : children}</span>
          {!loading && icon && iconPosition === 'right' && icon}
        </button>
      );
    }
  )
);

Button.displayName = 'Button';

