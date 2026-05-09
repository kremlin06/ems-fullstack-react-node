import styled from 'styled-components';

export const LoginPageContainer = styled.div`
   background: ${props => props.theme.colors.bgPrimary};
   min-height: 100vh;
`;

export const LoginContainer = styled.div`
   min-height: 100vh;
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 6rem 2rem 2rem;
`;

export const LoginWrapper = styled.div`
   max-width: 1200px;
   width: 100%;
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 4rem;
   align-items: center;

   @media (max-width: 968px) {
      grid-template-columns: 1fr;
      gap: 3rem;
   }
`;

export const LoginInfo = styled.div`
   padding: 2rem;
`;

export const LoginTitle = styled.h1`
   font-size: 3rem;
   font-weight: 700;
   margin-bottom: 1.5rem;
   line-height: 1.1;

   @media (max-width: 968px) {
      font-size: 2.5rem;
   }

   @media (max-width: 640px) {
      font-size: 2rem;
   }
`;

export const LoginDescription = styled.p`
   font-size: 1.125rem;
   color: ${props => props.theme.colors.textSecondary};
   margin-bottom: 3rem;
   line-height: 1.7;
`;

export const LoginFeatures = styled.div`
   display: flex;
   flex-direction: column;
   gap: 1rem;
`;

export const LoginFeature = styled.div`
   display: flex;
   align-items: center;
   gap: 12px;
   color: ${props => props.theme.colors.textSecondary};
   font-size: 1rem;

   svg {
      color: ${props => props.theme.colors.success};
      flex-shrink: 0;
   }
`;

export const LoginFormContainer = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
`;

export const LoginBox = styled.div`
   background: ${props => props.theme.colors.bgSecondary};
   padding: 3rem;
   border-radius: 16px;
   border: 1px solid ${props => props.theme.colors.borderColor};
   width: 100%;
   max-width: 440px;

   @media (max-width: 640px) {
      padding: 2rem 1.5rem;
   }
`;

export const LoginHeading = styled.h2`
   font-size: 1.75rem;
   font-weight: 600;
   margin-bottom: 2rem;
   text-align: center;
`;

export const LoginForm = styled.form`
   display: flex;
   flex-direction: column;
   gap: 1.5rem;
`;

export const LoginFooter = styled.div`
   margin-top: 2rem;
   text-align: center;
   font-size: 0.875rem;
   color: ${props => props.theme.colors.textSecondary};

   a {
      color: ${props => props.theme.colors.accentPrimary};
      text-decoration: none;
      font-weight: 600;

      &:hover {
         text-decoration: underline;
      }
   }
`;

export const LoginBottomLinks = styled.div`
   display: flex;
   gap: 2rem;
   margin-top: 2rem;

   a {
      color: ${props => props.theme.colors.textTertiary};
      text-decoration: none;
      font-size: 0.875rem;
      transition: ${props => props.theme.transitions.default};

      &:hover {
         color: ${props => props.theme.colors.textSecondary};
      }
   }
`;
