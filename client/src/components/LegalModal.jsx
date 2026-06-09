import { useEffect } from 'react';
import { ModalOverlay, ModalContent, ModalClose, ModalTitle, ModalBody } from '../styles/Modal.styles';
import TermsOfServiceContent from './TermsOfServiceContent';
import PrivacyPolicyContent from './PrivacyPolicyContent';

/*
this modal handles BOTH terms of service and privacy policy
because we're not creating two separate modals for no reason
type prop determines which content to show: 'terms' or 'privacy'
*/

const LegalModal = ({ type, onClose }) => {
  // close on escape and lock background scroll — must be called before any early returns
  // so hooks are always called in the same order (rules of hooks)
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // validate type prop after the hook — fail loudly if someone passes garbage
  if (!['terms', 'privacy'].includes(type)) {
    console.error(`LegalModal: invalid type "${type}". use 'terms' or 'privacy'.`);
    return null;
  }

  const title = type === 'terms' ? 'Terms of Service' : 'Privacy Policy';
  const ContentComponent = type === 'terms' ? TermsOfServiceContent : PrivacyPolicyContent;

  return (
    <ModalOverlay
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalClose onClick={onClose} aria-label={`Close ${title} modal`}>&times;</ModalClose>
        <ModalTitle id="legal-modal-title">{title}</ModalTitle>
        <ModalBody>
          <ContentComponent />
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LegalModal;