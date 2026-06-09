import { createPortal } from 'react-dom';
import { ToastContainer as StyledContainer } from '../styles/ToastNotification.styles';

// added Phase 5: role="status" + aria-live="polite" so screen readers announce toasts
const ToastContainer = ({ children }) => {
   return createPortal(
      <StyledContainer role="status" aria-live="polite" aria-atomic="false">
        {children}
      </StyledContainer>,
      document.body
   );
};

export default ToastContainer;