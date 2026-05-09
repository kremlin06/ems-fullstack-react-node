import styled from 'styled-components';

export const StyledButton = styled.button`
  background-color: ${props => props.theme.colors.accentPrimary};
  color: ${props => props.theme.colors.textPrimary};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  display: inline-block;

  &:hover {
    background-color: ${props => props.theme.colors.accentSecondary};
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const StyledSecondaryButton = styled.button`
  background: transparent;
  color: ${props => props.theme.colors.textPrimary};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  border: 1px solid ${props => props.theme.colors.borderColor};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  display: inline-block;

  &:hover {
    background: ${props => props.theme.colors.bgTertiary};
    border-color: ${props => props.theme.colors.textSecondary};
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;