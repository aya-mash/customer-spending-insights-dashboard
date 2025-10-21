/**
 * SELECT COMPONENT
 * Styled select dropdown matching design system
 */

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { surface, text as textColors, radius, spacingNum, fontSize, fontWeight } from '../tokens';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      fullWidth = false,
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

    const selectStyle = {
      width: '100%',
      padding: `${spacingNum[3]}px ${spacingNum[4]}px`,
      borderRadius: radius.md,
      border: `1px solid ${error ? '#EF4444' : surface.border}`,
      backgroundColor: surface.surface,
      color: textColors.primary,
      fontSize: fontSize.body,
      fontFamily: 'inherit',
      cursor: 'pointer',
      outline: 'none',
      transition: 'all 0.2s ease',
      boxShadow: 'var(--shadow-neumorphic-inset)',
      ...style,
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
        <select
          ref={ref}
          style={selectStyle}
          {...props}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#2F70EF';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47, 112, 239, 0.1)';
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? '#EF4444' : surface.border;
            e.currentTarget.style.boxShadow = 'none';
            props.onBlur?.(e);
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span style={errorStyle} role="alert">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
