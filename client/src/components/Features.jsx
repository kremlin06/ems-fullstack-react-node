import { FeaturesSection, Container, SectionTitle, SectionSubtitle, FeaturesGrid, FeatureCard, FeatureIcon, } from '../styles/Features.styles';

const features = [
   {
      title: 'Event Scheduling',
      description: 'Create and manage events with ease. Set dates, times, and locations effortlessly.',
      icon: 'calendar',
   },
   {
      title: 'Attendance Tracking',
      description: 'Real-time attendance monitoring with QR code check-ins and automated reports.',
      icon: 'users',
   },
   {
      title: 'Analytics Dashboard',
      description: 'Gain insights with detailed analytics and visualizations of event performance.',
      icon: 'chart',
   },
   {
      title: 'Notifications',
      description: 'Automated reminders and updates to keep attendees informed and engaged.',
      icon: 'bell',
   },
   {
      title: 'Secure Platform',
      description: 'Enterprise-grade security to protect your data and privacy.',
      icon: 'shield',
   },
   {
      title: 'Global Access',
      description: 'Access your events from anywhere, anytime on any device.',
      icon: 'globe',
   },
];

const IconComponent = ({ type }) => {
   const icons = {
      calendar: (
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
         <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
         <line x1="16" y1="2" x2="16" y2="6"></line>
         <line x1="8" y1="2" x2="8" y2="6"></line>
         <line x1="3" y1="10" x2="21" y2="10"></line>
         </svg>
      ),
      users: (
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
         <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
         <circle cx="9" cy="7" r="4"></circle>
         <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
         <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
         </svg>
      ),
      chart: (
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
         <line x1="18" y1="20" x2="18" y2="10"></line>
         <line x1="12" y1="20" x2="12" y2="4"></line>
         <line x1="6" y1="20" x2="6" y2="14"></line>
         </svg>
      ),
      bell: (
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
         <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
         </svg>
      ),
      shield: (
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
         </svg>
      ),
      globe: (
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
         <circle cx="12" cy="12" r="10"></circle>
         <line x1="2" y1="12" x2="22" y2="12"></line>
         <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
         </svg>
      ),
   };
   return icons[type] || null;
};

const Features = () => {
   return (
      <FeaturesSection id="features">
         <Container>
         <SectionTitle>Everything you need to manage events</SectionTitle>
         <SectionSubtitle>Powerful features to simplify event management</SectionSubtitle>

         <FeaturesGrid>
            {features.map((feature, index) => (
               <FeatureCard key={index}>
               <FeatureIcon>
                  <IconComponent type={feature.icon} />
               </FeatureIcon>
               <h3>{feature.title}</h3>
               <p>{feature.description}</p>
               </FeatureCard>
            ))}
         </FeaturesGrid>
         </Container>
      </FeaturesSection>
   );
};

export default Features;
