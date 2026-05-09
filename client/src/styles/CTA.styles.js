import styled from 'styled-components';

export const CTASection = styled.section`
   padding: 6rem 2rem;
   background: ${props => props.theme.colors.bgSecondary};
   text-align: center;
   border-top: 1px solid ${props => props.theme.colors.borderColor};

   @media (max-width: 968px) {
      padding: 4rem 1.5rem;
   }

   h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;

      @media (max-width: 640px) {
         font-size: 1.75rem;
      }
   }

   p {
      font-size: 1.25rem;
      color: ${props => props.theme.colors.textSecondary};
      margin-bottom: 2rem;
   }
`;

export const Container = styled.div`
   max-width: 1200px;
   margin: 0 auto;
`;
