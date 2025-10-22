/**
 * LOADING SPINNER COMPONENT
 * Neomorphic loading indicator with soft shadows and smooth animation
 * Supports multiple sizes and reduced motion preferences
 */

import {
  forwardRef,
  useMemo,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { useTheme, usePrefersReducedMotion } from "../index";

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** Size of the spinner */
  readonly size?: "small" | "medium" | "large";
  /** Label for screen readers */
  readonly label?: string;
  /** Show label text below spinner */
  readonly showLabel?: boolean;
}

const SIZE_MAP = {
  small: 24,
  medium: 40,
  large: 64,
} as const;

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

/**
 * Loading spinner with neomorphic design and smooth animation.
 * Respects prefers-reduced-motion for accessibility.
 */
export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  (
    { size = "medium", label = "Loading", showLabel = false, style, ...props },
    ref
  ) => {
    const { brand, text: textColors } = useTheme();
    const prefersReducedMotion = usePrefersReducedMotion();

    const spinnerSize = SIZE_MAP[size];

    // Determine border width based on size
    let borderWidth = 3;
    if (size === "small") borderWidth = 2;
    else if (size === "large") borderWidth = 4;

    const containerStyles = useMemo(
      () =>
        createDynamicStyles({
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }),
      []
    );

    const spinnerStyles = useMemo(
      () =>
        createDynamicStyles({
          width: `${spinnerSize}px`,
          height: `${spinnerSize}px`,
          border: `${borderWidth}px solid ${textColors.disabled}`,
          borderTopColor: brand.primary,
          borderRadius: "50%",
          animation: prefersReducedMotion
            ? "none"
            : "spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        }),
      [
        spinnerSize,
        borderWidth,
        textColors.disabled,
        brand.primary,
        prefersReducedMotion,
      ]
    );

    // Determine font size based on size
    let fontSize = "14px";
    if (size === "small") fontSize = "12px";
    else if (size === "large") fontSize = "16px";

    const labelStyles = useMemo(
      () =>
        createDynamicStyles({
          fontSize,
          fontWeight: 500,
          color: textColors.secondary,
          letterSpacing: "0.01em",
        }),
      [fontSize, textColors]
    );

    return (
      <>
        <style>
          {`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
        <div
          ref={ref}
          style={{ ...containerStyles, ...style }}
          role="status"
          aria-live="polite"
          aria-label={label}
          {...props}
        >
          <div style={spinnerStyles} />
          {showLabel && <span style={labelStyles}>{label}</span>}
        </div>
      </>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";
