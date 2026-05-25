import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { TableContainer, Table, Th, Tr, Td, SortIcon, StatusBadge, TableFooter, PaginationInfo, PaginationControls, PaginationButton, EmptyState, TableSkeleton, } from '../../../styles/Dashboards/Shared/DataTable.styles';

/**
 * DataTable Component - Generic sortable, paginated data table
 *
 * @param {Object} props
 * @param {Array} props.columns - Column definitions [{ key, label, sortable, align, render }]
 * @param {Array} props.data - Array of data objects to display
 * @param {number} props.pageSize - Rows per page (default: 10)
 * @param {boolean} props.showPagination - Show pagination controls (default: true)
 * @param {boolean} props.loading - Loading state (shows skeleton)
 * @param {string} props.emptyMessage - Custom empty state message
 * @param {Function} props.onRowClick - Optional row click handler
 * 
 * @returns {React.ReactElement} Rendered data table
 *
 * @example
 * <DataTable
 *   columns={[
 *     { key: 'name', label: 'Name', sortable: true },
 *     { key: 'status', label: 'Status', render: (val) => <StatusBadge>{val}</StatusBadge> }
 *   ]}
 *   data={[{ id: 1, name: 'Event 1', status: 'Active' }]}
 *   pageSize={5}
 *   onRowClick={(row) => console.log('Clicked:', row)}
 * />
 */
const DataTable = ({
  columns = [],
  data = [],
  pageSize = 10,
  showPagination = true,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Sort data with stable comparison
  const sortedData = useMemo(() => {
    if (!sortConfig.key || data.length === 0) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bVal == null) return sortConfig.direction === 'asc' ? -1 : 1;

      // String comparison (case-insensitive)
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const cmp = aVal.localeCompare(bVal, undefined, { sensitivity: 'base' });
        return sortConfig.direction === 'asc' ? cmp : -cmp;
      }

      // Numeric comparison
      if (sortConfig.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }, [data, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, showPagination]);

  // Calculate pagination metrics
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, data.length);

  // Handle sort toggle
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Render cell content with optional custom renderer
  const renderCell = (row, column) => {
    if (column.render && typeof column.render === 'function') {
      return column.render(row[column.key], row, column.key);
    }
    return row[column.key] ?? '—'; // Fallback for null/undefined
  };

  // Loading state: show skeleton
  if (loading) {
    return (
      <TableContainer role="status" aria-busy="true">
        <TableSkeleton aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <div key={`skeleton-row-${i}`} className="skeleton-row">
              {columns.map((col) => (
                <div key={`${col.key}-cell`} className="skeleton-cell" />
              ))}
            </div>
          ))}
        </TableSkeleton>
      </TableContainer>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <EmptyState role="status" aria-live="polite">
        <p>{emptyMessage}</p>
        <small>Try adjusting your filters or check back later</small>
      </EmptyState>
    );
  }

  return (
    <TableContainer role="table" aria-label="Data table">
      <Table>
        <thead>
          <Tr>
            {columns.map((column) => {
              const isSorted = sortConfig.key === column.key;
              const sortDirection = isSorted ? sortConfig.direction : null;
              
              return (
                <Th
                  key={column.key}
                  $align={column.align}
                  sortable={column.sortable}
                  onClick={() => column.sortable && handleSort(column.key)}
                  onKeyDown={(e) => {
                    // Keyboard accessibility for sortable headers
                    if (column.sortable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleSort(column.key);
                    }
                  }}
                  tabIndex={column.sortable ? 0 : undefined}
                  aria-sort={
                    isSorted
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                  aria-label={
                    column.sortable
                      ? `${column.label}, sortable column. Current sort: ${
                          isSorted ? sortDirection : 'none'
                        }`
                      : undefined
                  }
                >
                  {column.label}
                  {column.sortable && (
                    <SortIcon $active={isSorted} aria-hidden="true">
                      {isSorted && sortDirection === 'asc' ? '↑' : '↓'}
                    </SortIcon>
                  )}
                </Th>
              );
            })}
          </Tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => {
            const rowKey = row.id ?? row.key ?? `row-${rowIndex}`;
            return (
              <Tr
                key={rowKey}
                onClick={() => onRowClick?.(row)}
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? 'button' : undefined}
                onKeyDown={(e) => {
                  if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onRowClick(row);
                  }
                }}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((column) => (
                  <Td key={`${rowKey}-${column.key}`} $align={column.align}>
                    {renderCell(row, column)}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </tbody>
      </Table>

      {showPagination && totalPages > 1 && (
        <TableFooter>
          <PaginationInfo aria-live="polite">
            Showing {startIndex} to {endIndex} of {data.length} entries
          </PaginationInfo>
          <PaginationControls>
            <PaginationButton
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Previous
            </PaginationButton>
            <PaginationButton
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </PaginationButton>
          </PaginationControls>
        </TableFooter>
      )}
    </TableContainer>
  );
};

// ✅ PropTypes for runtime validation
DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageSize: PropTypes.number,
  showPagination: PropTypes.bool,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  onRowClick: PropTypes.func,
};

// ✅ Default props for safer rendering
DataTable.defaultProps = {
  pageSize: 10,
  showPagination: true,
  loading: false,
  emptyMessage: 'No data available',
};

export default DataTable;

// ✅ Re-export styled components for backward compatibility
export {
  StatusBadge,
  TableContainer,
  Table,
  Th,
  Td,
  Tr,
  TableFooter,
  PaginationButton,
  PaginationInfo,
  EmptyState,
  SortIcon,
  PaginationControls,
  TableSkeleton,
};