import styled from 'styled-components';

export const FormGroup = styled.div`
   display: flex;
   flex-direction: column;
   gap: 0.5rem;
`;

export const FormLabel = styled.label`
   font-size: 0.875rem;
   font-weight: 500;
   color: ${props => props.theme.colors.textSecondary};
`;

export const FormInput = styled.input`
   padding: 0.875rem 1rem;
   background: ${props => props.theme.colors.bgTertiary};
   border: 1px solid ${props => props.theme.colors.borderColor};
   border-radius: 8px;
   color: ${props => props.theme.colors.textPrimary};
   font-size: 1rem;
   transition: ${props => props.theme.transitions.default};

   &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.accentPrimary};
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
   }

   &::placeholder {
      color: ${props => props.theme.colors.textTertiary};
   }
`;

export const FormOptions = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;

   @media (max-width: 640px) {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
   }
`;

export const CheckboxLabel = styled.label`
   display: flex;
   align-items: center;
   gap: 8px;
   font-size: 0.875rem;
   color: ${props => props.theme.colors.textSecondary};
   cursor: pointer;
`;

export const Checkbox = styled.input`
   width: 16px;
   height: 16px;
   cursor: pointer;
`;

export const ForgotLink = styled.a`
   color: ${props => props.theme.colors.accentPrimary};
   text-decoration: none;
   font-size: 0.875rem;
   font-weight: 500;

   &:hover {
      text-decoration: underline;
   }
`;

export const LoginButton = styled.button`
   width: 100%;
   padding: 1rem;
   background: ${props => props.theme.colors.accentPrimary};
   color: white;
   border: none;
   border-radius: 8px;
   font-size: 1rem;
   font-weight: 600;
   cursor: pointer;
   transition: ${props => props.theme.transitions.default};

   &:hover {
      background: ${props => props.theme.colors.accentSecondary};
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
   }
`;
