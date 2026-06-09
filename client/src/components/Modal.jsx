// shared modal shell used by Privacy Policy, Terms, Manifesto, Careers, Help.
//
// a11y notes (WCAG 2.1 AA):
//   - role="dialog" + aria-modal="true" tells screen readers this is a modal
//     and that content behind it should be ignored.
//   - aria-labelledby links the dialog to its visible title so screen readers
//     announce "Terms of Service, dialog" when it opens — not just "dialog".
//   - focus is moved TO the close button when the modal opens, and BACK to the
//     element that triggered the modal when it closes (focus restoration).
//   - Tab key is trapped inside the modal so keyboard users can't accidentally
//     reach background content while the overlay is open.
//   - Escape closes the modal (standard pattern — same as native <dialog>).
//   - ModalOverlay uses aria-hidden="true" on the backdrop so its click handler
//     doesn't confuse screen readers with a duplicate interactive area.

import { useEffect, useRef } from 'react';
import { ModalOverlay, ModalContent, ModalClose, ModalTitle, ModalBody } from '../styles/Modal.styles';

// generateId() creates a unique id string we can use for aria-labelledby.
// Math.random().toString(36) gives something like "0.4fzyo82mvyr".
// .slice(2) cuts off the "0." prefix, leaving "4fzyo82mvyr".
// this way every open modal has its own unique title id, even if two modals
// were somehow open at the same time.
let _counter = 0;
const generateId = () => `modal-title-${++_counter}`;

const Modal = ({ isOpen, onClose, title, children }) => {
   // contentRef points to the <ModalContent> div so we can query focusable
   // elements inside it for the focus trap.
   const contentRef = useRef(null);

   // closeRef points to the × close button so we can move focus to it
   // the moment the modal opens (first interactive element, standard pattern).
   const closeRef = useRef(null);

   // triggerRef stores the element that was focused BEFORE the modal opened.
   // when the modal closes, we restore focus back to it so the keyboard user
   // doesn't lose their position on the page.
   // useRef() here stores a mutable value that doesn't trigger a re-render.
   const triggerRef = useRef(null);

   // a stable title id we use for aria-labelledby.
   // useRef keeps the same id across re-renders (unlike useState which would
   // cause extra renders, or a plain variable which would change each render).
   const titleId = useRef(generateId());

   useEffect(() => {
      if (!isOpen) return;

      // save the currently focused element so we can restore focus later.
      // document.activeElement is always the element that has keyboard focus.
      triggerRef.current = document.activeElement;

      // move focus into the modal — to the close button, which is the first
      // interactive element. we use setTimeout to wait one tick so the
      // element is fully rendered before we try to focus it.
      // (without the timeout, the element may not be in the DOM yet.)
      const focusTimer = setTimeout(() => {
         closeRef.current?.focus();
      }, 0);

      // focus trap
      // when Tab or Shift+Tab is pressed inside the modal, we intercept it and
      // wrap focus back to the first or last focusable element instead of
      // letting it escape to the background page.
      const handleKeyDown = (e) => {
         if (e.key === 'Escape') {
            // Escape key — standard way to dismiss a modal (WCAG 2.1 SC 3.2.5)
            onClose();
            return;
         }

         if (e.key !== 'Tab') return;

         // querySelectorAll finds every element inside the modal that can receive
         // keyboard focus. the selector covers buttons, links, inputs, selects,
         // textareas, and anything with tabindex="0".
         const focusable = Array.from(
            contentRef.current?.querySelectorAll(
               'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            ) ?? []
         );

         if (focusable.length === 0) return;

         const first = focusable[0];
         const last  = focusable[focusable.length - 1];

         if (e.shiftKey) {
            // Shift+Tab: going backwards — if we're at the first element,
            // wrap around to the last so focus stays inside the modal.
            if (document.activeElement === first) {
               e.preventDefault();
               last.focus();
            }
         } else {
            // Tab: going forwards — if we're at the last element,
            // wrap around to the first.
            if (document.activeElement === last) {
               e.preventDefault();
               first.focus();
            }
         }
      };

      // lock background scroll while modal is open
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);

      // cleanup: runs when the modal closes (isOpen flips to false)
      return () => {
         clearTimeout(focusTimer);
         document.removeEventListener('keydown', handleKeyDown);
         document.body.style.overflow = 'unset';

         // restore focus to the element that opened the modal.
         // without this, keyboard focus is lost after the modal closes and the
         // screen reader user has no idea where they are on the page.
         // optional chaining (?.) prevents crashes if the element was removed.
         triggerRef.current?.focus();
      };
   }, [isOpen, onClose]);

   // overlay click: only close if the user clicked the dark backdrop itself,
   // not something inside the modal card.
   const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget) onClose();
   };

   if (!isOpen) return null;

   return (
      // aria-hidden="true" on the overlay div prevents screen readers from
      // reading the backdrop click target as a separate interactive element.
      // role="dialog" and aria-modal live on ModalContent, not the overlay.
      <ModalOverlay onClick={handleOverlayClick} aria-hidden="true">

         {/* ModalContent is the actual dialog card — this is what gets announced.
             role="dialog"        — tells screen readers this is a dialog overlay.
             aria-modal="true"   — tells them to ignore content outside it.
             aria-labelledby     — links to the <ModalTitle> so the dialog is
                                   announced as "Terms of Service, dialog" etc.
             onClick stop-prop   — prevents overlay's click from firing when
                                   clicking inside the card. */}
         <ModalContent
            ref={contentRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId.current}
            onClick={(e) => e.stopPropagation()}
         >
            {/* the × button — first to receive focus when the modal opens */}
            <ModalClose
               ref={closeRef}
               onClick={onClose}
               aria-label="Close modal"
            >
               &times;
            </ModalClose>

            {/* id must match aria-labelledby above so the dialog has an
                accessible name that screen readers announce on open */}
            <ModalTitle id={titleId.current}>{title}</ModalTitle>
            <ModalBody>{children}</ModalBody>
         </ModalContent>
      </ModalOverlay>
   );
};

export default Modal;
