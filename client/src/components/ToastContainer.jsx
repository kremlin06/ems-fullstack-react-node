import { createPortal } from 'react-dom';
import { ToastContainer as StyledContainer } from '../styles/ToastNotification.styles';

const ToastContainer = ({ children }) => {
   return createPortal(
      <StyledContainer>{children}</StyledContainer>,
      document.body
   );
};

export default ToastContainer;