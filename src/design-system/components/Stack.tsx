/**
 * STACK COMPONENT
 * Flexbox layout primitive for horizontal/vertical stacking with spacing
 */

import { forwardRef, type CSSProperties, type ReactNode, type HTMLAttributes } from 'react';
import { spacing, type Spacing, type ResponsiveValue } from '../tokens';
import { useResponsiveValue } from '../index';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

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
