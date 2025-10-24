/**
 * DONUT CHART COMPONENT
 * Design system category breakdown chart with side-by-side legend
 */

import { forwardRef, useState, useEffect, createElement, type CSSProperties } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { categories as categoryColors, type CategoryName, spacingNum, radius } from '../tokens';
import { useTheme, formatCurrency, usePrefersReducedMotion } from '../index';
import type { CategoryItem } from '../../data/models';
import { Text } from './Text';
import { getCategoryIcon } from '../../lib/categoryUtils';

// Chart configuration
const PIE_CONFIG = {
  innerRadius: 70,
  outerRadius: 100,
  padAngle: 2,
  cornerRadius: 6,
};

/**
 * Get category color - prioritize API color, fallback to design system
 */
function getCategoryColor(item: CategoryItem, brandPrimary: string): string {
  // Use API color if provided
  if (item.color) {
    return item.color;
  }
  
  // Fallback to design system colors
  const key = item.name.toLowerCase().replaceAll(/\s+/g, '') as CategoryName;
  return categoryColors[key]?.main || brandPrimary;
}

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

// Custom tooltip component
interface TooltipPayload {
  payload: { name: string; amount: number; percentage: number };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  const { neutral, text: textColors } = useTheme();
  
  if (!active || !payload?.[0]) return null;

  const data = payload[0].payload;
  return (
    <div style={createDynamicStyles({
      backgroundColor: neutral[900],
      color: textColors.inverse,
      padding: `${spacingNum[2]}px ${spacingNum[3]}px`,
      borderRadius: radius.md,
      fontSize: '14px',
      boxShadow: 'var(--shadow-neumorphic-sm)',
    })}>
      <div style={{ fontWeight: 600, marginBottom: '4px' }}>
        {data.name}
      </div>
      <div style={{ fontSize: '13px', opacity: 0.9 }}>
        {formatCurrency(data.amount)} ({data.percentage?.toFixed(1)}%)
      </div>
    </div>
  );
};

// Legend chip component
interface ChartDataItem {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  transactionCount?: number;
  icon?: string;
}

interface LegendChipProps {
  item: ChartDataItem;
  onSegmentClick?: (category: string) => void;
  showCount?: boolean;
  isLarge?: boolean;
}

const LegendChip = ({ item, onSegmentClick, showCount = false, isLarge = false }: LegendChipProps) => {
  const { text: textColors, isMobile } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  const chipPadding = isLarge ? `${spacingNum[2]}px ${spacingNum[3]}px` : `${spacingNum[1]}px ${spacingNum[2]}px`;
  const chipFontSize = isLarge ? '14px' : '12px';
  const iconSize = isLarge ? 18 : 20; // Increased from 16 to 20 for better visibility
  
  // Get the icon component - always try to get an icon (from API or fallback)
  const Icon = getCategoryIcon(item.name, item.icon);
  
  return (
    <button
      type="button"
      onClick={onSegmentClick ? () => onSegmentClick(item.name) : undefined}
      style={createDynamicStyles({
        display: 'flex',
        alignItems: 'center',
        gap: `${spacingNum[2]}px`,
        padding: chipPadding,
        borderRadius: radius.full,
        border: `1px solid ${item.color}`,
        backgroundColor: 'transparent',
        cursor: onSegmentClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        fontSize: chipFontSize,
        fontWeight: 500,
        color: textColors.primary,
        whiteSpace: 'nowrap',
        width: isLarge ? '100%' : 'auto',
      })}
      onMouseEnter={(e) => {
        if (onSegmentClick) {
          setIsHovered(true);
          e.currentTarget.style.backgroundColor = item.color;
          e.currentTarget.style.color = textColors.inverse;
        }
      }}
      onMouseLeave={(e) => {
        if (onSegmentClick) {
          setIsHovered(false);
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = textColors.primary;
        }
      }}
      aria-label={`${item.name}: ${formatCurrency(item.amount)}, ${item.percentage?.toFixed(1)}% of total`}
    >
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {createElement(Icon, { 
          size: iconSize, 
          color: isHovered && onSegmentClick ? textColors.inverse : item.color, 
          strokeWidth: 2.5,
          style: { flexShrink: 0 }
        })}
      </span>
      <span>{item.name}</span>
      {showCount && item.transactionCount !== undefined && isMobile && (
        <span style={{ opacity: 0.7, fontSize: '11px' }}>
          ({item.transactionCount})
        </span>
      )}
      <span style={{ marginLeft: 'auto', fontWeight: 600 }}>
        {formatCurrency(item.amount)}
      </span>
    </button>
  );
};

export interface DonutChartProps {
  data: CategoryItem[];
  total: number;
  onSegmentClick?: (category: string) => void;
  height?: number;
  showCount?: boolean;
  size?: 'default' | 'large';
}

export const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(
  ({ data, total, onSegmentClick, height = 300, showCount = false, size = 'default' }, ref) => {
    const { brand, text: textColors, isMobile } = useTheme();
    const reducedMotion = usePrefersReducedMotion();
    
    // Track theme for instant chart updates
    const [themeKey, setThemeKey] = useState(0);
    useEffect(() => {
      const handleThemeChange = () => setThemeKey(k => k + 1);
      document.addEventListener('themechange', handleThemeChange);
      return () => document.removeEventListener('themechange', handleThemeChange);
    }, []);

    const chartData = data.map(item => ({
      name: item.name,
      amount: item.amount,
      percentage: item.percentage,
      color: getCategoryColor(item, brand.primary),
      transactionCount: item.transactionCount,
      icon: item.icon,
    }));

    const top = data[0];
    const summaryId = 'category-donut-summary';

    const isLarge = size === 'large' && !isMobile;
    const chartWidth = isMobile ? '100%' : (isLarge ? '450px' : '280px'); // Reduced default from 380px to 280px
    const innerRadius = isLarge ? 100 : PIE_CONFIG.innerRadius;
    const outerRadius = isLarge ? 150 : PIE_CONFIG.outerRadius;
    const containerGap = isLarge ? spacingNum[6] : spacingNum[4]; // 24px for large, 16px for default

    const containerStyles = createDynamicStyles({
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'center' : 'flex-start',
      gap: `${containerGap}px`,
      width: '100%',
    });

    const chartWrapperStyles = createDynamicStyles({
      position: 'relative',
      width: chartWidth,
      flexShrink: 0,
    });

    const centerLabelStyles = createDynamicStyles({
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      pointerEvents: 'none',
    });

    const legendStyles = createDynamicStyles({
      display: 'flex',
      flexDirection: 'column',
      gap: isLarge ? `${spacingNum[3]}px` : `${spacingNum[2]}px`,
      flex: 1,
      minWidth: 0,
      listStyle: 'none',
      padding: 0,
      margin: 0,
    });

    return (
      <div ref={ref} style={containerStyles} aria-describedby={summaryId}>
        {/* Chart */}
        <div style={chartWrapperStyles}>
          <ResponsiveContainer key={`chart-${themeKey}`} width="100%" height={height}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="name"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                isAnimationActive={!reducedMotion}
                animationDuration={reducedMotion ? 0 : 800}
                animationEasing="ease-out"
                paddingAngle={PIE_CONFIG.padAngle}
                cornerRadius={PIE_CONFIG.cornerRadius}
                onClick={onSegmentClick ? (dp) => onSegmentClick((dp as { name?: string }).name || '') : undefined}
                style={{ cursor: onSegmentClick ? 'pointer' : 'default', outline: 'none' }}
              >
                {chartData.map(item => (
                  <Cell
                    key={item.name}
                    fill={item.color}
                    style={{ outline: 'none' }}
                  />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip />} 
                offset={30}
                position={{ x: undefined, y: undefined }}
                wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div style={centerLabelStyles} aria-hidden="true">
            <Text variant="bodySm" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', fontSize: isLarge ? '13px' : undefined }}>
              {top?.name ? 'Top' : 'Total'}
            </Text>
            <div style={{ fontSize: isLarge ? '28px' : '20px', fontWeight: 700, color: textColors.strong, marginBottom: '2px' }}>
              {formatCurrency(top?.amount ?? total)}
            </div>
            {top?.name && (
              <Text variant="bodySm" color="muted" style={{ fontSize: isLarge ? '14px' : undefined }}>{top.name}</Text>
            )}
          </div>
        </div>

        {/* Legend */}
        <ul style={legendStyles} aria-label="Category legend">
          {data.slice(0, 6).map((item) => (
            <li key={item.name} style={{ display: 'flex' }}>
              <LegendChip 
                item={chartData.find(c => c.name === item.name)!} 
                onSegmentClick={onSegmentClick}
                showCount={showCount}
                isLarge={isLarge}
              />
            </li>
          ))}
        </ul>

        {/* Screen reader summary */}
        <div id={summaryId} style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          Category breakdown shows {data.length} categories.
          Top category: {top?.name || 'N/A'} at {formatCurrency(top?.amount || 0)}
          ({top?.percentage?.toFixed(1)}% of total).
          Total spending: {formatCurrency(total)}.
        </div>
      </div>
    );
  }
);

DonutChart.displayName = 'DonutChart';
