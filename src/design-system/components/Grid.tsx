/**
 * GRID COMPONENT
 * Responsive CSS Grid layout with configurable columns and gap
 */

import React, { forwardRef, useMemo, type CSSProperties, type ReactNode, type HTMLAttributes } from 'react';
import { spacing, type Spacing, type ResponsiveValue } from '../tokens';
import { useResponsiveValue } from '../index';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns (responsive or fixed) */
  columns?: ResponsiveValue<number> | number;
  /** Gap between grid items */
  gap?: ResponsiveValue<Spacing> | Spacing;
  /** Grid content */
  children: ReactNode;
}

export const Grid = React.memo(
  forwardRef<HTMLDivElement, GridProps>(
    ({ columns = 1, gap = 4, children, style, ...props }, ref) => {
      const resolvedColumns = useResponsiveValue(columns);
      const resolvedGap = useResponsiveValue(gap);

      const gridStyles = useMemo(() => createDynamicStyles({
        display: 'grid',
        gridTemplateColumns: `repeat(${resolvedColumns}, 1fr)`,
        gap: spacing[resolvedGap] || spacing[4],
      }), [resolvedColumns, resolvedGap]);

      return (
        <div ref={ref} style={{ ...gridStyles, ...style }} {...props}>
          {children}
        </div>
      );
    }
  )
);

Grid.displayName = 'Grid';

