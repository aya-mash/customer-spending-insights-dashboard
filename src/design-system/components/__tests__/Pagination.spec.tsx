/**
 * PAGINATION COMPONENT TESTS
 * Tests for design system Pagination component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  it('renders current page and total pages', () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />);
    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination currentPage={10} totalPages={10} onPageChange={() => {}} />);
    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange when clicking next', () => {
    const handlePageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={handlePageChange} />);
    
    const nextButton = screen.getByLabelText('Next page');
    fireEvent.click(nextButton);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking previous', () => {
    const handlePageChange = vi.fn();
    render(<Pagination currentPage={5} totalPages={10} onPageChange={handlePageChange} />);
    
    const prevButton = screen.getByLabelText('Previous page');
    fireEvent.click(prevButton);
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange when clicking page number', () => {
    const handlePageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={handlePageChange} />);
    
    // Page 2 should be visible (current=1 shows pages around it)
    const page2Button = screen.getByLabelText('Page 2');
    fireEvent.click(page2Button);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('highlights current page', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />);
    // aria-current="page" makes it the current page, label is just "Page 5"
    const currentPage = screen.getByLabelText('Page 5');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });

  it('shows ellipsis for large page ranges', () => {
    render(<Pagination currentPage={1} totalPages={20} onPageChange={() => {}} />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
