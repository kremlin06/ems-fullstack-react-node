import { FooterSection, FooterUpper, FooterContent, FooterLeft, FooterIcon, FooterDescription, FooterRight, FooterColumn, ColumnTitle, ColumnLink, FooterGiantText, GiantEMS, FooterBottom, ThemeToggle, } from '../styles/Footer.styles';
import { MoonSVG } from './SVGs';
import { useState } from 'react';
import Modal from './Modal';
import PrivacyPolicyContent from './PrivacyPolicyContent';
import TermsOfServiceContent from './TermsOfServiceContent';
import TechBadges from './TechBadges';


const Footer = () => {
   const [activeModal, setActiveModal] = useState(null);

   const handleThemeToggle = () => {
      // theme logic here
      console.log('Theme toggled clicked.');
   }

   const toggleModal = (type) => (e) => {
      e.preventDefault();
      // setActiveModal(!activeModal === type ? null : type);
      setActiveModal(prev => prev === type ? null : type);
   };

   const closeModal = () => setActiveModal(null);

      // if (type === "manifesto") {
      //    alert("EMS Manifesto: Centralization, Integrity, and Speed. Built for STI College Balagtas.");
      // } else if (type === "careers") {
      //    alert("EMS Careers: Apply to be a Student Facilitator or Volunteer. Build your resume with real-world campus coordination!")
      // }

   const manifestoModal = (
      <>
         <p><strong>The EMS Manifesto: The Digital Standard for Campus Coordination</strong></p>
         
         <h4>1. Centralization over Chaos</h4>
         <p>We believe event coordination shouldn't live in scattered spreadsheets or messaging apps. EMS is the <strong>"Single Source of Truth,"</strong> synchronizing multi-session events and facilitator assignments in real-time to eliminate scheduling confusion.</p>
         
         <h4>2. Integrity by Design</h4>
         <p>Manual encoding is the enemy of accuracy. We stand for <strong>Data Integrity</strong>, utilizing server-side validation engines to catch ≥95% of malformed records before they ever reach our database. No more misspelled names; no more duplicate entries.</p>
         
         <h4>3. Frictionless Attendance</h4>
         <p>Paper logs belong in the past. By integrating QR code technology, we aim to reduce attendance errors by at least 70%, providing students with instant confirmation and staff with a live, mobile-responsive tracking feed.</p>
         
         <h4>4. Privacy as a Priority</h4>
         <p>Student data is sacred. Our architecture enforces <strong>Role-Based Access Control (RBAC)</strong> and PII masking to ensure that sensitive information is only seen by those with the right credentials.</p>
         
         <h4>5. Speed for Decision Makers</h4>
         <p>Reporting should take seconds, not hours. We empower administrators with real-time participation analytics and automated CSV/PDF exports, reducing administrative reporting time by 80%.</p>
         
         <p className="footer-note">
            Developed with precision as a System Integration Architecture, Information Management, and Software Engineering 2 Project for the Computer Science Program – May 2026
         </p>
      </>
   );

   const careersModal = (
      <>
          <p><strong>The EMS Careers Vision: "Join the Coordination Team"</strong></p>
         <p style={{ marginBottom: '20px' }}><em>Explore Opportunities with EMS</em></p>
         
         <h4>1. Student Facilitators</h4>
         <p>Are you ready to lead? We are looking for student leaders to manage session logistics, coordinate with organizers, and facilitate real-time attendance tracking for major campus events.</p>
         
         <h4>2. Technical Staff & Volunteers</h4>
         <p>Gain hands-on experience in <strong>"high-traffic" operations</strong>. Help us manage the digital ecosystem by operating our QR scanning modules and providing on-the-ground support for faculty and attendees.</p>
         
         <h4>3. Administrative Support</h4>
         <p>Learn the art of data-driven decision-making. Work with the Organizer role to manage bulk attendee uploads and ensure that campus rosters are 95% error-free.</p>
         
         <h4 style={{ marginTop: '24px' }}>Why Join?</h4>
         <ul>
            <li><strong>Skill Integration:</strong> Apply what you've learned in your ICT or Computer Science program to a real-world, campus-scale system</li>
            <li><strong>Certification:</strong> Get recognized for your contributions as an "EMS Certified Facilitator"</li>
            <li><strong>Professional Exposure:</strong> Network with department heads, faculty, and student organizations while managing the campus's digital pulse</li>
         </ul>
      </>
   )

   return (
      <FooterSection id="footer-manifesto">
         <FooterUpper>
            <FooterContent>
               <FooterLeft>
                  <FooterIcon >
                     {[...Array(4)].map((_, i) => (
                        <span key={i} />
                     ))}
                  </FooterIcon>
                  <FooterDescription>
                     EMS is the platform<br />
                     you've been searching for.
                  </FooterDescription>
               </FooterLeft>

               <FooterRight>
                  <FooterColumn>
                     <ColumnTitle>Useful</ColumnTitle>
                     <ColumnLink href="#manifesto" onClick={toggleModal('manifesto')}>Manifesto</ColumnLink>
                     <ColumnLink href="#careers" onClick={toggleModal('careers')}>Careers</ColumnLink>
                  </FooterColumn>

                  <FooterColumn>
                     <ColumnTitle>Legal</ColumnTitle>
                     <ColumnLink href="#privacy" onClick={toggleModal('privacy')}>Privacy Policy</ColumnLink>
                     <ColumnLink href="#terms" onClick={toggleModal('terms')}>Terms & Conditions</ColumnLink>
                  </FooterColumn>

                  <FooterColumn>
                     <ColumnTitle>Updates</ColumnTitle>
                     <ColumnLink href="#twitter">Twitter</ColumnLink>
                     <ColumnLink href="https://www.instagram.com/kremkremmmm/?hl=en">Instagram</ColumnLink>
                  </FooterColumn>
               </FooterRight>
            </FooterContent>
         </FooterUpper>
         
         <TechBadges />

         <FooterBottom>
            <p>© 2026 Event Management System. All rights reserved.</p>
            <small style={{ opacity: 0.6 }}>BSCS System Integration & Software Engineering 2 Project</small>
         </FooterBottom>

         <FooterGiantText>
            <GiantEMS>
               EMS<span className="copyright-symbol">©</span>
            </GiantEMS>
         </FooterGiantText>
   
         <ThemeToggle onClick={handleThemeToggle}>
            <MoonSVG />
         </ThemeToggle>

         <Modal isOpen={activeModal === 'manifesto'} onClose={closeModal} title="EMS Manifesto">
            {manifestoModal}
         </Modal>
         
         <Modal isOpen={activeModal === 'careers'} onClose={closeModal} title="Join the EMS Team">
            {careersModal}
         </Modal>

         <Modal isOpen={activeModal === 'privacy'} onClose={closeModal} title="Privacy Policy">
            <PrivacyPolicyContent />
         </Modal>

         <Modal isOpen={activeModal === 'terms'} onClose={closeModal} title="Terms and Conditions">
            <TermsOfServiceContent />
         </Modal>

      </FooterSection>
   );
};

export default Footer;
