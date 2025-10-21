/**
 * BADGE COMPONENT
 * Small label for categories, status indicators, and tags
 */

import { forwardRef, type CSSProperties, type ReactNode, type HTMLAttributes } from 'react';
import {
  neutral,
  semantic,
  text as textColors,
  spacingNum,
  fontSize,
  fontWeight,
  radius,
  categories,
  type CategoryName,
} from '../tokens';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  category?: CategoryName;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ category, variant = 'default', children, style, ...props }, ref) => {
    let bgColor: string = neutral[200];
    let textColor: string = textColors.primary;

    if (category) {
      bgColor = categories[category].main;
      textColor = textColors.inverse;
    } else if (variant !== 'default') {
      const variantColors: Record<string, {bg: string; text: string}> = {
        success: { bg: semantic.success, text: textColors.inverse },
        warning: { bg: semantic.warning, text: textColors.strong },
        error: { bg: semantic.error, text: textColors.inverse },
        info: { bg: semantic.info, text: textColors.inverse },
      };
      bgColor = variantColors[variant].bg;
      textColor = variantColors[variant].text;
    }

    const badgeStyles = createDynamicStyles({
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${spacingNum[1]}px ${spacingNum[3]}px`,
      borderRadius: radius.full,
      fontSize: fontSize.bodySm,
      fontWeight: fontWeight.medium,
      backgroundColor: bgColor,
      color: textColor,
      whiteSpace: 'nowrap',
    });

    return (
      <span ref={ref} style={{ ...badgeStyles, ...style }} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
