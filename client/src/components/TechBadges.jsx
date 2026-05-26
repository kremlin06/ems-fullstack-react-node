import { TechStackSection, TechItem, TechLogo, TechLabel } from '../styles/Footer.styles';
import reactLogo from '../assets/react.svg';
import viteLogo from '../assets/vite.svg';

const TechBadges = () => {
   return (
      <TechStackSection>
         <TechItem>
            <TechLogo src={reactLogo} alt="React" />
            <TechLabel>Built with React</TechLabel>
         </TechItem>
         
         <TechItem>
            <TechLogo src={viteLogo} alt="Vite" />
            <TechLabel>Powered by Vite</TechLabel>
         </TechItem>
      </TechStackSection>
   );
};

export default TechBadges;