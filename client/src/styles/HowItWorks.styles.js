import styled from 'styled-components';

export const HowItWorksSection = styled.section`
   padding: 6rem 2rem;
   background: ${props => props.theme.colors.bgPrimary};

   @media (max-width: 968px) {
      padding: 4rem 1.5rem;
   }
`;

export const Container = styled.div`
   max-width: 1200px;
   margin: 0 auto;
`;

export const SectionTitle = styled.h2`
   font-size: 2.5rem;
   font-weight: 700;
   text-align: center;
   margin-bottom: 1rem;

   @media (max-width: 640px) {
      font-size: 1.75rem;
   }
`;

export const Steps = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   gap: 2rem;
   margin-top: 4rem;
   flex-wrap: wrap;
`;

export const Step = styled.div`
   text-align: center;
   flex: 1;
   min-width: 250px;
   max-width: 300px;

   h3 {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
   }

   p {
      color: ${props => props.theme.colors.textSecondary};
   }
`;

export const StepNumber = styled.div`
   width: 64px;
   height: 64px;
   background: ${props => props.theme.colors.accentPrimary};
   border-radius: 50%;
   display: flex;
   align-items: center;
   justify-content: center;
   font-size: 1.5rem;
   font-weight: 700;
   margin: 0 auto 1.5rem;
`;

export const StepConnector = styled.div`
   width: 100px;
   height: 2px;
   background: ${props => props.theme.colors.borderColor};
   display: none;

   @media (min-width: 768px) {
      display: block;
   }
`;
