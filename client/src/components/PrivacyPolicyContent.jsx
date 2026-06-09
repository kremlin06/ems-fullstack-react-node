import { PrivacyContainer } from '../styles/PrivacyPolicyContent';

const PrivacyPolicyContent = () => {
   return (
      <PrivacyContainer> 
         <p className="policy-header">
            <strong>Event Management System (EMS) Privacy Policy</strong><br />
            <em style={{ opacity: 0.8 }}>Effective Date: May 2026</em><br />
            <small style={{ opacity: 0.7 }}>Scope: This policy applies to all users of the EMS platform (Admin, Organizer, Staff, and Attendee).</small>
         </p>

         <h4>1. Information We Collect</h4>
         <p>
            We collect only the minimal data necessary to fulfill event coordination and attendance tracking requirements:          </p>
         <ul>
            <li><strong>User Credentials:</strong> Name, email address, and securely hashed passwords</li>
            <li><strong>Campus Identity:</strong> Student ID and academic department for the purpose of the Student Directory Lookup to prevent duplicate records</li>
            <li><strong>Activity Logs:</strong> Time-stamped attendance records (Present, Late, Absent) and session participation history</li>
         </ul>

         <h4>2. How We Use Your Information</h4>
         <p>Your data is used strictly for campus-related activities:</p>
         <ul>
            <li>To generate personalized event schedules and QR codes for check-in</li>
            <li>To automate attendance capture and send instant confirmation notifications</li>
            <li>To provide administrators with aggregated participation analytics to improve campus programming</li>
         </ul>
         <h4>3. Data Protection and Security</h4>
         <p>We implement high-level technical safeguards to protect your information:</p>
         <ul>
            <li><strong>Encryption:</strong> All data transmissions are enforced via HTTPS</li>
            <li><strong>Hashing:</strong> Passwords are never stored in plain text; we utilize bcrypt for secure hashing</li>
            <li><strong>Role-Based Access Control (RBAC):</strong> Access to data is restricted based on user roles (Admin, Organizer, Staff, Attendee) via JWT (JSON Web Tokens)</li>
            <li><strong>PII Masking:</strong> Personally Identifiable Information is automatically masked in exportable CSV/PDF reports unless the user has explicit authorized export permissions</li>
         </ul>

         <h4>4. Data Sharing and Retention</h4>
         <ul>
            <li><strong>Third-Party Disclosure:</strong> Personal information is not shared with third-party entities or transferred outside the institution</li>
            <li><strong>Storage:</strong> Data is stored in a centralized, ACID-compliant PostgreSQL database to ensure integrity and recoverability</li>
            <li><strong>Retention:</strong> We retain records only as long as necessary for academic auditing and reporting purposes</li>
         </ul>

         <h4>5. Your Rights</h4>
         <p>
            Under the <strong>Philippine Data Privacy Act</strong>, users have the right to:          </p>
         <ul>
            <li>Inquire about the processing of their personal data</li>
            <li>Access and contest any inaccuracies in their records</li>
            <li>Request the removal or destruction of their data from the active system</li>
         </ul>

         <p className="footer-note">
            For questions about this policy, contact the EMS Development Team at <strong>ems-support@balagtas.sti.edu.ph</strong>
         </p>
      </PrivacyContainer>
   )
};

export default PrivacyPolicyContent;