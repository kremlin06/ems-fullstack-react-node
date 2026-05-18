import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
   from { opacity: 0; transform: translateX(100%); }
   to { opacity: 1; transform: translateX(0); }
`;

const slideOut = keyframes`
   from { opacity: 1; transform: translateX(0); }
   to { opacity: 0; transform: translateX(100%); }
`;

// Move this to your App.jsx or a global layout if you want toasts to stack!
export const ToastContainer = styled.div`
   position: fixed;
   top: 20px;
   right: 20px;
   z-index: 9999;
   display: flex;
   flex-direction: column;
   gap: 12px;
   pointer-events: none;
`;

export const Toast = styled.div`
   ${props => {
      const colors = {
         error: { bg: props.theme.colors.errorBg, color: props.theme.colors.error, border: props.theme.colors.error },
         success: { bg: props.theme.colors.successBg, color: props.theme.colors.success, border: props.theme.colors.success },
         warning: { bg: props.theme.colors.warningBg, color: props.theme.colors.warning, border: props.theme.colors.warning },
         info: { bg: props.theme.colors.infoBg, color: props.theme.colors.info, border: props.theme.colors.info },
      };
      const typeColors = colors[props.$type] || colors.error;
      return `
         background: ${typeColors.bg};
         color: ${typeColors.color};
         border-left: 4px solid ${typeColors.border};
      `;
   }}
   padding: 1rem 1.5rem;
   border-radius: 8px;
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
   display: flex;
   align-items: center;
   gap: 12px;
   min-width: 280px;
   max-width: 400px;
   pointer-events: auto;
   
   /* We use the 'isClosing' prop to switch animations */
   animation: ${props => props.$isClosing ? slideOut : slideIn} 0.3s ease forwards;

   svg {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
   }
`;

export const ToastMessage = styled.span`
   font-size: 0.95rem;
   font-weight: 500;
   flex: 1;
`;

export const ToastClose = styled.button`
   background: none;
   border: none;
   color: inherit;
   cursor: pointer;
   padding: 4px;
   opacity: 0.7;
   transition: opacity 0.2s ease;
   
   &:hover { opacity: 1; }
`;