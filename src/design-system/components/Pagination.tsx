/**
 * PAGINATION COMPONENT
 * Pill-style pagination with page numbers, prev/next controls
 * Supports server-side pagination with callbacks
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { brand, surface, text as textColors, radius, spacingNum } from '../tokens';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
  showPrevNext?: boolean;
  disabled?: boolean;
}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      maxVisible = 7,
      showPrevNext = true,
      disabled = false,
      style,
      ...props
    },
    ref
  ) => {
    if (totalPages <= 1) return null;

    const containerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: `${spacingNum[2]}px`,
      flexWrap: 'wrap' as const,
      ...style,
    };

    const getPageNumbers = (): (number | 'ellipsis')[] => {
      if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const pages: (number | 'ellipsis')[] = [];
      const leftSiblingIndex = Math.max(currentPage - 1, 1);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

      const shouldShowLeftEllipsis = leftSiblingIndex > 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

      // Always show first page
      pages.push(1);

      if (shouldShowLeftEllipsis) {
        pages.push('ellipsis');
      } else if (leftSiblingIndex === 2) {
        pages.push(2);
      }

      // Show pages around current
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (shouldShowRightEllipsis) {
        pages.push('ellipsis');
      } else if (rightSiblingIndex === totalPages - 1) {
        pages.push(totalPages - 1);
      }

      // Always show last page
      if (totalPages !== 1) {
        pages.push(totalPages);
      }

      return pages;
    };

    const getPillButtonStyle = (isActive: boolean, isDisabled: boolean) => ({
      minWidth: '40px',
      height: '40px',
      padding: `0 ${spacingNum[3]}px`,
      borderRadius: radius.full,
      border: isActive
        ? `2px solid ${brand.primary}`
        : `1px solid ${surface.border}`,
      backgroundColor: isActive ? brand.primary : surface.surface,
      color: isActive ? textColors.inverse : isDisabled ? textColors.disabled : textColors.primary,
      fontSize: '14px',
      fontWeight: isActive ? 600 : 500,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s ease',
      opacity: isDisabled ? 0.5 : 1,
      fontFamily: 'inherit',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    });

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, isActive: boolean, isDisabled: boolean) => {
      if (!isActive && !isDisabled) {
        e.currentTarget.style.backgroundColor = surface.hover;
        e.currentTarget.style.borderColor = brand.primary;
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>, isActive: boolean) => {
      if (!isActive) {
        e.currentTarget.style.backgroundColor = surface.surface;
        e.currentTarget.style.borderColor = surface.border;
      }
    };

    const pages = getPageNumbers();

    return (
      <nav ref={ref} style={containerStyle} aria-label="Pagination" {...props}>
        {/* Previous button */}
        {showPrevNext && (
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={disabled || currentPage === 1}
            style={getPillButtonStyle(false, currentPage === 1 || disabled)}
            onMouseEnter={(e) => handleMouseEnter(e, false, currentPage === 1 || disabled)}
            onMouseLeave={(e) => handleMouseLeave(e, false)}
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {/* Page numbers */}
        {pages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                style={{
                  minWidth: '40px',
                  height: '40px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: textColors.secondary,
                  fontSize: '14px',
                  userSelect: 'none',
                }}
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              disabled={disabled}
              style={getPillButtonStyle(isActive, disabled)}
              onMouseEnter={(e) => handleMouseEnter(e, isActive, disabled)}
              onMouseLeave={(e) => handleMouseLeave(e, isActive)}
              aria-label={`Page ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}

        {/* Next button */}
        {showPrevNext && (
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={disabled || currentPage === totalPages}
            style={getPillButtonStyle(false, currentPage === totalPages || disabled)}
            onMouseEnter={(e) => handleMouseEnter(e, false, currentPage === totalPages || disabled)}
            onMouseLeave={(e) => handleMouseLeave(e, false)}
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';
