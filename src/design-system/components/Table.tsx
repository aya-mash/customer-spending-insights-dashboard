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
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  zebraStripe?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  stickyHeader?: boolean;
  maxHeight?: string;
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

    const sortButtonStyle = (col: TableColumn): CSSProperties => ({
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start',
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
    });

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
          <Box as="table" style={tableStyle}>
            <Box as="thead" style={headerStyle}>
              <Box as="tr">
                {columns.map((col) => (
                  <Box
                    key={col.key}
                    as="th"
                    style={headerCellStyle}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleHeaderClick(col)}
                        style={sortButtonStyle(col)}
                        aria-label={`${col.label}`}
                        aria-sort={getAriaSort(col.key)}
                      >
                        <span>{col.label}</span>
                        <span>{renderSortIcon(col.key)}</span>
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
                  {columns.map((col) => (
                    <Box
                      key={col.key}
                      as="td"
                      style={cellStyle(col)}
                    >
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {col.render ? col.render((row as any)[col.key], row) : (row as any)[col.key]}
                    </Box>
                  ))}
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

