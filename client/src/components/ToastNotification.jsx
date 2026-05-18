import { AlertCircleSVG, CloseSVG } from './SVGs';
import { Toast, ToastMessage, ToastClose } from '../styles/ToastNotification.styles';
import { useEffect } from 'react';

const ToastNotification = ({ message, type = 'error', duration = 4000, onClose, isClosing }) => {
   
   useEffect(() => {
      if (duration) {
         const timer = setTimeout(() => {
            onClose?.();
         }, duration);
         return () => clearTimeout(timer);
      }
   }, [duration, onClose]);

   return (
      <Toast $type={type} $isClosing={isClosing}>
         <AlertCircleSVG /> 
         <ToastMessage>{message}</ToastMessage>
         <ToastClose onClick={onClose} aria-label="Close notification">
            <CloseSVG />
         </ToastClose>
      </Toast>
   );
};

export default ToastNotification;