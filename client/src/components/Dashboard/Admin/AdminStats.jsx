import PropTypes from 'prop-types';
// import { StatsGrid } from '@Shared/DashboardLayout';
import StatCard from '@Shared/StatCard';
import { EventSVG, CalendarSVG, UsersSVG, ChartSVG } from '@componentsSVGs';
import { StatsGridWrapper, StatsSkeleton, StatsEmptyState, } from '@styles/Dashboards/AdminStats.styles';

/**
 * AdminStats Component - Displays admin-specific statistics cards
 *
 * @param {Object} props
 * @param {Object} props.stats - Statistics object from useAdminDashboard hook
 * @param {number} props.stats.totalEvents - Total number of events
 * @param {number} props.stats.upcomingEvents - Number of upcoming events
 * @param {number} props.stats.totalAttendees - Total attendees across all events
 * @param {number} props.stats.activeNow - Number of currently active events
 * @param {number} props.stats.pendingApprovals - Number of pending approvals
 * @param {string} props.stats.weekOverWeekGrowth - Week over week growth (e.g., "+12%")
 * 
 * @returns {React.ReactElement|null} Rendered stats grid or null if loading
 *
 * @example
 * <AdminStats stats={dashboardData.stats} />
 */
const AdminStats = ({ stats }) => {
  // Handle loading state with skeleton
  if (!stats) {
    return (
      <StatsGridWrapper role="region" aria-label="Loading statistics">
        <StatsSkeleton>
          {[...Array(4)].map((_, i) => (
            <div key={`skeleton-${i}`} className="skeleton-card" />
          ))}
        </StatsSkeleton>
      </StatsGridWrapper>
    );
  }

  // Handle empty/zero state gracefully
  const hasData = Object.values(stats).some(val => val != null && val !== 0);
  if (!hasData) {
    return (
      <StatsGridWrapper role="region" aria-label="Statistics">
        <StatsEmptyState>
          <p>No statistics available yet</p>
          <small>Data will appear after events are created</small>
        </StatsEmptyState>
      </StatsGridWrapper>
    );
  }

  // Stat cards configuration - admin-specific metrics
  const statCards = [
    {
      label: 'Total Events',
      value: stats.totalEvents || 0,
      icon: <EventSVG size={20} aria-hidden="true" />,
      color: '#3b82f6',
      trend: stats.weekOverWeekGrowth || '+0%',
      'aria-label': `Total events: ${stats.totalEvents || 0}`,
    },
    {
      label: 'Upcoming',
      value: stats.upcomingEvents || 0,
      icon: <CalendarSVG size={20} aria-hidden="true" />,
      color: '#22c55e',
      trend: '+3',
      'aria-label': `Upcoming events: ${stats.upcomingEvents || 0}`,
    },
    {
      label: 'Total Attendees',
      value: stats.totalAttendees || 0,
      icon: <UsersSVG size={20} aria-hidden="true" />,
      color: '#8b5cf6',
      trend: '+18%',
      'aria-label': `Total attendees: ${stats.totalAttendees || 0}`,
    },
    {
      label: 'Active Now',
      value: stats.activeNow || 0,
      icon: <ChartSVG size={20} aria-hidden="true" />,
      color: '#ea580c',
      trend: stats.activeNow > 0 ? 'Live' : 'None',
      'aria-label': `Currently active events: ${stats.activeNow || 0}`,
    },
  ];

  return (
    <StatsGridWrapper
      role="region" 
      aria-label="Admin statistics overview"
      data-testid="admin-stats-grid"
    >
      {statCards.map((stat) => (
        <StatCard 
          key={stat.label} 
          {...stat} 
          // Pass through aria-label for accessibility
          aria-label={stat['aria-label']}
        />
      ))}
    </StatsGridWrapper>
  );
};

// ✅ PropTypes for runtime validation during development
AdminStats.propTypes = {
  stats: PropTypes.shape({
    totalEvents: PropTypes.number,
    upcomingEvents: PropTypes.number,
    totalAttendees: PropTypes.number,
    activeNow: PropTypes.number,
    pendingApprovals: PropTypes.number,
    weekOverWeekGrowth: PropTypes.string,
  }),
};

export default AdminStats;