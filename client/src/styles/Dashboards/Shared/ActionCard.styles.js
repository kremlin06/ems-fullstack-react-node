import styled from 'styled-components'
/**
 * Action card container
 */
export const ActionCardContainer = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadowSm};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

/**
 * Card header with title and subtitle
 */
export const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
`;

/**
 * Card title
 */
export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.h4};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

/**
 * Card subtitle
 */
export const CardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin: 0;
`;

/**
 * Action buttons grid
 */
export const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
`;

/**
 * Individual action button
 */
export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ $variant, theme }) => {
    const variants = {
      primary: `${theme.colors.accentPrimary}15`,
      secondary: `${theme.colors.bgTertiary}`,
      ghost: 'transparent',
    };
    return variants[$variant] || variants.ghost;
  }};
  border: 1px solid ${({ $variant, theme }) => {
    const borders = {
      primary: theme.colors.accentPrimary,
      secondary: theme.colors.borderColor,
      ghost: theme.colors.borderColor,
    };
    return borders[$variant] || borders.ghost;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-align: left;
  width: 100%;

  &:hover {
    background: ${({ $variant, theme }) => {
      const hovers = {
        primary: theme.colors.accentPrimary,
        secondary: theme.colors.bgHover,
        ghost: theme.colors.bgHover,
      };
      return hovers[$variant] || hovers.ghost;
    }};
    border-color: ${({ $variant, theme }) => {
      if ($variant === 'primary') return theme.colors.accentPrimary;
      return theme.colors.accentPrimary;
    }};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

/**
 * Action icon container
 */
export const ActionIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  flex-shrink: 0;
`;

/**
 * Action content wrapper
 */
export const ActionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

/**
 * Action label
 */
export const ActionLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/**
 * Action description
 */
export const ActionDesc = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.bodyXs};
  color: ${({ theme }) => theme.colors.textTertiary};
  
  /* Truncate long descriptions */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

