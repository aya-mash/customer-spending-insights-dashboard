/**
 * CHECKBOX COMPONENT
 * Accessible checkbox with neomorphic design
 * States: unchecked, checked, indeterminate
 */

import React, { forwardRef, type CSSProperties, type InputHTMLAttributes } from 'react';
import { Check, Minus } from 'lucide-react';
import { radius, transition, easing, spacingNum } from '../tokens';
import { useTheme } from '../index';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Checkbox label */
  label?: string;
  /** Indeterminate state (for partial selections) */
  indeterminate?: boolean;
  /** Optional error state */
  error?: boolean;
  /** Optional helper text */
  helperText?: string;
}

export const Checkbox = React.memo(
  forwardRef<HTMLInputElement, CheckboxProps>(
    (
      {
        label,
        indeterminate = false,
        error = false,
        helperText,
        checked,
        disabled,
        className,
        style,
        ...props
      },
      ref
    ) => {
      const { brand, surface, text: textColors } = useTheme();

      const containerStyles = createDynamicStyles({
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: `${spacingNum[3]}px`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...style,
      });

      const checkboxWrapperStyles = createDynamicStyles({
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        flexShrink: 0,
        marginTop: '2px', // Align with first line of label
      });

      const hiddenCheckboxStyles = createDynamicStyles({
        position: 'absolute',
        opacity: 0,
        width: '1px',
        height: '1px',
        margin: 0,
      });

      const isCheckedOrIndeterminate = checked || indeterminate;

      const visualCheckboxStyles = createDynamicStyles({
        width: '20px',
        height: '20px',
        borderRadius: radius.sm,
        border: error 
          ? '2px solid #EF4444'
          : isCheckedOrIndeterminate 
            ? `2px solid ${brand.primary}`
            : `2px solid ${surface.border}`,
        backgroundColor: isCheckedOrIndeterminate ? brand.primary : surface.surface,
        boxShadow: isCheckedOrIndeterminate 
          ? 'var(--shadow-neumorphic-sm)'
          : 'var(--shadow-neumorphic-inset)',
        transition: `all ${transition.fast} ${easing.standard}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      });

      const labelContainerStyles = createDynamicStyles({
        display: 'flex',
        flexDirection: 'column',
        gap: `${spacingNum[1]}px`,
      });

      const labelStyles = createDynamicStyles({
        fontSize: '14px',
        fontWeight: 500,
        color: error ? '#EF4444' : textColors.primary,
        lineHeight: '1.5',
        userSelect: 'none',
      });

      const helperTextStyles = createDynamicStyles({
        fontSize: '12px',
        color: error ? '#EF4444' : textColors.muted,
        lineHeight: '1.4',
      });

      const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          const input = e.currentTarget.querySelector('input');
          input?.click();
        }
      };

      return (
        <label
          style={containerStyles}
          className={className}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
        >
          <div style={checkboxWrapperStyles}>
            <input
              ref={ref}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              style={hiddenCheckboxStyles}
              aria-invalid={error}
              aria-describedby={helperText ? `${props.id}-helper` : undefined}
              {...props}
            />
            <div style={visualCheckboxStyles}>
              {indeterminate && <Minus size={14} strokeWidth={3} />}
              {!indeterminate && checked && <Check size={14} strokeWidth={3} />}
            </div>
          </div>
          {(label || helperText) && (
            <div style={labelContainerStyles}>
              {label && <span style={labelStyles}>{label}</span>}
              {helperText && (
                <span style={helperTextStyles} id={props.id ? `${props.id}-helper` : undefined}>
                  {helperText}
                </span>
              )}
            </div>
          )}
        </label>
      );
    }
  )
);

Checkbox.displayName = 'Checkbox';
