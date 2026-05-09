import styled from 'styled-components';

export const ModalOverlay = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background: rgba(0, 0, 0, 0.6);
   backdrop-filter: blur(8px);
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 2000;
   padding: 20px;
   animation: fadeIn 0.2s ease;

   @keyframes fadeIn {
      from {
         opacity: 0;
      }
      to {
         opacity: 1;
      }
   }
   `;

export const ModalContent = styled.div`
   background: ${props => props.theme.colors.cardBg};
   border-radius: ${props => props.theme.borderRadius.xl};
   max-width: 680px;
   width: 100%;
   max-height: 85vh;
   overflow-y: auto;
   padding: 32px;
   position: relative;
   box-shadow: ${props => props.theme.colors.shadowLg};
   animation: slideUp 0.3s ease;

   @keyframes slideUp {
      from {
         opacity: 0;
         transform: translateY(20px);
      }
      to {
         opacity: 1;
         transform: translateY(0);
      }
   }

   @media (max-width: ${props => props.theme.breakpoints.sm}) {
      padding: 24px 20px;
      border-radius: ${props => props.theme.borderRadius.lg};
   }
   `;

export const ModalClose = styled.button`
   position: absolute;
   top: 16px;
   right: 16px;
   width: 32px;
   height: 32px;
   border-radius: ${props => props.theme.borderRadius.full};
   background: ${props => props.theme.colors.bgTertiary};
   border: none;
   display: flex;
   align-items: center;
   justify-content: center;
   cursor: pointer;
   font-size: 20px;
   color: ${props => props.theme.colors.textSecondary};
   transition: ${props => props.theme.transitions.fast};

   &:hover {
      background: ${props => props.theme.colors.borderColor};
      color: ${props => props.theme.colors.textPrimary};
   }
   `;

export const ModalTitle = styled.h3`
   font-size: 1.5rem;
   font-weight: ${props => props.theme.fontWeights.semibold};
   margin: 0 0 16px 0;
   color: ${props => props.theme.colors.textPrimary};
   padding-right: 40px;
   `;

export const ModalBody = styled.div`
   font-size: 1rem;
   line-height: ${props => props.theme.lineHeights.relaxed};
   color: ${props => props.theme.colors.textSecondary};

   h4 {
      color: ${props => props.theme.colors.textPrimary};
      font-size: 1.1rem;
      font-weight: ${props => props.theme.fontWeights.semibold};
      margin: 24px 0 8px 0;
   }

   p {
      margin: 0 0 12px 0;
   }

   ul,
   ol {
      margin: 12px 0;
      padding-left: 20px;
   }

   li {
      margin: 4px 0;
   }

   strong {
      color: ${props => props.theme.colors.textPrimary};
      font-weight: ${props => props.theme.fontWeights.semibold};
   }

   .footer-note {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid ${props => props.theme.colors.borderColor};
      font-size: 0.875rem;
      opacity: 0.8;
   }
`;
