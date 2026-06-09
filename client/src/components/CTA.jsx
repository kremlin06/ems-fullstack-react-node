import { Link } from 'react-router-dom';
import Button from './Button';
import { CTASection, Container } from '../styles/CTA.styles';

const CTA = () => {
   return (
      <CTASection>
         <Container>
            <h2>Ready to get started?</h2>
            <p>Join thousands of organizations managing events with EMS</p>
            <Button as={Link} to="/signup" variant="primary">
               Create Free Account
            </Button>
         </Container>
      </CTASection>
   );
};

export default CTA;
