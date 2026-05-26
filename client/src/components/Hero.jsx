import Button, { ButtonContainer } from './Button';
import { HeroSection, HeroContainer, HeroContent, HeroTitle, HeroSubtitle, HeroButtons, HeroMockup, MockupWindow, WindowHeader, WindowControls, Control, WindowTitle, WindowTime, WindowContent, MockupDashboard, MockupSidebar, SidebarItem, MockupMain, MockupHeader, MockupStats, StatCard, StatNumber, StatLabel, } from '../styles/Hero.styles';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Hero = () => {
   const [currentTime, setCurrentTime] = useState('');

   useEffect(() => {
      const updateTime = () => {
         const now = new Date();

         const day = now.toLocaleDateString('en-US', { weekday: 'short' });
         const month = now.toLocaleDateString('en-US', { month: 'short' });
         const date = now.getDate();
         const time = now.toLocaleDateString('en-US', { hour: 'numeric', minute: '2-digit' });

         setCurrentTime(`${day} ${month} ${date}, ${time}`);
      };

      updateTime(); // Set immediately on mount
      const intervalId = setInterval(updateTime, 1000); // Update every second

      return () => clearInterval(intervalId); // Cleanup on unmount
   }, []);

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
                     <WindowTime>{currentTime}</WindowTime>
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