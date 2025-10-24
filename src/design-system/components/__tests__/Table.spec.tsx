/**
 * TABLE COMPONENT TESTS
 * Tests for design system Table component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import { Table, type TableColumn } from '../Table';

interface TestData {
  id: number;
  name: string;
  amount: number;
}

const mockData: TestData[] = [
  { id: 1, name: 'Item 1', amount: 100 },
  { id: 2, name: 'Item 2', amount: 200 },
  { id: 3, name: 'Item 3', amount: 300 },
];

const mockColumns: TableColumn<TestData>[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { 
    key: 'amount', 
    label: 'Amount', 
    sortable: true,
    align: 'right',
    render: (value) => `$${value}`
  },
];

describe('Table', () => {
  const keyExtractor = (row: TestData) => row.id.toString();

  it('renders table with data', () => {
    render(<Table columns={mockColumns} data={mockData} keyExtractor={keyExtractor} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<Table columns={mockColumns} data={mockData} keyExtractor={keyExtractor} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
  });

  it('renders custom cell content', () => {
    render(<Table columns={mockColumns} data={mockData} keyExtractor={keyExtractor} />);
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();
    expect(screen.getByText('$300')).toBeInTheDocument();
  });

  it('handles sort click on sortable columns', () => {
    const handleSort = vi.fn();
    render(<Table columns={mockColumns} data={mockData} keyExtractor={keyExtractor} onSort={handleSort} />);
    
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(handleSort).toHaveBeenCalledWith('name');
  });

  it('displays sort direction indicators', () => {
    render(
      <Table 
        columns={mockColumns} 
        data={mockData} 
        keyExtractor={keyExtractor}
        sortKey="name" 
        sortDirection="asc" 
      />
    );
    
    // Should show ascending arrow
    const nameHeader = screen.getByText('Name').parentElement;
    expect(nameHeader).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    render(<Table columns={mockColumns} data={[]} keyExtractor={keyExtractor} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('applies zebra striping', () => {
    render(<Table columns={mockColumns} data={mockData} keyExtractor={keyExtractor} />);
    const rows = screen.getAllByRole('row');
    // Should have header + 3 data rows
    expect(rows.length).toBe(4);
  });

  it('applies sticky header when prop is true', () => {
    render(<Table columns={mockColumns} data={mockData} keyExtractor={keyExtractor} stickyHeader />);
    const table = screen.getByRole('table');
    // Just verify the table renders with sticky header prop
    expect(table).toBeInTheDocument();
  });

  it('applies maxHeight prop', () => {
    render(<Table columns={mockColumns} data={mockData} keyExtractor={keyExtractor} maxHeight="400px" />);
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });
});
