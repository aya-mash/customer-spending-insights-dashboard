/**
 * METRIC CARD COMPONENT
 * Specialized card for displaying financial metrics with icons and trends
 */

import { forwardRef, type CSSProperties, type ReactNode, type HTMLAttributes } from 'react';
import {
  brand,
  semantic,
  text as textColors,
  surface,
  spacing,
  fontSize,
  fontWeight,
  lineHeight,
  radius,
  shadow,
  transition,
  easing,
} from '../tokens';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  children?: ReactNode;
}

export const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  ({ label, value, icon, trend, variant = 'default', children, style, ...props }, ref) => {
    const variantColors: Record<string, string> = {
      default: brand.primary,
      primary: brand.primary,
      success: semantic.success,
      warning: semantic.warning,
      error: semantic.error,
    };

    const iconColor = variantColors[variant];

    const cardStyles = createDynamicStyles({
      backgroundColor: surface.surface,
      border: `1px solid ${surface.border}`,
      borderRadius: radius.lg,
      padding: spacing[6],
      boxShadow: shadow.sm,
      transition: `all ${transition.normal} ${easing.standard}`,
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[4],
      minHeight: '160px',
    });

    const iconContainerStyles = createDynamicStyles({
      width: '48px',
      height: '48px',
      borderRadius: radius.full,
      backgroundColor: `${iconColor}15`, // 15% opacity
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: iconColor,
    });

    const labelStyles = createDynamicStyles({
      fontSize: fontSize.bodySm,
      color: textColors.muted,
      fontWeight: fontWeight.medium,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    });

    const valueStyles = createDynamicStyles({
      fontSize: fontSize.h2,
      fontWeight: fontWeight.bold,
      color: textColors.strong,
      lineHeight: lineHeight.tight,
    });

    const trendStyles = createDynamicStyles({
      display: 'flex',
      alignItems: 'center',
      gap: spacing[1],
      fontSize: fontSize.bodySm,
      fontWeight: fontWeight.medium,
      color: trend?.direction === 'up' ? semantic.error : semantic.success,
    });

    return (
      <div ref={ref} style={{ ...cardStyles, ...style }} {...props}>
        {icon && <div style={iconContainerStyles}>{icon}</div>}
        <div style={labelStyles}>{label}</div>
        <div style={valueStyles}>{value}</div>
        {trend && (
          <div style={trendStyles}>
            <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
        {children}
      </div>
    );
  }
);

MetricCard.displayName = 'MetricCard';
