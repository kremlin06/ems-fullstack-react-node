# ems-fullstack-react-node
A campus-scale web application designed to centralize event coordination, automate attendance tracking via QR code technology, and provide real-time participation analytics.


Campus Event Management System (EMS)

A centralized, campus-scale web application designed to transition manual event coordination into a digital ecosystem. This system automates attendance tracking via QR code technology, provides real-time participation analytics, and is optimized for high-volume campus operations.

Project Overview
This project was developed for STI College Balagtas to address the core inefficiencies of manual scheduling and paper-based attendance logging. The system is engineered to handle large-student populations, supporting bulk ingestion of up to 10,000 attendee records and returning session roster queries for 5,000+ students in under 2 seconds.

Key Objectives
*   Centralize Coordination: Synchronize multi-session events and facilitator assignments in real-time.
*   Automate Capture: Replace manual logs with QR scanning to reduce attendance errors by $\ge$ 70%.
*   Streamline Reporting: Reduce administrative reporting time by 80% through automated CSV/PDF generation.

Key Features
*   Role-Based Access Control (RBAC): Secure, stateless session management using JWT for Admin, Organizer, Staff, and Attendee roles.
*   Hierarchical Event Management: Manage parent events and child sessions without data fragmentation.
*   High-Volume Ingestion Engine: Bulk CSV/Excel upload module with server-side validation configured to catch $\ge$ 95% of malformed records before persistence.
*   Real-Time QR Attendance: Mobile-responsive scanning interface using `getUserMedia()` for instant attendance marking and status updates.
*   Automated Notifications: Immediate attendance confirmation alerts triggered for students upon successful check-in.
*   Advanced Analytics Dashboard: Real-time visualization of participation rates and session-level attendance metrics with PII masking for data protection.

Tech Stack
This system utilizes a Three-Tier Architecture with a unified JavaScript full-stack ecosystem.

*   Frontend: React.js, Vite (Build Tool), Tailwind CSS, Material UI.
*   Backend: Node.js, Express.js.
*   Database: PostgreSQL (Relational DBMS optimized with indexed queries).
*   Security: `jsonwebtoken` (JWT), `bcryptjs` (Hashing), HTTPS enforcement.
*   Libraries: `html5-qrcode` (Scanning), `papaparse` (CSV Parsing), `jspdf` (Reporting).

System Architecture
The application follows the Single Responsibility Principle and ACID-compliant database transactions:

1.  Presentation Tier: Responsive web interface for role-based dashboards and mobile scanning.
2.  Application Tier: Server-side logic for RBAC enforcement, data validation, and participation calculations.
3.  Data Tier: Centralized PostgreSQL storage for event metadata, student rosters, and time-stamped attendance logs.

Getting Started

Prerequisites
*   Node.js (v18+)
*   PostgreSQL
*   npm or pnpm

Installation
1.  Clone the repository: `git clone https://github.com/your-username/campus-event-management-system.git`
2.  Install dependencies: `npm install`
3.  Configure environment variables (`.env`) for JWT secrets and PostgreSQL credentials.
4.  Initialize the database using the provided SQL scripts in `/database`.
5.  Start the development server: `npm run dev`

The Team
*   Cabadon, Miles Derek Blanco
*   Delfin, Jhon Kenth
*   Remo, Enrico Miguel Tamayo
*   Santiago, Angelo Esuma


Developed as a System Integration Architecture, Information Management, and Software Engineering 2 Project for the Computer Science Program - January 2026.
