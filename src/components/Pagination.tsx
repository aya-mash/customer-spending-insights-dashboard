import { forwardRef } from 'react';
import type { ComponentProps } from 'react';

interface PaginationProps extends ComponentProps<'nav'> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showEllipsis?: boolean;
  maxVisiblePages?: number;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(({
  currentPage,
  totalPages,
  onPageChange,
  showEllipsis = true,
  maxVisiblePages = 5,
  className = '',
  ...props
}, ref) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    if (showEllipsis) {
      if (start > 2) pages.unshift(1, -1); // -1 represents ellipsis
      else if (start === 2) pages.unshift(1);
      
      if (end < totalPages - 1) pages.push(-2, totalPages); // -2 represents ellipsis
      else if (end === totalPages - 1) pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      ref={ref}
      className={`pagination ${className}`}
      role="navigation"
      aria-label="Pagination"
      {...props}
    >
      <button
        type="button"
        className="pagination__item"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      {visiblePages.map((page, index) => {
        if (page === -1 || page === -2) {
          return (
            <span
              key={`ellipsis-${index}`}
              className="pagination__item pagination__item--ellipsis"
              aria-hidden="true"
            >
              …
            </span>
          );
        }

        return (
          <button
            key={page}
            type="button"
            className={`pagination__item ${page === currentPage ? 'pagination__item--active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        className="pagination__item"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
});

Pagination.displayName = 'Pagination';