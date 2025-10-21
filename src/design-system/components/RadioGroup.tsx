/**
 * RADIO GROUP COMPONENT
 * Accessible radio button group with Tabs-style neomorphic design
 * Container: debossed (inset), inactive: debossed, active: raised
 */

import React, { type CSSProperties, type ReactNode } from 'react';
import { spacing, radius, surface, text as textColors } from '../tokens';

export interface RadioOption {
  value: string;
  label: string;
  icon?: ReactNode;
  'aria-label'?: string;
}

export interface RadioGroupProps {
  /** Unique name for the radio group */
  name: string;
  /** Array of radio options */
  options: RadioOption[];
  /** Currently selected value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Optional aria-label */
  'aria-label'?: string;
  /** Optional className */
  className?: string;
}

export const RadioGroup = React.memo<RadioGroupProps>(({
  name,
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
  className,
}) => {
  // Container style matching Tabs - debossed/inset
  const containerStyle: CSSProperties = {
    display: 'flex',
    gap: spacing[2],
    padding: spacing[2],
    backgroundColor: surface.surface,
    borderRadius: radius.lg,
    boxShadow: 'var(--shadow-neumorphic-inset)',
    width: '100%',
  };

  // Radio button style matching Tabs
  const getLabelStyle = (isActive: boolean): CSSProperties => ({
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    padding: `${spacing[3]} ${spacing[4]}`,
    borderRadius: radius.md,
    backgroundColor: isActive ? surface.surface : 'transparent',
    boxShadow: isActive ? 'var(--shadow-neumorphic-sm)' : 'var(--shadow-neumorphic-pressed)',
    transform: isActive ? 'translateY(-1px)' : 'none',
    color: isActive ? textColors.primary : textColors.muted,
    fontSize: '13px',
    fontWeight: isActive ? 600 : 400,
    cursor: 'pointer',
    transition: 'all 200ms ease',
    position: 'relative',
    outline: 'none',
  });

  const inputStyle: CSSProperties = {
    position: 'absolute',
    opacity: 0,
    width: '1px',
    height: '1px',
    margin: 0,
  };

  return (
    <fieldset
      style={{ ...containerStyle, border: 'none', margin: 0 }}
      aria-label={ariaLabel}
      className={className}
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <label
            key={option.value}
            style={getLabelStyle(isActive)}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isActive}
              onChange={(e) => onChange(e.target.value)}
              data-testid={`mode-${option.value}`}
              aria-label={option['aria-label'] || option.label}
              style={inputStyle}
            />
            {option.icon && <span style={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}>{option.icon}</span>}
            <span>{option.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
});

RadioGroup.displayName = 'RadioGroup';
