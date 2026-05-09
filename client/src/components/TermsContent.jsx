const TermsContent = () => {
   return (
      <>
         <p style={{ marginBottom: '20px' }}>
            <strong>Event Management System (EMS) Terms and Conditions</strong><br />
            <em style={{ opacity: 0.8 }}>Effective Date: May 2026</em><br />
            <small style={{ opacity: 0.7 }}>Institution: STI College Balagtas</small>
         </p>

         <h4>1. Acceptance of Terms</h4>
         <p>
            By accessing or using the EMS, you agree to comply with these Terms and Conditions and the existing digital usage policies of the institution. This system is provided as a tool for campus event coordination and attendance tracking.
         </p>

         <h4>2. User Accounts and Security</h4>
         <ul>
            <li>
               <strong>Role-Based Access:</strong> Access is granted based on specific roles (Admin, Organizer, Staff, Attendee). Users must not attempt to bypass role-restricted modules.
            </li>
            <li>
               <strong>Credential Protection:</strong> Users are responsible for maintaining the confidentiality of their login credentials. Authentication is enforced via JWT (JSON Web Tokens); sharing session tokens is strictly prohibited.
            </li>
         </ul>

         <h4>3. Data Integrity and Submission</h4>
         <ul>
            <li>
               <strong>Accuracy of Information:</strong> Administrators and Organizers providing bulk attendee data (up to 10,000 records) are responsible for the accuracy of the CSV/Excel files.
            </li>
            <li>
               <strong>Validation:</strong> The system utilizes server-side validation to catch ≥95% of malformed records. Users must resolve flagged errors before data persistence is allowed.
            </li>
         </ul>

         <h4>4. Attendance Tracking and QR Technology</h4>
         <ul>
            <li>
               <strong>Capture Method:</strong> Attendance is recorded via real-time QR scanning or manual marks (Present, Late, Absent).
            </li>
            <li>
               <strong>Device Dependency:</strong> Automated logging is reliant on scanning devices and stable internet connectivity. Staff must utilize the manual override if technical issues occur during a session.
            </li>
            <li>
               <strong>Notifications:</strong> Attendees will receive instant confirmation upon a successful scan. It is the attendee's responsibility to verify receipt of this notification.
            </li>
         </ul>

         <h4>5. System Limitations (Phase 1 Scope)</h4>
         <p>
            Users acknowledge that as a Phase 1 MVP, the system does not currently support:
         </p>
         <ul>
            <li>Financial transactions or paid ticketing</li>
            <li>Advanced predictive analytics or AI-based modeling</li>
            <li>Native mobile applications (iOS/Android)</li>
         </ul>

         <h4>6. Intellectual Property</h4>
         <p>
            The software architecture, including the Three-Tier Design and specific logic modules, is the property of the development team as part of the Computer Science Program requirements.
         </p>

         <p className="footer-note">
            For questions about these terms, contact the EMS Development Team at <strong>ems-support@sti-balagtas.edu.ph</strong>
         </p>
      </>
   );
};

export default TermsContent;