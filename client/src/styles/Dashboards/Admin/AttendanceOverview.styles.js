import styled from 'styled-components';

/**
 * Wrapper for the entire attendance section (if custom spacing/layout needed)
 */
export const AttendanceSection = styled.section`
  /* Inherits Section styles from DashboardLayout */
  /* Add custom overrides here if needed */
`;

/**
 * Chart wrapper with responsive height and padding
 */
export const ChartWrapper = styled.div`
  width: 100%;
  min-height: 180px;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: 160px;
  }
`;

/**
 * Summary container for metrics below chart
 */
export const SummaryContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

/**
 * Individual summary metric item
 */
export const SummaryMetric = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

/**
 * Metric value with dynamic color support
 * @prop {string} $trendColor - Optional color for trend indicator
 */
export const MetricValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.h3};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  ${({ $trendColor }) => $trendColor && `color: ${$trendColor};`};
`;

/**
 * Metric label text
 */
export const MetricLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.bodyXs};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/**
 * Empty state when no attendance data available
 */
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  color: ${({ theme }) => theme.colors.textTertiary};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  
  p {
    margin: ${({ theme }) => theme.spacing.xs} 0 0;
    font-size: ${({ theme }) => theme.fontSizes.bodySm};
  }
`;

/**
 * Loading skeleton placeholder
 */
export const SkeletonLoader = styled.div`
  width: 100%;
  height: 180px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.bgSecondary} 25%,
    ${({ theme }) => theme.colors.bgTertiary} 50%,
    ${({ theme }) => theme.colors.bgSecondary} 75%
  );
  background-size: 200% 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  animation: loading 1.5s infinite;
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;