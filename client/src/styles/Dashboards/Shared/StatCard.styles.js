import styled from 'styled-components';
// import { $color } from 'theme'
/**
 * =============================================================================
 * SHARED STAT CARD STYLED COMPONENTS
 * =============================================================================
 * Purpose: Visual primitives for metric/stat cards across dashboards
 * Usage: Import into StatCard.jsx & re-export for backward compatibility
 * Theme: All spacing/colors/typography reference `theme` for consistency
 * Props: $ prefixed props are for styling only (not passed to DOM)
 * =============================================================================
 */

/**
 * Main card container with colored top border & hover lift
 * @prop {string} $color - Hex color for top border and icon accent
 * @prop {boolean} $clickable - Enables cursor pointer for interactive cards
 */
export const StatCardContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.colors.shadowSm};
  // border-top: 3px solid ${({ $color, theme }) => $color || theme.colors.accentPrimary};

  box-shadow: ${({ $color, theme}) => {
    if ($color) {
        return `
          0 4px 6px -1px ${$color}30,  /* 30 = ~18% opacity */
          0 2px 4px -1px ${$color}15   /* 15 = ~9% opacity */
      `;
    }
    return theme.colors.shadowSm;  
  }};

  transition: ${({ theme }) => theme.transitions.default};

  
  &:hover {
    transform: translateY(-2px);
    /* Stronger shadow on hover */
    // box-shadow: ${({ theme }) => theme.colors.shadowMd};

    box-shadow: ${({ $color, theme }) => {
      if ($color) {
        return `
          0 10px 15px -3px ${$color}40,
          0 4px 6px -2px ${$color}20
        `;
      }
      return theme.colors.shadowMd;
    }};
  }

  ${({ $clickable }) =>
    $clickable &&
    `
    cursor: pointer;
    
    &:active {
      transform: translateY(0);
    }
  `}
`;

/**
 * Header row: icon left, trend badge right
 */
export const StatCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

/**
 * Circular icon container with tinted background
 * @prop {string} $color - Hex color for background tint and icon fill
 */
export const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ $color }) => `${$color}20`}; /* ~12% opacity */
  color: ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  flex-shrink: 0;
`;

/**
 * Trend badge with semantic color variants
 * @prop {string} $variant - 'positive' | 'negative' | 'neutral' | 'live'
 */
export const StatTrend = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.bodyXs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  /* Semantic color variants */
  ${({ $variant, theme }) => {
    const variants = {
      positive: {
        bg: `${theme.colors.success}15`,
        color: theme.colors.success,
      },
      negative: {
        bg: `${theme.colors.error}15`,
        color: theme.colors.error,
      },
      neutral: {
        bg: `${theme.colors.textTertiary}15`,
        color: theme.colors.textSecondary,
      },
      live: {
        bg: `${theme.colors.warning}15`,
        color: theme.colors.warning,
      },
    };
    const style = variants[$variant] || variants.neutral;
    return `
      background: ${style.bg};
      color: ${style.color};
    `;
  }}
`;

/**
 * Large numeric value display
 */
export const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.h3};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  line-height: 1.2;
  
  /* Truncate very long values gracefully */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * Descriptive label below value
 */
export const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
`;

/**
 * Loading skeleton placeholder
 */
export const StatCardSkeleton = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.colors.shadowSm};
  border-top: 3px solid ${({ theme }) => theme.colors.bgTertiary};
  
  .skeleton-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    
    .skeleton-icon {
      width: 40px;
      height: 40px;
      border-radius: ${({ theme }) => theme.borderRadius.md};
      background: ${({ theme }) => theme.colors.bgTertiary};
    }
    
    .skeleton-trend {
      width: 48px;
      height: 20px;
      border-radius: ${({ theme }) => theme.borderRadius.full};
      background: ${({ theme }) => theme.colors.bgTertiary};
    }
  }
  
  .skeleton-value {
    width: 60%;
    height: 32px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    background: ${({ theme }) => theme.colors.bgTertiary};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  .skeleton-label {
    width: 80%;
    height: 16px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    background: ${({ theme }) => theme.colors.bgTertiary};
  }
  
  /* Pulse animation */
  .skeleton-icon,
  .skeleton-trend,
  .skeleton-value,
  .skeleton-label {
    animation: skeletonPulse 1.5s infinite ease-in-out;
  }
  
  @keyframes skeletonPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;