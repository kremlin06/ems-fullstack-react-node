import styled from 'styled-components';

/**
 * Scrollable container for activity list items
 * Handles max-height, overflow, and padding
 */
export const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 0 ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg};
  max-height: 280px;
  overflow-y: auto;
  
  /* Custom scrollbar for WebKit browsers */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bgSecondary};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
    &:hover {
      background: ${({ theme }) => theme.colors.textTertiary};
    }
  }
  
  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} ${({ theme }) => theme.colors.bgSecondary};
`;

/**
 * Individual activity row with border separator
 */
export const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  transition: background-color 0.15s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.bgSecondary};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    margin: 0 -${({ theme }) => theme.spacing.sm};
    padding-left: ${({ theme }) => theme.spacing.sm};
    padding-right: ${({ theme }) => theme.spacing.sm};
  }
`;

/**
 * Circular icon container with dynamic color theming
 * @prop {string} $color - Hex color for background tint and icon fill
 */
export const ActivityIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: ${({ $color }) => `${$color}20`}; /* 20 = ~12% opacity */
  color: ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  flex-shrink: 0;
  transition: transform 0.15s ease;
  
  ${ActivityItem}:hover & {
    transform: scale(1.05);
  }
`;

/**
 * Flexible content wrapper for message + timestamp
 */
export const ActivityContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0; /* Enables text truncation */
  flex: 1;
`;

/**
 * Main activity message text with truncation support
 */
export const ActivityMessage = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.4;
  
  /* Truncate long messages with ellipsis */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
`;

/**
 * Timestamp text with tertiary color
 */
export const ActivityTime = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.bodyXs};
  color: ${({ theme }) => theme.colors.textTertiary};
  white-space: nowrap;
`;

/**
 * Empty state container when no activities exist
 */
export const ActivityEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textTertiary};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  min-height: 120px;
  
  svg {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    opacity: 0.6;
  }
`;

/**
 * Loading skeleton for activity list
 */
export const ActivitySkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 0 ${({ theme }) => theme.spacing.lg};
  
  .skeleton-item {
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.sm} 0;
    
    .skeleton-icon {
      width: 28px;
      height: 28px;
      border-radius: ${({ theme }) => theme.borderRadius.full};
      background: ${({ theme }) => theme.colors.bgTertiary};
      flex-shrink: 0;
    }
    
    .skeleton-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      
      .skeleton-line {
        height: 14px;
        border-radius: 3px;
        background: linear-gradient(
          90deg,
          ${({ theme }) => theme.colors.bgSecondary} 25%,
          ${({ theme }) => theme.colors.bgTertiary} 50%,
          ${({ theme }) => theme.colors.bgSecondary} 75%
        );
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        
        &:first-child {
          width: 85%;
        }
        &:last-child {
          width: 40%;
        }
      }
    }
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

/**
 * "View All" action link styling override if needed
 */
export const ViewAllLink = styled.button`
  /* Inherits SectionLink styles; add admin-specific overrides here */
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  &:hover {
    text-decoration: underline;
  }
`;