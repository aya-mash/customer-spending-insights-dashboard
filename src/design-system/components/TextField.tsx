/**
 * TEXT FIELD COMPONENT
 * Styled input field matching design system
 */

import React, { forwardRef, type InputHTMLAttributes } from 'react';
import { surface, text as textColors, radius, spacingNum, fontSize, fontWeight, brand } from '../tokens';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  variant?: 'filled' | 'outlined';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const TextField = React.memo(
  forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      error,
      fullWidth = false,
      variant = 'outlined',
      startIcon,
      endIcon,
      style,
      ...props
    },
    ref
  ) => {
    const containerStyle = {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: `${spacingNum[2]}px`,
      width: fullWidth ? '100%' : 'auto',
    };

    const labelStyle = {
      fontSize: fontSize.bodySm,
      fontWeight: fontWeight.medium,
      color: textColors.primary,
    };

    const inputWrapperStyle = {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
    };

    const inputStyle = {
      width: '100%',
      padding: startIcon 
        ? `${spacingNum[3]}px ${spacingNum[4]}px ${spacingNum[3]}px ${spacingNum[10]}px`
        : endIcon
        ? `${spacingNum[3]}px ${spacingNum[10]}px ${spacingNum[3]}px ${spacingNum[4]}px`
        : `${spacingNum[3]}px ${spacingNum[4]}px`,
      borderRadius: radius.md,
      border: variant === 'outlined' 
        ? `1px solid ${error ? '#EF4444' : surface.border}`
        : 'none',
      backgroundColor: variant === 'filled' ? surface.surfaceAlt : surface.surface,
      color: textColors.primary,
      fontSize: fontSize.body,
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'all 0.2s ease',
      boxShadow: 'var(--shadow-neumorphic-inset)',
      ...style,
    };

    const iconStyle = {
      position: 'absolute' as const,
      top: '50%',
      transform: 'translateY(-50%)',
      color: textColors.secondary,
      pointerEvents: 'none' as const,
    };

    const startIconStyle = {
      ...iconStyle,
      left: `${spacingNum[3]}px`,
    };

    const endIconStyle = {
      ...iconStyle,
      right: `${spacingNum[3]}px`,
    };

    const errorStyle = {
      fontSize: fontSize.caption,
      color: '#EF4444',
      marginTop: `${spacingNum[1]}px`,
    };

    return (
      <div style={containerStyle}>
        {label && (
          <label htmlFor={props.id} style={labelStyle}>
            {label}
          </label>
        )}
        <div style={inputWrapperStyle}>
          {startIcon && <span style={startIconStyle}>{startIcon}</span>}
          <input
            ref={ref}
            style={inputStyle}
            {...props}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = brand.primary;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${brand.primary}1A`;
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? '#EF4444' : surface.border;
              e.currentTarget.style.boxShadow = 'none';
              props.onBlur?.(e);
            }}
          />
          {endIcon && <span style={endIconStyle}>{endIcon}</span>}
        </div>
        {error && <span style={errorStyle} role="alert">{error}</span>}
      </div>
    );
  })
);

TextField.displayName = 'TextField';

