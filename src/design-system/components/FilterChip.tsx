/**
 * FILTER CHIP COMPONENT
 * Removable pill-style filter chip
 */

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { brand, radius, spacingNum } from '../tokens';
import { X } from 'lucide-react';

export interface FilterChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  onRemove: () => void;
}

export const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(
  (
    {
      label,
      onRemove,
      style,
      ...props
    },
    ref
  ) => {
    const chipStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: `${spacingNum[2]}px`,
      padding: `${spacingNum[2]}px ${spacingNum[3]}px`,
      borderRadius: radius.full,
      border: `1px solid ${brand.primary}`,
      backgroundColor: `${brand.primary}15`,
      color: brand.primary,
      fontSize: '13px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      fontFamily: 'inherit',
      ...style,
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={onRemove}
        style={chipStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${brand.primary}25`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = `${brand.primary}15`;
        }}
        aria-label={`Remove ${label} filter`}
        {...props}
      >
        <span>{label}</span>
        <X size={14} aria-hidden="true" />
      </button>
    );
  }
);

FilterChip.displayName = 'FilterChip';
