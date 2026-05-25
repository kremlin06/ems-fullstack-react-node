// src/styles/Dashboards/Shared/DashboardLayout.styles.js
import styled from 'styled-components';

/**
 * =============================================================================
 * SHARED DASHBOARD LAYOUT STYLED COMPONENTS
 * =============================================================================
 * Purpose: Core layout primitives for all dashboard views
 * Usage: Import into DashboardLayout.jsx & re-export for backward compatibility
 * Theme: All spacing/colors/breakpoints reference `theme` for consistency
 * =============================================================================
 */

/**
 * these are named exports
 * Main dashboard wrapper with responsive padding & background
 */
export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.bgPrimary};
  min-height: calc(100vh - 64px);
`;

/**
 * Dashboard header row
 */
export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

/**
 * Header left content wrapper
 */
export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

/**
 * Dashboard title
 */
export const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.h3};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

/**
 * Dashboard subtitle
 */
export const HeaderSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

/**
 * Header right actions wrapper
 */
export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

/**
 * Date display chip
 */
export const DateChip = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.bgTertiary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

/**
 * Header icon button (notifications, settings, etc.)
 */
export const IconButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

/**
 * Notification badge dot
 */
export const NotifDot = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background: ${({ theme }) => theme.colors.error};
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.cardBg};
`;

/**
 * Responsive 4-column stat card grid
 */
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

/**
 * Two-column main content layout
 */
export const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

/**
 * Left content column
 */
export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

/**
 * Right sidebar column
 */
export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

/**
 * Reusable content section card
 */
export const Section = styled.section`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadowSm};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

/**
 * Section header row
 */
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
`;

/**
 * Section title
 */
export const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.h4};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

/**
 * Section subtitle
 */
export const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin: ${({ theme }) => theme.spacing.xs} 0 0 0;
`;

/**
 * Section actions wrapper (buttons, links)
 */
export const SectionActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

/**
 * Section content body
 */
export const SectionBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

/**
 * Section header link
 */
export const SectionLink = styled.a`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textLink};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  &:hover {
    text-decoration: underline;
  }
`;