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
  shadow,
  transition,
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

      // Memoize size styles
      const sizeStyles = useMemo<Record<string, CSSProperties>>(() => ({
        small: {
          padding: `${spacingNum[2]}px ${spacingNum[3]}px`,
          fontSize: fontSize.bodySm,
          minHeight: touchTarget.minimum,
          minWidth: touchTarget.minimum,
        },
        medium: {
          padding: `${spacingNum[3]}px ${spacingNum[4]}px`,
          fontSize: fontSize.body,
          minHeight: touchTarget.minimum,
          minWidth: touchTarget.minimum,
        },
        large: {
          padding: `${spacingNum[4]}px ${spacingNum[6]}px`,
          fontSize: fontSize.bodyLg,
          minHeight: touchTarget.comfortable,
          minWidth: touchTarget.comfortable,
        },
      }), []);

      // Memoize variant styles with theme-aware tokens
      const variantStyles = useMemo<Record<string, CSSProperties>>(() => ({
        primary: {
          backgroundColor: brand.primary,
          color: textColors.inverse,
          border: 'none',
        },
        secondary: {
          backgroundColor: surface.surface,
          color: textColors.primary,
          border: `1px solid ${surface.border}`,
        },
        ghost: {
          backgroundColor: 'transparent',
          color: textColors.primary,
          border: 'none',
        },
        danger: {
          backgroundColor: semantic.error,
          color: textColors.inverse,
          border: 'none',
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
        transition: prefersReducedMotion ? 'none' : `all ${transition.fast} ${easing.standard}`,
        width: fullWidth ? '100%' : 'auto',
        ...sizeStyles[size],
        ...variantStyles[variant],
      }), [size, variant, disabled, loading, prefersReducedMotion, fullWidth, sizeStyles, variantStyles]);

      const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || loading || prefersReducedMotion) return;

        switch (variant) {
          case 'primary':
            e.currentTarget.style.backgroundColor = brand.primaryHover;
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = shadow.sm;
            break;
          case 'secondary':
            e.currentTarget.style.backgroundColor = surface.surfaceAlt;
            e.currentTarget.style.borderColor = brand.primary;
            break;
          case 'ghost':
            e.currentTarget.style.backgroundColor = surface.surfaceAlt;
            break;
          case 'danger':
            e.currentTarget.style.backgroundColor = semantic.errorDark;
            e.currentTarget.style.boxShadow = shadow.sm;
            break;
        }
      }, [variant, disabled, loading, prefersReducedMotion]);

      const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || loading) return;

        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';

        switch (variant) {
          case 'primary':
            e.currentTarget.style.backgroundColor = brand.primary;
            break;
          case 'secondary':
            e.currentTarget.style.backgroundColor = surface.surface;
            e.currentTarget.style.borderColor = surface.border;
            break;
          case 'ghost':
            e.currentTarget.style.backgroundColor = 'transparent';
            break;
          case 'danger':
            e.currentTarget.style.backgroundColor = semantic.error;
            break;
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

