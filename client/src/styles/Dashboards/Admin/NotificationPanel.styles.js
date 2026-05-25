import styled from 'styled-components';

/**
 * Main card container with urgency-based left border accent
 * @prop {string} $urgency - 'high' | 'medium' | 'low' (controls border color)
 */
export const NotificationCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.bgTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 3px solid ${({ $urgency, theme }) => {
    switch ($urgency) {
      case 'high': return theme.colors.error;
      case 'medium': return theme.colors.warning;
      default: return theme.colors.info;
    }
  }};
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
  }
`;

/**
 * Icon container with type-based background/color theming
 * @prop {string} $type - 'approval' | 'alert' | 'report' | default
 */
export const NotificationIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${({ $type, theme }) => {
    const colors = {
      approval: `${theme.colors.accentPrimary}20`,
      alert: `${theme.colors.warning}20`,
      report: `${theme.colors.info}20`,
    };
    return colors[$type] || `${theme.colors.textTertiary}20`;
  }};
  color: ${({ $type, theme }) => {
    const colors = {
      approval: theme.colors.accentPrimary,
      alert: theme.colors.warning,
      report: theme.colors.info,
    };
    return colors[$type] || theme.colors.textSecondary;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  flex-shrink: 0;
`;

/**
 * Flexible content wrapper for notification text
 */
export const NotificationContent = styled.div`
  flex: 1;
  min-width: 0; /* Enables text truncation */
`;

/**
 * Notification title text with theme-aware typography
 */
export const NotificationTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.4;
  
  /* Optional: truncate long titles */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/**
 * Count badge for notifications with quantity
 */
export const NotificationCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  background: ${({ theme }) => theme.colors.accentPrimary};
  color: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.bodyXs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  flex-shrink: 0;
`;

/**
 * Empty state container for zero notifications
 */
export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textTertiary};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
`;