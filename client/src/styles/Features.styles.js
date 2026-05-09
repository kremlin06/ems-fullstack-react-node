import styled from 'styled-components';

export const FeaturesSection = styled.section`
   width: 100%;
   padding: 6rem 2rem;
   background: ${props => props.theme.colors.bgSecondary};

   @media (max-width: 968px) {
      padding: 4rem 1.5rem;
   }
`;

export const Container = styled.div`
   max-width: 2560px;
   margin: 0 auto;
   padding: 0 3rem;
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

export const SectionSubtitle = styled.p`
   font-size: 1.125rem;
   color: ${props => props.theme.colors.textSecondary};
   text-align: center;
   margin-bottom: 4rem;
`;

export const FeaturesGrid = styled.div`
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
   gap: 2rem;
`;

export const FeatureCard = styled.div`
   background: ${props => props.theme.colors.bgTertiary};
   padding: 2rem;
   border-radius: 12px;
   border: 1px solid ${props => props.theme.colors.borderColor};
   transition: ${props => props.theme.transitions.default};

   &:hover {
      transform: translateY(-5px);
      border-color: ${props => props.theme.colors.accentPrimary};
      box-shadow: 0 20px 40px rgba(59, 130, 246, 0.1);
   }

   h3 {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
   }

   p {
      color: ${props => props.theme.colors.textSecondary};
      line-height: 1.7;
   }
`;

export const FeatureIcon = styled.div`
   width: 48px;
   height: 48px;
   background: ${props => props.theme.colors.accentPrimary};
   border-radius: 10px;
   display: flex;
   align-items: center;
   justify-content: center;
   margin-bottom: 1.5rem;
   color: white;
`;
