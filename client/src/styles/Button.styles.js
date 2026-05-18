import styled, { css } from 'styled-components';

// we use a CSS block for shared styles to keep the code DRY (Don't Repeat Yourself)
const baseButtonStyles = css`
  /* layout and spacing */
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: 8px;
  display: inline-block;

  /* typography */
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  text-align: center;

  /* interaction */
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};

  /* reset */
  border: none;
 
  &:hover {
    transform: translateY(0);
  }
`;

// the primary button with solid background, which is a styled component
export const StyledButton = styled.button`
   ${baseButtonStyles}
   background-color: ${props => props.theme.colors.accentPrimary};
   
   &:hover {
      background-color: ${props => props.theme.colors.accentSecondary};
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
   }
`;

  /* the secondary button with transparent background and border */
export const StyledSecondaryButton = styled.button`
   ${baseButtonStyles}
   background: transparent;
   border: 1px solid ${props => props.theme.colors.borderColor};
   
   &:hover {
      background: ${props => props.theme.colors.bgTertiary};
      border-color: ${props => props.theme.colors.textSecondary};
   }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;