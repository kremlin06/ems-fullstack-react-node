import styled from 'styled-components';

export const FooterSection = styled.footer`
   width: 100%;
   background: #000000;
   position: relative;
   overflow: hidden;
`;

export const FooterUpper = styled.div`
   padding: 4rem 3rem 3rem;
   max-width: 2560px;
   margin: 0 auto;

   @media (max-width: 768px) {
      padding: 3rem 1.5rem 2rem;
   }
`;

export const FooterContent = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: flex-start;
   gap: 4rem;

   @media (max-width: 768px) {
      flex-direction: column;
      gap: 2.5rem;
   }
`;

export const FooterLeft = styled.div`
   max-width: 300px;
   display: flex;
   flex-direction: column;
   gap: 1rem;
`;

export const FooterIcon = styled.div`
   display: flex;
   gap: 4px;
   margin-bottom: 0.5rem;

   span {
      width: 4px;
      height: 4px;
      background: ${props => props.theme.colors.textSecondary};
      border-radius: 50%;
      display: inline-block;
   }
`;

export const FooterDescription = styled.p`
   color: ${props => props.theme.colors.textSecondary};
   font-size: ${props => props.theme.fontSizes.body};
   line-height: ${props => props.theme.lineHeights.relaxed};
   font-weight: ${props => props.theme.fontWeights.regular};
   margin: 0;
`;

export const FooterRight = styled.div`
   display: flex;
   gap: 4rem;

   @media (max-width: 768px) {
      gap: 3rem;
      flex-wrap: wrap;
   }
`;

export const FooterColumn = styled.div`
   display: flex;
   flex-direction: column;
   gap: 0.75rem;
`;

export const ColumnTitle = styled.h4`
   color: ${props => props.theme.colors.textTertiary};
   font-size: ${props => props.theme.fontSizes.bodyXs};
   font-weight: ${props => props.theme.fontWeights.medium};
   text-transform: uppercase;
   letter-spacing: 0.05em;
   margin: 0;
   margin-bottom: 0.5rem;
`;

export const ColumnLink = styled.a`
   color: ${props => props.theme.colors.textSecondary};
   text-decoration: none;
   font-size: ${props => props.theme.fontSizes.bodySm};
   font-weight: ${props => props.theme.fontWeights.regular};
   transition: ${props => props.theme.transitions.default};

   &:hover {
      color: ${props => props.theme.colors.textPrimary};
   }
`;

export const FooterGiantText = styled.div`
   max-width: 2560px;
   margin: 0 auto;
   padding: 2rem 3rem 0;
   position: relative;

   @media (max-width: 768px) {
      padding: 2rem 1.5rem 0;
   }
`;

export const GiantEMS = styled.div`
   font-size: 18vw;
   font-weight: ${props => props.theme.fontWeights.bold};
   color: ${props => props.theme.colors.textPrimary};
   opacity: 0.15;
   line-height: 0.8;
   letter-spacing: -0.04em;
   user-select: none;
   position: relative;
   text-align: center;
   padding-bottom: 0;
   transform: translateY(0.15em);

   .copyright-symbol {
      font-size: 0.5em;
      vertical-align: super;
      margin-left: 0.2rem;
      opacity: 0.6;
   }

   @media (max-width: 1024px) {
      font-size: 20vw;
   }

   @media (max-width: 768px) {
      font-size: 24vw;
   }
`;

export const FooterBottom = styled.div`
   padding: 1.5rem 3rem;
   // border-top: 1px solid ${props => props.theme.colors.borderColor};
   text-align: center;
   color: ${props => props.theme.colors.textTertiary};
   font-size: ${props => props.theme.fontSizes.bodyXs};
   background: #000000;
   // border: 1px solid red;

   @media (max-width: 768px) {
      padding: 1.5rem 1.5rem;
   }
`;

export const ThemeToggle = styled.button`
   position: fixed;
   bottom: 2rem;
   left: 2rem;
   background: ${props => props.theme.colors.bgTertiary};
   border: 1px solid ${props => props.theme.colors.borderColor};
   border-radius: 50%;
   width: 40px;
   height: 40px;
   display: flex;
   align-items: center;
   justify-content: center;
   cursor: pointer;
   color: ${props => props.theme.colors.textSecondary};
   transition: ${props => props.theme.transitions.default};
   z-index: 100;

   &:hover {
      background: ${props => props.theme.colors.bgSecondary};
      color: ${props => props.theme.colors.textPrimary};
   }
`;

export const FooterDivider = styled.div`
   height: 1px;
   background: ${props => props.theme.colors.borderColor};
   margin: 0;
`;

export const TechStackSection = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   gap: 2rem;
   padding: 1rem 0;
   margin: 0 auto;
   max-width: 2560px;
`;

export const TechItem = styled.div`
   display: flex;
   align-items: center;
   gap: 0.5rem;
`;

export const TechLogo = styled.div`
   width: 14px;
   height: 14px;
   opacity: 0.5;
`;

export const TechLabel = styled.span`
   font-size: ${props => props.theme.fontSizes.bodyXs};
   color: ${props => props.theme.colors.textTertiary};
   font-weight: ${props => props.theme.fontWeights.regular};
   opacity: 0.6;
`;

