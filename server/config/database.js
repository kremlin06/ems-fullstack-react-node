// PostgreSQL connection here 
-- EVENT MANAGEMENT SYSTEM DATABASE SCHEMA
-- 1. USER TABLE (D1)
-- Stores authentication data & enforces RBAC at the DB level
CREATE TABLE "User" (
    UserID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    HashedPassword VARCHAR(100) NOT NULL,
    Role VARCHAR(15) NOT NULL CHECK (Role IN ('Admin', 'Organizer', 'Staff', 'Attendee')),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ATTENDEE TABLE (D3)
CREATE TABLE Attendee (
    AttendeeID SERIAL PRIMARY KEY,
    UserID INT UNIQUE NOT NULL REFERENCES "User"(UserID) ON DELETE CASCADE,
    StudentID VARCHAR(20) UNIQUE,
    DepartmentID VARCHAR(50),
    CONSTRAINT fk_attendee_user FOREIGN KEY (UserID) REFERENCES "User"(UserID) ON DELETE CASCADE
);

-- 3. STAFF TABLE
CREATE TABLE Staff (
    StaffID SERIAL PRIMARY KEY,
    UserID INT UNIQUE NOT NULL REFERENCES "User"(UserID) ON DELETE CASCADE,
    Position VARCHAR(50),
    Office VARCHAR(50)
);

-- 4. EVENT TABLE (D2)
CREATE TABLE Event (
    EventID SERIAL PRIMARY KEY,
    Name VARCHAR(150) NOT NULL,
    Venue VARCHAR(100),
    Date DATE NOT NULL,
    Description TEXT
);

-- 5. SESSION TABLE (D2)
CREATE TABLE Session (
    SessionID SERIAL PRIMARY KEY,
    EventID INT NOT NULL REFERENCES Event(EventID) ON DELETE CASCADE,
    Title VARCHAR(100) NOT NULL,
    Schedule TIMESTAMP NOT NULL,
    Capacity INT CHECK (Capacity >= 0)
);

-- 6. REGISTRATION TABLE (D3)
-- NOTE: Corrected from PDF copy-paste error. Logically links attendees to events.
CREATE TABLE Registration (
    RegID SERIAL PRIMARY KEY,
    AttendeeID INT NOT NULL REFERENCES Attendee(AttendeeID) ON DELETE CASCADE,
    EventID INT NOT NULL REFERENCES Event(EventID) ON DELETE CASCADE,
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(20) DEFAULT 'Registered' CHECK (Status IN ('Registered', 'Cancelled', 'Waitlisted')),
    CONSTRAINT uq_attendee_event UNIQUE (AttendeeID, EventID)
);

-- 7. SESSION ASSIGNMENT TABLE
-- Maps attendees to specific session rosters for QR tracking
CREATE TABLE SessionAssignment (
    AssignID SERIAL PRIMARY KEY,
    AttendeeID INT NOT NULL REFERENCES Attendee(AttendeeID) ON DELETE CASCADE,
    SessionID INT NOT NULL REFERENCES Session(SessionID) ON DELETE CASCADE,
    CONSTRAINT uq_attendee_session UNIQUE (AttendeeID, SessionID)
);

-- 8. FACILITATOR ASSIGNMENT TABLE
CREATE TABLE FacilitatorAssignment (
    FacID SERIAL PRIMARY KEY,
    StaffID INT NOT NULL REFERENCES Staff(StaffID) ON DELETE CASCADE,
    SessionID INT NOT NULL REFERENCES Session(SessionID) ON DELETE CASCADE,
    CONSTRAINT uq_staff_session UNIQUE (StaffID, SessionID)
);

-- 9. ATTENDANCE TABLE (D4)
-- ACID-compliant logs for QR/manual tracking
CREATE TABLE Attendance (
    AttendanceID SERIAL PRIMARY KEY,
    AttendeeID INT NOT NULL REFERENCES Attendee(AttendeeID) ON DELETE CASCADE,
    SessionID INT NOT NULL REFERENCES Session(SessionID) ON DELETE CASCADE,
    ScanTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(10) NOT NULL CHECK (Status IN ('Present', 'Late', 'Absent')),
    CONSTRAINT uq_attendance_session UNIQUE (AttendeeID, SessionID)
);

-- 10. NOTIFICATION TABLE
CREATE TABLE Notification (
    NotifyID SERIAL PRIMARY KEY,
    AttendeeID INT NOT NULL REFERENCES Attendee(AttendeeID) ON DELETE CASCADE,
    Message TEXT NOT NULL,
    SentAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. REPORT TABLE
CREATE TABLE Report (
    ReportID SERIAL PRIMARY KEY,
    EventID INT REFERENCES Event(EventID) ON DELETE SET NULL,
    UserID INT REFERENCES "User"(UserID) ON DELETE SET NULL,
    GeneratedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Format VARCHAR(10) CHECK (Format IN ('CSV', 'PDF'))
);

-- PERFORMANCE INDEXES (As per NFR-1: <2s query for 5k+ records)

CREATE INDEX idx_attendee_studentid ON Attendee(StudentID);
CREATE INDEX idx_session_eventid ON Session(EventID);
CREATE INDEX idx_attendance_sessionid ON Attendance(SessionID);
CREATE INDEX idx_attendance_status ON Attendance(Status);
CREATE INDEX idx_attendance_scantime ON Attendance(ScanTime);
CREATE INDEX idx_notification_attendeeid ON Notification(AttendeeID);
CREATE INDEX idx_report_eventid ON Report(EventID);
CREATE INDEX idx_report_generatedat ON Report(GeneratedAt);

-- COMMENTS FOR DOCUMENTATION

COMMENT ON TABLE "User" IS 'Base table for RBAC. Passwords must be hashed via bcryptjs before insertion.';
COMMENT ON TABLE Attendance IS 'Logs QR scans & manual marks. Enforces 1 record per attendee per session.';
COMMENT ON TABLE Registration IS 'Tracks campus event sign-ups. Corrected from PDF Table 6 duplication error.';
