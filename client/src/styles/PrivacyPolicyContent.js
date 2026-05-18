import styled from 'styled-components';

/*
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

*/

export const PrivacyContainer = styled.div`
   .policy-header {
      margin-bottom: ${({ theme }) => theme.spacing.lg};
   }

   p {
      line-height: ${({ theme }) => theme.lineHeights.normal};
      color: ${({ theme }) => theme.colors.textSecondary};
      font-size: ${({ theme }) => theme.fontSizes.body};
      font-family: ${({ theme }) => theme.fonts.secondary};
   }

   h4 {
      margin-top: ${({ theme }) => theme.spacing.lg};
      margin-bottom: ${({ theme }) => theme.spacing.sm};
      color: ${({ theme }) => theme.colors.textPrimary};
      font-size: ${({ theme }) => theme.fontSizes.h4};
      font-weight: ${({ theme }) => theme.fontWeights.semibold};
   }

   ul {
      margin-bottom: ${({ theme }) => theme.spacing.lg};
      padding-left: ${({ theme }) => theme.spacing.xl};
      list-style-type: disc;
   }

   li {
      margin-bottom: ${({ theme }) => theme.spacing.xs};
      color: ${({ theme }) => theme.colors.textSecondary};
   }

   strong {
      color: ${({ theme }) => theme.colors.textPrimary};
      font-weight: ${({ theme }) => theme.fontWeights.semibold};
   }

   .footer-note {
      margin-top: ${({ theme }) => theme.spacing.xxl};
      padding-top: ${({ theme }) => theme.spacing.md};
      border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
      font-size: ${({ theme }) => theme.fontSizes.bodySm};
      color: ${({ theme }) => theme.colors.textTertiary};
   }
`;