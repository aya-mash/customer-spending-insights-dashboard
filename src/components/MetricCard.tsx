import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import './MetricCard.css';

export interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Display label (shown in uppercase) */
  label: string;
  /** Main value to display prominently */
  value: string | number;
  /** Optional icon component from lucide-react */
  icon?: LucideIcon;
  /** Category for icon background color (groceries, entertainment, transport, etc.) */
  category?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 
             'groceries' | 'entertainment' | 'transport' | 'dining' | 'shopping' | 'utilities';
  /** Trend percentage (positive or negative) */
  trend?: number;
  /** Comparison text (e.g., "vs last month") */
  comparisonText?: string;
  /** Additional content below the main value */
  children?: ReactNode;
  /** Whether to show loading skeleton */
  isLoading?: boolean;
  /** Whether the card is interactive (clickable) */
  interactive?: boolean;
}

/**
 * MetricCard - Production-grade card for displaying financial metrics
 * 
 * Features:
 * - Icon with colored circle background (light tint of category color)
 * - Label in uppercase, small font, medium weight
 * - Large value display (32px, bold)
 * - Trend indicator with icon and percentage
 * - Comparison text in smaller font
 * - Smooth hover state with elevation change
 * - Fully accessible with proper ARIA labels
 * - Responsive design
 * - Loading skeleton state
 * 
 * @example
 * ```tsx
 * <MetricCard
 *   label="Total Spent"
 *   value="R 12,345.00"
 *   icon={Wallet}
 *   category="primary"
 *   trend={-5.2}
 *   comparisonText="vs last month"
 * />
 * ```
 */
export const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      label,
      value,
      icon: Icon,
      category = 'primary',
      trend,
      comparisonText,
      children,
      isLoading = false,
      interactive = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const trendIsPositive = trend !== undefined && trend > 0;
    const trendIsNegative = trend !== undefined && trend < 0;
    const TrendIcon = trendIsPositive ? TrendingUp : TrendingDown;

    const baseClasses = 'metric-card';
    const interactiveClass = interactive ? 'metric-card--interactive' : '';
    const loadingClass = isLoading ? 'metric-card--loading' : '';
    const classes = [baseClasses, interactiveClass, loadingClass, className]
      .filter(Boolean)
      .join(' ');

    if (isLoading) {
      return (
        <div
          ref={ref}
          className={classes}
          role="status"
          aria-label="Loading metric"
          aria-busy="true"
          {...props}
        >
          <div className="metric-card__skeleton">
            <div className="metric-card__skeleton-icon" />
            <div className="metric-card__skeleton-content">
              <div className="metric-card__skeleton-label" />
              <div className="metric-card__skeleton-value" />
              <div className="metric-card__skeleton-trend" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={classes}
        role={interactive ? 'button' : 'article'}
        tabIndex={interactive ? 0 : undefined}
        aria-label={`${label}: ${value}${trend !== undefined ? `, ${trend > 0 ? 'up' : 'down'} ${Math.abs(trend)}%` : ''}`}
        {...props}
      >
        <div className="metric-card__header">
          {Icon && (
            <div
              className={`metric-card__icon metric-card__icon--${category}`}
              aria-hidden="true"
            >
              <Icon size={20} strokeWidth={2} />
            </div>
          )}
        </div>

        <div className="metric-card__content">
          <div className="metric-card__label">{label}</div>
          <div className="metric-card__value">{value}</div>

          {(trend !== undefined || comparisonText) && (
            <div className="metric-card__footer">
              {trend !== undefined && (
                <div
                  className={`metric-card__trend ${
                    trendIsPositive
                      ? 'metric-card__trend--positive'
                      : trendIsNegative
                      ? 'metric-card__trend--negative'
                      : 'metric-card__trend--neutral'
                  }`}
                  aria-label={`Trend: ${trend > 0 ? 'up' : 'down'} ${Math.abs(trend)} percent`}
                >
                  <TrendIcon size={14} strokeWidth={2.5} aria-hidden="true" />
                  <span className="metric-card__trend-value">
                    {Math.abs(trend)}%
                  </span>
                </div>
              )}
              {comparisonText && (
                <span className="metric-card__comparison">{comparisonText}</span>
              )}
            </div>
          )}

          {children && <div className="metric-card__extra">{children}</div>}
        </div>
      </div>
    );
  }
);

MetricCard.displayName = 'MetricCard';

/**
 * MetricCardGrid - Responsive grid container for metric cards
 * 
 * Layout:
 * - Desktop (≥1024px): 4 columns
 * - Tablet (≥768px): 2 columns
 * - Mobile (<768px): 1 column
 * 
 * @example
 * ```tsx
 * <MetricCardGrid>
 *   <MetricCard label="Total Spent" value="R 12,345" />
 *   <MetricCard label="Transactions" value="42" />
 * </MetricCardGrid>
 * ```
 */
export const MetricCardGrid = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className = '', children, ...props }, ref) => {
  const classes = ['metric-card-grid', className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

MetricCardGrid.displayName = 'MetricCardGrid';
