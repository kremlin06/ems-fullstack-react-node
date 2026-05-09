import styled from 'styled-components';

export const PrivacyContainer = styled.div`
   .policy-header {
      margin-bottom: 1.5rem;
   }

   p {
      line-height: 1.6;
      color: ${({ theme }) => theme.text}; // Optional: uses your theme
   }

   h4 {
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: ${({ theme }) => theme.primary};
   }

   ul {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;
   }

   li {
      margin-bottom: 0.5rem;
   }

   .footer-note {
      margin-top: 3rem;
      padding-top: 1rem;
      border-top: 1px solid #d2d2d7;
   }
`;