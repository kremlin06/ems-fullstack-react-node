import styled from 'styled-components';

/**
 * =============================================================================
 * SHARED DATA TABLE STYLED COMPONENTS
 * =============================================================================
 * Purpose: Visual primitives for sortable, paginated data tables
 * Usage: Import into DataTable.jsx & re-export for backward compatibility
 * Theme: All spacing/colors/typography reference `theme` for consistency
 * Props: $ prefixed props are for styling only (not passed to DOM)
 * =============================================================================
 */

/**
 * Scrollable table wrapper with border radius
 */
export const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  
  /* Hide scrollbar but keep functionality */
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} transparent;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }
`;

/**
 * Native HTML table element
 */
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.cardBg};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
`;

/**
 * Table header cell with optional sorting
 * @prop {string} $align - Text alignment: 'left' | 'center' | 'right'
 * @prop {boolean} sortable - Enables hover/cursor styles for sortable columns
 */
export const Th = styled.th`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  text-align: ${({ $align }) => $align || 'left'};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.bgTertiary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};

  &:first-child {
    border-top-left-radius: ${({ theme }) => theme.borderRadius.lg};
  }
  &:last-child {
    border-top-right-radius: ${({ theme }) => theme.borderRadius.lg};
  }

  ${({ sortable, theme }) =>
    sortable &&
    `
    cursor: pointer;
    user-select: none;
    transition: background-color ${theme.transitions.fast};

    &:hover {
      background: ${theme.colors.bgHover};
    }
    
    &:focus {
      outline: 2px solid ${theme.colors.accentPrimary};
      outline-offset: -2px;
    }
  `}
`;

/**
 * Sort direction indicator
 * @prop {boolean} $active - Whether this column is currently sorted
 */
export const SortIcon = styled.span`
  margin-left: ${({ theme }) => theme.spacing.xs};
  opacity: ${({ $active }) => ($active ? 1 : 0.3)};
  transition: opacity ${({ theme }) => theme.transitions.fast};
  font-size: 0.875rem;
  line-height: 1;
`;

/**
 * Table body row
 */
export const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.cardHover};
  }

  &:focus-within {
    background: ${({ theme }) => theme.colors.bgHover};
  }
`;

/**
 * Table data cell
 * @prop {string} $align - Text alignment: 'left' | 'center' | 'right'
 */
export const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  text-align: ${({ $align }) => $align || 'left'};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textPrimary};
  vertical-align: middle;
`;

/**
 * Status badge for cell content
 * @prop {string} $bg - Background color (hex or theme token)
 * @prop {string} $color - Text color (hex or theme token)
 */
export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.bodyXs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;
`;

/**
 * Table footer with pagination controls
 */
export const TableFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.bgTertiary};
  border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

/**
 * Pagination info text
 */
export const PaginationInfo = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/**
 * Container for pagination buttons
 */
export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

/**
 * Pagination navigation button
 * @prop {boolean} $disabled - Disabled state styling
 */
export const PaginationButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.bgHover};
    border-color: ${({ theme }) => theme.colors.accentPrimary};
  }

  &:focus:not(:disabled) {
    outline: 2px solid ${({ theme }) => theme.colors.accentPrimary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

/**
 * Empty state message container
 */
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textTertiary};
  min-height: 200px;
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px dashed ${({ theme }) => theme.colors.borderColor};

  svg {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    opacity: 0.6;
  }

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSizes.bodySm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }

  small {
    font-size: ${({ theme }) => theme.fontSizes.bodyXs};
  }
`;

/**
 * Loading skeleton for table rows
 */
export const TableSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};

  .skeleton-row {
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    
    .skeleton-cell {
      flex: 1;
      height: 40px;
      border-radius: ${({ theme }) => theme.borderRadius.sm};
      background: linear-gradient(
        90deg,
        ${({ theme }) => theme.colors.bgSecondary} 25%,
        ${({ theme }) => theme.colors.bgTertiary} 50%,
        ${({ theme }) => theme.colors.bgSecondary} 75%
      );
      background-size: 200% 100%;
      animation: skeletonPulse 1.5s infinite ease-in-out;
      
      &:nth-child(odd) { animation-delay: 0.2s; }
      &:nth-child(even) { animation-delay: 0.4s; }
    }
  }

  @keyframes skeletonPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;