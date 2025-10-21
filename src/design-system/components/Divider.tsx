/**
 * DIVIDER COMPONENT
 * Horizontal rule for visual separation
 */

import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { spacing, surface, type Spacing } from '../tokens';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

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
