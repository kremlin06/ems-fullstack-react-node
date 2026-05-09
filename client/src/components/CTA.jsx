import Button from './Button';
import { CTASection, Container } from '../styles/CTA.styles';

const CTA = () => {
   return (
      <CTASection>
         <Container>
         <h2>Ready to get started?</h2>
         <p>Join thousands of organizations managing events with EMS</p>
         <Button variant="primary">Create Free Account</Button>
         </Container>
      </CTASection>
   );
};

export default CTA;
