import * as S from '../styles/Dashboard.styles';
import { CalendarSVG, BellSVG, ChartSVG, PlusSVG, UsersSVG, EventSVG } from '../components/SVGs';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import StatCard from '../components/Dashboard/StatCard';
import QuickActionMenu from '../components/Dashboard/QuickActionMenu';
import AttendanceOverview from '../components/Dashboard/AttendanceOverview';
import ActivityList from '../components/Dashboard/ActivityList';
import UpcomingEvents from '../components/Dashboard/UpcomingEvents';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // redirect if not authenticated - ProtectedRoute should handle this, but belt + suspenders
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    
    // fetch events data - replace with actual api call when backend is ready
    const fetchEvents = async () => {
      try {
        // mock data for now - replace with api.get('/events') later
        const mockEvents = [
          { id: 1, title: 'Campus Job Fair', date: '2026-05-20', status: 'Upcoming', attendees: 234 },
          { id: 2, title: 'Tech Talk: AI in Education', date: '2026-05-15', status: 'Ongoing', attendees: 89 },
          { id: 3, title: 'Student Council Elections', date: '2026-05-10', status: 'Completed', attendees: 512 },
          { id: 4, title: 'Hackathon 2026', date: '2026-06-01', status: 'Draft', attendees: 0 },
        ];
        setEvents(mockEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [isAuthenticated, navigate]);

  // calculate stats from events data - memoize if this gets heavy
  const statsData = [
    { 
      label: "Total Events", 
      value: events.length, 
      icon: <EventSVG size={20} />,
      color: "#3b82f6", 
      trend: "+12%",
      type: 'total' 
    },
    { 
      label: "Upcoming", 
      value: events.filter(e => e.status === "Upcoming").length, 
      icon: <CalendarSVG size={20} />,
      color: "#16a34a", 
      trend: "+3",
      type: 'upcoming' 
    },
    { 
      label: "Total Attendees", 
      value: events.reduce((sum, e) => sum + (e.attendees || 0), 0), 
      icon: <UsersSVG size={20} />,
      color: "#8b5cf6", 
      trend: "+18%",
      type: 'attendees' 
    },
    { 
      label: "Active Now", 
      value: events.filter(e => e.status === "Ongoing").length, 
      icon: <ChartSVG size={20} />,
      color: "#ea580c", 
      trend: "Live",
      type: 'ongoing' 
    },
  ];

  // quick actions for admin workflow - these are the primary tasks
  const quickActions = [
    {
      label: 'Create Event',
      icon: <PlusSVG size={20} />,
      onClick: () => navigate('/dashboard/events/new'),
      variant: 'primary',
      description: 'Set up a new campus event'
    },
    {
      label: 'Manage Events',
      icon: <EventSVG size={20} />,
      onClick: () => navigate('/dashboard/events'),
      variant: 'secondary',
      description: 'Edit or view existing events'
    },
    {
      label: 'View Reports',
      icon: <ChartSVG size={20} />,
      onClick: () => navigate('/dashboard/analytics'),
      variant: 'ghost',
      description: 'Attendance and participation analytics'
    },
    {
      label: 'Export Data',
      icon: <CalendarSVG size={20} />,
      onClick: () => console.log('Export clicked'),
      variant: 'ghost',
      description: 'Download attendee lists as CSV'
    },
  ];

  // if loading, show skeleton - don't render empty state that looks broken
  if (loading) {
    return (
      <S.DashboardContainer>
        <S.Header>
          <div>
            <S.Skeleton width="200px" height="32px" />
            <S.Skeleton width="150px" height="16px" />
          </div>
        </S.Header>
        <S.StatsGrid>
          {[1,2,3,4].map(i => <S.SkeletonCard key={i} />)}
        </S.StatsGrid>
        <S.BottomGrid>
          <S.SkeletonCard height="300px" />
          <S.SkeletonCard height="300px" />
        </S.BottomGrid>
      </S.DashboardContainer>
    );
  }

  return (
    <S.DashboardContainer>
      
      {/* Header Section - welcome message + date + notifications */}
      <S.Header>
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
            <CalendarSVG size={14}/> 
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <button className="icon-btn" aria-label="Notifications">
            <BellSVG />
            <span className="notif-dot" aria-label="3 new notifications" />
          </button>
          <button className="icon-btn" aria-label="View analytics">
            <ChartSVG />
          </button>
        </div>
      </S.Header>

      {/* Stats Section - metric cards with trends */}
      <S.StatsGrid>
        {statsData.map(stat => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </S.StatsGrid>

      {/* Quick Actions + Activity Row */}
      <S.BottomGrid>
        {/* Left: Quick Action Menu + Attendance Overview */}
        <S.LeftColumn>
          <QuickActionMenu actions={quickActions} />
          <AttendanceOverview events={events} />
        </S.LeftColumn>
        
        {/* Right: Recent Activity + Upcoming Events */}
        <S.RightColumn>
          <ActivityList />
          <UpcomingEvents events={events.filter(e => e.status === 'Upcoming')} />
        </S.RightColumn>
      </S.BottomGrid>

    </S.DashboardContainer>
  );
};

export default Dashboard;