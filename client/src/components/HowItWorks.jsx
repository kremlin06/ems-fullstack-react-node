import { HowItWorksSection, Container, SectionTitle, Steps, Step, StepNumber, StepConnector, } from '../styles/HowItWorks.styles';

const HowItWorks = () => {
   return (
      <HowItWorksSection id="how-it-works">
      <Container>
         <SectionTitle>How it works</SectionTitle>
         <Steps>
            <Step>
               <StepNumber>1</StepNumber>
               <h3>Create Account</h3>
               <p>Sign up in seconds. No credit card required.</p>
            </Step>
            <StepConnector />
            <Step>
               <StepNumber>2</StepNumber>
               <h3>Set Up Events</h3>
               <p>Create your first event with our intuitive interface.</p>
            </Step>
            <StepConnector />
            <Step>
               <StepNumber>3</StepNumber>
               <h3>Track & Analyze</h3>
               <p>Monitor attendance and gain valuable insights.</p>
            </Step>
         </Steps>
      </Container>
   </HowItWorksSection>
  );
};

export default HowItWorks;
