/**
 * BOX COMPONENT
 * Primitive layout component - the most basic building block
 * Use this instead of div when you need a styled container
 */

import { forwardRef, type ReactNode, type HTMLAttributes, type ElementType } from 'react';

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  children?: ReactNode;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      as: Component = 'div',
      children,
      style,
      ...props
    },
    ref
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Comp = Component as any;
    
    return (
      <Comp
        ref={ref}
        style={style}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Box.displayName = 'Box';
