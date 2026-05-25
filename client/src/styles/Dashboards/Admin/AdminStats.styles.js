import styled from 'styled-components';

/**
 * =============================================================================
 * ADMIN STATS STYLED COMPONENTS
 * =============================================================================
 * Purpose: Visual styling for admin statistics grid and wrappers
 * Usage: Import into AdminStats.jsx
 * Note: Individual stat card styling lives in StatCard; this file handles
 *       grid layout, admin-specific overrides, and state enhancements.
 * =============================================================================
 */

/**
 * Grid container for stat cards with responsive columns
 * Extends DashboardLayout's StatsGrid with admin-specific tweaks if needed
 */
export const StatsGridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.sm};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

/**
 * Loading skeleton for stats grid
 */
export const StatsSkeleton = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  
  .skeleton-card {
    height: 120px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.bgSecondary} 25%,
      ${({ theme }) => theme.colors.bgTertiary} 50%,
      ${({ theme }) => theme.colors.bgSecondary} 75%
    );
    background-size: 200% 100%;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

/**
 * Empty state container when no stats available
 */
export const StatsEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textTertiary};
  background: ${({ theme }) => theme.colors.bgTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  
  p {
    margin: ${({ theme }) => theme.spacing.xs} 0 0;
    font-size: ${({ theme }) => theme.fontSizes.bodySm};
  }
`;

/**
 * Optional: Admin-specific stat card enhancement wrapper
 * Use this if you need to override StatCard styles for admin context only
 */
export const AdminStatCardWrapper = styled.div`
  /* Example: Add admin-only badge or indicator */
  position: relative;
  
  &::after {
    /* Uncomment to add a subtle admin indicator */
    /*
    content: '';
    position: absolute;
    top: 8px;
    right: 8px;
    width: 8px;
    height: 8px;
    background: ${({ theme }) => theme.colors.accentPrimary};
    border-radius: 50%;
    */
  }
`;