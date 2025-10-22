/**
 * DIVIDER COMPONENT
 * Horizontal rule for visual separation
 */

import React, { forwardRef, useMemo, type CSSProperties, type HTMLAttributes } from 'react';
import { spacing, type Spacing } from '../tokens';
import { useTheme } from '../index';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  /** Spacing around divider */
  spacing?: Spacing;
}

export const Divider = React.memo(
  forwardRef<HTMLHRElement, DividerProps>(
    ({ spacing: spacingProp = 6, style, ...props }, ref) => {
      const { surface } = useTheme();
      
      const dividerStyles = useMemo(() => createDynamicStyles({
        border: 'none',
        borderTop: `1px solid ${surface.border}`,
        margin: `${spacing[spacingProp]} 0`,
      }), [spacingProp, surface.border]);

      return <hr ref={ref} style={{ ...dividerStyles, ...style }} {...props} />;
    }
  )
);

Divider.displayName = 'Divider';

