/**
 * DESIGN SYSTEM - Core Component Library
 * TypeScript-first, token-driven, mobile-first responsive components
 * Generates dynamic styles using CSS-in-JS approach with design tokens
 */

import React, { forwardRef, type CSSProperties, type ReactNode, type HTMLAttributes, type ButtonHTMLAttributes } from 'react';
import {
  brand,
  neutral,
  semantic,
  text as textColors,
  surface,
  spacing,
  spacingNum,
  fontSize,
  fontWeight,
  lineHeight,
  radius,
  shadow,
  transition,
  easing,
  touchTarget,
  focus,
  fontFamily,
  categories,
  type Spacing,
  type FontWeight,
  type ResponsiveValue,
  type CategoryName,
} from './tokens';
import { useResponsiveValue, useIsMobile, usePrefersReducedMotion } from './index';

// =============================================================================
// HELPER: Create Dynamic Style Object
// =============================================================================

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

// =============================================================================
// CARD COMPONENT
// =============================================================================

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'elevated';
  hover?: boolean;
  padding?: ResponsiveValue<Spacing> | Spacing;
  children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hover = false, padding = 6, children, style, onClick, ...props }, ref) => {
    const resolvedPadding = useResponsiveValue(padding);
    const prefersReducedMotion = usePrefersReducedMotion();

    const baseStyles = createDynamicStyles({
      backgroundColor: surface.surface,
      border: `1px solid ${surface.border}`,
      borderRadius: radius.lg,
      padding: spacing[resolvedPadding as Spacing] || spacing[6],
      boxShadow: shadow.sm,
      transition: prefersReducedMotion ? 'none' : `all ${transition.normal} ${easing.standard}`,
      position: 'relative',
    });

    const variantStyles: Record<string, CSSProperties> = {
      default: {},
      primary: {
        borderColor: brand.primary,
        boxShadow: `0 0 0 1px ${brand.primary}, ${shadow.sm}`,
      },
      elevated: {
        boxShadow: shadow.md,
      },
    };

    const hoverStyles: CSSProperties = hover
      ? {
          cursor: 'pointer',
        }
      : {};

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hover && !prefersReducedMotion) {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = shadow.lg;
        e.currentTarget.style.borderColor = brand.primary;
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hover) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = shadow.sm;
        e.currentTarget.style.borderColor = surface.border;
      }
    };

    return (
      <div
        ref={ref}
        style={{
          ...baseStyles,
          ...variantStyles[variant],
          ...hoverStyles,
          ...style,
        }}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// =============================================================================
// BUTTON COMPONENT
// =============================================================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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

    const sizeStyles: Record<string, CSSProperties> = {
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
    };

    const variantStyles: Record<string, CSSProperties> = {
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
    };

    const baseStyles = createDynamicStyles({
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
    });

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    };

    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      e.currentTarget.style.outline = `${focus.ringWidth} solid ${focus.ringColor}`;
      e.currentTarget.style.outlineOffset = focus.ringOffset;
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      e.currentTarget.style.outline = 'none';
    };

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
);

Button.displayName = 'Button';

// =============================================================================
// GRID COMPONENT
// =============================================================================

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: ResponsiveValue<number> | number;
  gap?: ResponsiveValue<Spacing> | Spacing;
  children: ReactNode;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ columns = 1, gap = 4, children, style, ...props }, ref) => {
    const resolvedColumns = useResponsiveValue(columns);
    const resolvedGap = useResponsiveValue(gap);

    const gridStyles = createDynamicStyles({
      display: 'grid',
      gridTemplateColumns: `repeat(${resolvedColumns}, 1fr)`,
      gap: spacing[resolvedGap as Spacing] || spacing[4],
    });

    return (
      <div ref={ref} style={{ ...gridStyles, ...style }} {...props}>
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

// =============================================================================
// STACK COMPONENT
// =============================================================================

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
  spacing?: ResponsiveValue<Spacing> | Spacing;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  children: ReactNode;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = 'vertical',
      spacing: spacingProp = 4,
      align = 'stretch',
      justify = 'start',
      wrap = false,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const resolvedSpacing = useResponsiveValue(spacingProp);

    const alignMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch',
    };

    const justifyMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      between: 'space-between',
      around: 'space-around',
    };

    const stackStyles = createDynamicStyles({
      display: 'flex',
      flexDirection: direction === 'vertical' ? 'column' : 'row',
      gap: spacing[resolvedSpacing as Spacing] || spacing[4],
      alignItems: alignMap[align],
      justifyContent: justifyMap[justify],
      flexWrap: wrap ? 'wrap' : 'nowrap',
    });

    return (
      <div ref={ref} style={{ ...stackStyles, ...style }} {...props}>
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';

// =============================================================================
// TYPOGRAPHY COMPONENTS
// =============================================================================

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4;
  children: ReactNode;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level, children, style, ...props }, ref) => {
    const fontSizeMap = {
      1: fontSize.h1,
      2: fontSize.h2,
      3: fontSize.h3,
      4: fontSize.h4,
    };

    const headingStyles = createDynamicStyles({
      fontSize: fontSizeMap[level],
      fontWeight: fontWeight.bold,
      lineHeight: lineHeight.tight,
      color: textColors.strong,
      margin: 0,
    });

    const Component = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';

    return React.createElement(
      Component,
      { ref, style: { ...headingStyles, ...style }, ...props },
      children
    );
  }
);

Heading.displayName = 'Heading';

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: 'body' | 'bodyLg' | 'bodySm' | 'caption';
  color?: 'primary' | 'muted' | 'strong' | 'inverse' | 'disabled';
  weight?: FontWeight;
  children: ReactNode;
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ variant = 'body', color = 'primary', weight, children, style, ...props }, ref) => {
    const variantMap: Record<string, string> = {
      bodyLg: fontSize.bodyLg,
      body: fontSize.body,
      bodySm: fontSize.bodySm,
      caption: fontSize.caption,
    };

    const colorMap = {
      primary: textColors.primary,
      muted: textColors.muted,
      strong: textColors.strong,
      inverse: textColors.inverse,
      disabled: textColors.disabled,
    };

    const textStyles = createDynamicStyles({
      fontSize: variantMap[variant],
      fontWeight: weight ? fontWeight[weight] : fontWeight.regular,
      lineHeight: lineHeight.normal,
      color: colorMap[color],
      margin: 0,
    });

    return (
      <p ref={ref} style={{ ...textStyles, ...style }} {...props}>
        {children}
      </p>
    );
  }
);

Text.displayName = 'Text';

// =============================================================================
// BADGE COMPONENT
// =============================================================================

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

// =============================================================================
// PAGE LAYOUT COMPONENT
// =============================================================================

export interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export const PageLayout = forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ title, subtitle, actions, children, style, ...props }, ref) => {
    const isMobile = useIsMobile();
    const padding = isMobile ? spacingNum[4] : spacingNum[8];

    const containerStyles = createDynamicStyles({
      maxWidth: '1440px',
      margin: '0 auto',
      padding: `${padding}px`,
    });

    const headerStyles = createDynamicStyles({
      marginBottom: spacing[8],
    });

    const titleRowStyles = createDynamicStyles({
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: spacing[4],
      flexWrap: 'wrap',
    });

    const titleStyles = createDynamicStyles({
      fontSize: isMobile ? fontSize.h2 : fontSize.h1,
      fontWeight: fontWeight.bold,
      color: textColors.strong,
      lineHeight: lineHeight.tight,
      margin: 0,
    });

    const subtitleStyles = createDynamicStyles({
      fontSize: fontSize.body,
      color: textColors.muted,
      marginTop: spacing[2],
    });

    return (
      <div ref={ref} style={{ ...containerStyles, ...style }} {...props}>
        {(title || subtitle || actions) && (
          <header style={headerStyles}>
            <div style={titleRowStyles}>
              <div>
                {title && <h1 style={titleStyles}>{title}</h1>}
                {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
              </div>
              {actions && <div>{actions}</div>}
            </div>
          </header>
        )}
        {children}
      </div>
    );
  }
);

PageLayout.displayName = 'PageLayout';

// =============================================================================
// DIVIDER COMPONENT
// =============================================================================

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  spacing?: Spacing;
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ spacing: spacingProp = 6, style, ...props }, ref) => {
    const dividerStyles = createDynamicStyles({
      border: 'none',
      borderTop: `1px solid ${surface.border}`,
      margin: `${spacing[spacingProp]} 0`,
    });

    return <hr ref={ref} style={{ ...dividerStyles, ...style }} {...props} />;
  }
);

Divider.displayName = 'Divider';

// =============================================================================
// METRIC CARD COMPONENT (Financial Dashboard Specific)
// =============================================================================

export interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  children: ReactNode;
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

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  Card,
  Button,
  Grid,
  Stack,
  Heading,
  Text,
  Badge,
  PageLayout,
  Divider,
  MetricCard,
};
