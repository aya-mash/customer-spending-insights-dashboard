/**
 * TABLE COMPONENT
 * Data grid with sortable columns, zebra striping, responsive behavior
 * Replaces semantic HTML tables with design system component
 */

import React, { forwardRef, type ReactNode, type CSSProperties } from 'react';
import { surface, text as textColors, radius } from '../tokens';
import { Box } from './Box';
import { Card } from './Card';
import { Stack } from './Stack';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: T) => ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TableProps<T = any> {
  /** Array of column definitions specifying keys, labels, and rendering */
  columns: TableColumn<T>[];
  /** Array of data rows to display in the table */
  data: T[];
  /** Function to extract unique key from each row for React key prop */
  keyExtractor: (row: T) => string;
  /** Callback function when a column header is clicked for sorting */
  onSort?: (key: string) => void;
  /** The key of the currently sorted column */
  sortKey?: string;
  /** The current sort direction (ascending or descending) */
  sortDirection?: 'asc' | 'desc';
  /** Whether to apply alternating row background colors */
  zebraStripe?: boolean;
  /** Whether the table is in a loading state */
  loading?: boolean;
  /** Message to display when table has no data */
  emptyMessage?: string;
  /** Whether the header row should stick to the top while scrolling */
  stickyHeader?: boolean;
  /** Maximum height of the table container before scrolling */
  maxHeight?: string;
  /** Accessible label for the table */
  'aria-label'?: string;
}

export const Table = React.memo(
  forwardRef<HTMLDivElement, TableProps>(
  (
    {
      columns,
      data,
      keyExtractor,
      onSort,
      sortKey,
      sortDirection,
      zebraStripe = true,
      loading = false,
      emptyMessage = 'No data available',
      stickyHeader = false,
      maxHeight = '600px',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const containerStyle: CSSProperties = {
      overflow: 'hidden',
      border: `1px solid ${surface.border}`,
      borderRadius: radius.lg,
      display: 'flex',
      flexDirection: 'column',
      maxHeight,
    };

    const tableWrapperStyle: CSSProperties = {
      overflowX: 'auto',
      overflowY: 'auto',
      flex: 1,
      maxHeight,
    };

    const tableStyle: CSSProperties = {
      width: '100%',
      borderCollapse: 'collapse',
      display: 'table',
    };

    const headerStyle: CSSProperties = {
      backgroundColor: surface.surfaceAlt,
      borderBottom: `2px solid ${surface.border}`,
      display: 'table-header-group',
      position: stickyHeader ? 'sticky' : 'relative',
      top: 0,
      zIndex: 10,
    };

    const headerCellStyle: CSSProperties = {
      padding: '12px 16px',
      fontWeight: 600,
      fontSize: '14px',
      color: textColors.secondary,
      userSelect: 'none',
    };

    const sortButtonStyle = (col: TableColumn): CSSProperties => {
      // Calculate justifyContent based on alignment
      let justifyContent: 'flex-start' | 'center' | 'flex-end';
      if (col.align === 'right') {
        justifyContent = 'flex-end';
      } else if (col.align === 'center') {
        justifyContent = 'center';
      } else {
        justifyContent = 'flex-start';
      }

      return {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent,
        gap: '8px',
        padding: '0',
        border: 'none',
        background: 'transparent',
        color: textColors.secondary,
        fontWeight: 600,
        fontSize: '14px',
        fontFamily: 'inherit',
        cursor: 'pointer',
        userSelect: 'none',
      };
    };

    const getRowStyle = (idx: number): CSSProperties => ({
      backgroundColor: zebraStripe && idx % 2 === 0 ? 'transparent' : surface.surfaceAlt,
      borderBottom: `1px solid ${surface.border}`,
    });

    const cellStyle = (col: TableColumn): CSSProperties => ({
      padding: '12px 16px',
      fontSize: '14px',
      color: textColors.primary,
      textAlign: col.align || 'left',
    });

    const handleHeaderClick = (col: TableColumn) => {
      if (col.sortable && onSort) {
        onSort(col.key);
      }
    };

    const renderSortIcon = (colKey: string) => {
      if (sortKey !== colKey) return null;
      return sortDirection === 'asc' ? ' ↑' : ' ↓';
    };

    const getAriaSort = (colKey: string): 'ascending' | 'descending' | 'none' | undefined => {
      if (sortKey !== colKey) return 'none';
      return sortDirection === 'asc' ? 'ascending' : 'descending';
    };

    if (loading) {
      return (
        <Card ref={ref} padding={8} {...props}>
          <Stack spacing={4} align="center">
            <Box style={{ color: textColors.secondary }}>Loading...</Box>
          </Stack>
        </Card>
      );
    }

    if (data.length === 0) {
      return (
        <Card ref={ref} padding={8} {...props}>
          <Stack spacing={4} align="center">
            <Box style={{ color: textColors.secondary }}>{emptyMessage}</Box>
          </Stack>
        </Card>
      );
    }

    return (
      <Box ref={ref} style={containerStyle} {...props}>
        <Box style={tableWrapperStyle}>
          <Box as="table" style={tableStyle} role="table" aria-label={ariaLabel}>
            <Box as="thead" style={headerStyle}>
              <Box as="tr">
                {columns.map((col) => (
                  <Box
                    key={col.key}
                    as="th"
                    style={headerCellStyle}
                    aria-sort={col.sortable ? getAriaSort(col.key) : undefined}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleHeaderClick(col)}
                        style={sortButtonStyle(col)}
                      >
                        <span>{col.label}</span>
                        <span aria-hidden="true">{renderSortIcon(col.key)}</span>
                      </button>
                    ) : (
                      <div style={{ textAlign: col.align || 'left' }}>
                        {col.label}
                      </div>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {data.map((row, idx) => (
                <Box
                  key={keyExtractor(row)}
                  as="tr"
                  style={getRowStyle(idx)}
                >
                  {columns.map((col) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const rowData = row as Record<string, any>;
                    const cellValue = rowData[col.key];
                    return (
                      <Box
                        key={col.key}
                        as="td"
                        style={cellStyle(col)}
                      >
                        {col.render ? col.render(cellValue, row) : cellValue}
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  })
);

Table.displayName = 'Table';

