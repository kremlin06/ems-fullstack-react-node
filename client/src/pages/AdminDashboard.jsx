import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { CalendarSVG, BellSVG, ChartSVG } from '../components/SVGs';
import DashboardLayout, { Header, LeftColumn, RightColumn, BottomGrid } from '../components/Dashboards/Shared/DashboardLayout';
import AdminStats from '../components/Dashboards/Admin/AdminStats';
import QuickActionMenu from '../components/Dashboards/Admin/QuickActionMenu';
import AttendanceOverview from '../components/Dashboards/Admin/AttendanceOverview';
import AdminActivityLog from '../components/Dashboards/Admin/AdminActivityLog';
import EventManagementSection from '../components/Dashboards/Admin/EventManagementSection';
import NotificationsPanel from '../components/Dashboards/Admin/NotificationsPanel';
import { useAdminDashboard } from '../hooks/dashboards/useAdminDashboard';

/**
 * AdminDashboard Component - Main admin dashboard for event management
 *
 * Features:
 * - Admin-specific stat cards (total events, active attendees, pending approvals)
 * - Event management quick actions (create, edit, delete)
 * - Attendance overview by event/department
 * - System activity log (user registrations, event changes, etc.)
 * - Admin notifications (pending approvals, system alerts)
 * - Reports/analytics section
 *
 * @returns {React.ReactElement} AdminDashboard component
 */
const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { stats, events, activities, attendanceOverview, notifications, loading, error } = useAdminDashboard();

  // Format current date for display
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Loading state with skeleton
  if (loading) {
    return (
      <DashboardLayout
        title={`Welcome back, ${user?.fullName?.split(' ')[0] || 'Admin'} 👋`}
        subtitle="Here's what's happening with your campus events today"
      >
        {/* Stats skeleton */}
        <BottomGrid>
          <LeftColumn>
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--border-radius-lg)',
                  height: '120px',
                  animation: 'pulse 1.5s infinite ease-in-out'
                }}
              />
            ))}
          </LeftColumn>
        </BottomGrid>

        {/* Content skeleton */}
        <BottomGrid>
          <LeftColumn>
            <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-lg)', height: '280px' }} />
            <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-lg)', height: '280px' }} />
          </LeftColumn>
          <RightColumn>
            <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-lg)', height: '280px' }} />
            <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-lg)', height: '280px' }} />
          </RightColumn>
        </BottomGrid>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout
        title={`Welcome back, ${user?.fullName?.split(' ')[0] || 'Admin'} 👋`}
        subtitle="Error loading dashboard data"
      >
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              background: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <DashboardLayout
        headerContent={
          <Header>
            <div>
              <h1 className="dash-title">
                Welcome back, {user?.fullName?.split(' ')[0] || 'Admin'} 👋
              </h1>
              <p className="dash-sub">
                Here's what's happening with your campus events today
              </p>
            </div>
            <div className="dash-header-right">
              <div className="date-chip">
                <CalendarSVG size={14} />
                {currentDate}
              </div>
              <button className="icon-btn" aria-label="Notifications">
                <BellSVG />
                {notifications?.some(n => n.urgency === 'high') && (
                  <span className="notif-dot" aria-label="High priority notifications" />
                )}
              </button>
              <button
                className="icon-btn"
                aria-label="View analytics"
                onClick={() => navigate('/dashboard/analytics')}
              >
                <ChartSVG />
              </button>
            </div>
          </Header>
        }
      >
        {/* Stats Section */}
        <AdminStats stats={stats} />

        {/* Main Content - Two Column Layout */}
        <BottomGrid>
          {/* Left Column: Quick Actions + Attendance Overview */}
          <LeftColumn>
            <QuickActionMenu onNavigate={navigate} />
            <AttendanceOverview attendanceData={attendanceOverview} />
          </LeftColumn>

          {/* Right Column: Activity Log + Notifications */}
          <RightColumn>
            <AdminActivityLog activities={activities} maxItems={5} />
            <NotificationsPanel notifications={notifications} />
          </RightColumn>
        </BottomGrid>

        {/* Full-width Event Management Section */}
        <EventManagementSection events={events} />
      </DashboardLayout>
    </>
  );
};

export default AdminDashboard;