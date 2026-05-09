import { useEffect } from 'react';
import { ModalOverlay, ModalContent, ModalClose, ModalTitle, ModalBody, } from '../styles/Modal.styles';

const Modal = ({ isOpen, onClose, title, children }) => {
   // this effect runs every time the 'isOpen' state changes
   useEffect(() => {
      // function to close the modal if the user presses the 'Escape' key
      const handleEscape = (e) => {
         if (e.key === 'Escape') onClose();
      };

      // if the modal is open, start watching for keys and lock the page scroll
      if (isOpen) {
         document.addEventListener('keydown', handleEscape);
         // fixes the background so the user can't scroll the main page while the modal is up
         document.body.style.overflow = 'hidden'; // prevent background scrolling
      }

      // this is the cleanup function that runs when the component unmounts (closes)
      return () => {
         // stop listening for the 'Escape' key so it doesn't try to run code that isn't there anymore
         document.removeEventListener('keydown', handleEscape);
         
         // put the scrollbar back to normal so the rest of the page isn't stuck/frozen
         document.body.style.overflow = 'unset';
      };
   }, [isOpen, onClose]); // onlyyyy re-run this if 'isOpen' changes

   // this makes sure the modal only closes if you click the dark background, 
   // not if you click inside the actual modal content box  
   const handleOverlayClick = (e) => {

      // target is what you clicked; currentTarget is what holds the click event (the overlay)
      // If they are the same, it means you clicked the "empty space" outside the modal
      if (e.target === e.currentTarget) onClose();
   };

   if (!isOpen) return null;

   return (
      <ModalOverlay onClick={handleOverlayClick}>
         <ModalContent>
         <ModalClose onClick={onClose} aria-label="Close modal">
            ×
         </ModalClose>
         <ModalTitle>{title}</ModalTitle>
         <ModalBody>{children}</ModalBody>
         </ModalContent>
      </ModalOverlay>
   );
};

export default Modal;
