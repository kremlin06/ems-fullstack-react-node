// src/styles/Dashboards/Shared/ChartContainer.styles.js
import styled from 'styled-components';

/**
 * =============================================================================
 * SHARED CHART CONTAINER STYLED COMPONENTS
 * =============================================================================
 * Purpose: Visual primitives for CSS-based charts & chart wrappers
 * Usage: Import into ChartContainer.jsx & re-export for backward compatibility
 * Theme: All spacing/colors/typography reference `theme` for consistency
 * =============================================================================
 */

/**
 * Main chart wrapper with dynamic height & card styling
 * @prop {string} $height - CSS height value (default: '300px')
 */
export const ChartWrapper = styled.div`
  position: relative;
  width: 100%;
  height: ${({ $height }) => $height || '300px'};
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

/**
 * Flex container for CSS bar chart
 * @prop {string} $chartHeight - CSS height value (default: '200px')
 */
export const BarChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: ${({ $chartHeight }) => $chartHeight || '200px'};
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

/**
 * Wrapper for individual bar + label pair
 */
export const BarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
`;

/**
 * Individual bar element with dynamic height & color
 * @prop {number} $height - Percentage height (0-100)
 * @prop {string} $color - Bar fill color
 */
export const Bar = styled.div`
  width: 100%;
  max-width: 48px;
  height: ${({ $height }) => $height}%;
  background: ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.borderRadius.sm} ${({ theme }) => theme.borderRadius.sm} 0 0;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    opacity: 0.85;
    transform: scaleY(1.02);
    transform-origin: bottom;
  }
`;

/**
 * X-axis label below each bar
 */
export const BarLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.bodyXs};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 4px;
  white-space: nowrap;
`;

/**
 * Value text above each bar
 */
export const BarValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.bodyXs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 2px;
`;

/**
 * Summary metrics row below chart
 */
export const ChartSummary = styled.div`
  display: flex;
  justify-content: space-around;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

/**
 * Individual summary metric container
 */
export const SummaryItem = styled.div`
  text-align: center;
`;

/**
 * Summary metric value
 */
export const SummaryValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.h4};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/**
 * Summary metric label
 */
export const SummaryLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.bodyXs};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

/**
 * Loading pulse animation skeleton
 */
export const ChartSkeleton = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.bgTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  animation: chartPulse 1.5s infinite ease-in-out;

  @keyframes chartPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;