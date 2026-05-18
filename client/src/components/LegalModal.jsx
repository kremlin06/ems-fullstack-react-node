import { ModalOverlay, ModalContent, ModalClose, ModalTitle, ModalBody } from '../styles/Modal.styles';
import TermsOfServiceContent from './TermsOfServiceContent';
import PrivacyPolicyContent from './PrivacyPolicyContent';

/*
this modal handles BOTH terms of service and privacy policy
because we're not creating two separate modals for no reason
type prop determines which content to show: 'terms' or 'privacy'
*/

const LegalModal = ({ type, onClose }) => {
  // validate type prop, fail loudly if someone passes garbage
  if (!['terms', 'privacy'].includes(type)) {
    console.error(`LegalModal: invalid type "${type}". use 'terms' or 'privacy'.`);
    return null;
  }

  const title = type === 'terms' ? 'Terms of Service' : 'Privacy Policy';
  const ContentComponent = type === 'terms' ? TermsOfServiceContent : PrivacyPolicyContent;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalClose onClick={onClose} aria-label="Close modal">&times;</ModalClose>
        <ModalTitle>{title}</ModalTitle>
        <ModalBody>
          <ContentComponent />
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LegalModal;