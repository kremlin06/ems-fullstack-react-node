import Button, { ButtonContainer } from './Button';
import { HeroSection, HeroContainer, HeroContent, HeroTitle, HeroSubtitle, HeroButtons, HeroMockup, MockupWindow, WindowHeader, WindowControls, Control, WindowTitle, WindowTime, WindowContent, MockupDashboard, MockupSidebar, SidebarItem, MockupMain, MockupHeader, MockupStats, StatCard, StatNumber, StatLabel, } from '../styles/Hero.styles';
import { Link } from 'react-router-dom';

const Hero = () => {
   return (
      <HeroSection>
         <HeroContainer>
            {/* left side: content */}
            <HeroContent>
               <HeroTitle>Event Management System</HeroTitle>
               <HeroSubtitle>
                  Streamline your campus events with our comprehensive platform for
                  event creation, attendance tracking, and real-time analytics.
               </HeroSubtitle>
               <HeroButtons>
                  <ButtonContainer>
                     <Button variant="primary" as={Link} to="/login">Get Started</Button>
                     <Button variant="secondary">Learn More</Button>
                  </ButtonContainer>
               </HeroButtons>
            </HeroContent>

            {/* right side: 3D mockup */}
            <HeroMockup>
               <MockupWindow>
                  <WindowHeader>
                     <WindowControls>
                        <Control type="close" />
                        <Control type="minimize" />
                        <Control type="maximize" />
                     </WindowControls>
                     <WindowTitle>Event Management System</WindowTitle>
                     <WindowTime>Mon May 4, 3:00 PM</WindowTime>
                  </WindowHeader>
                  <WindowContent>
                     <MockupDashboard>
                        <MockupSidebar>
                           <SidebarItem className="active">Dashboard</SidebarItem>
                           <SidebarItem>Events</SidebarItem>
                           <SidebarItem>Analytics</SidebarItem>
                           <SidebarItem>Settings</SidebarItem>
                        </MockupSidebar>
                        <MockupMain>
                           <MockupHeader>
                              <h3>Welcome Back!</h3>
                              <p>Manage your events efficiently</p>
                           </MockupHeader>
                           <MockupStats>
                              <StatCard>
                                 <StatNumber>24</StatNumber>
                                 <StatLabel>Active Events</StatLabel>
                              </StatCard>
                              <StatCard>
                                 <StatNumber>1.2k</StatNumber>
                                 <StatLabel>Total Attendees</StatLabel>
                              </StatCard>
                              <StatCard>
                                 <StatNumber>98%</StatNumber>
                                 <StatLabel>Satisfaction</StatLabel>
                              </StatCard>
                           </MockupStats>
                        </MockupMain>
                     </MockupDashboard>
                  </WindowContent>
               </MockupWindow>
            </HeroMockup>
         </HeroContainer>
      </HeroSection>
   );
};

export default Hero;