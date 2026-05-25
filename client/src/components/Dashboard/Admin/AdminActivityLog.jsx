import PropTypes from 'prop-types';
/*  if wala pang prop-types sa inyo, hit terminal and npm install prop-types
    after running install command, check your package.json file. you should now see 'prop-types': '15.x.x' listed under the 'dependencies' section
*/
import {  Section,  SectionHeader,  SectionTitle,  SectionSubtitle,  SectionActions,  SectionLink } from '@components/Dashboards/Shared/DashboardLayout';
import { CheckmarkSVG, AlertCircleSVG, ClockSVG, ServerSVG } from '@components/SVGs';
import { ActivityList, ActivityItem, ActivityIcon, ActivityContent, ActivityMessage, ActivityTime, ActivityEmptyState, ActivitySkeleton, ViewAllLink,} from '@styles/Dashboards/Admin/AdminActivityLogs.styles';

/**
 * Helper: Map activity type to appropriate SVG icon
 * @param {string} type - Activity type key
 * @returns {React.ReactElement} SVG icon component
 */
const getActivityIcon = (type) => {
  const icons = {
    registration: <CheckmarkSVG size={14} aria-hidden="true" />,
    event_created: <CheckmarkSVG size={14} aria-hidden="true" />,
    alert: <AlertCircleSVG size={14} aria-hidden="true" />,
    approval: <ClockSVG size={14} aria-hidden="true" />,
    system: <ServerSVG size={14} aria-hidden="true" />,
  };
  return icons[type] || <CheckmarkSVG size={14} aria-hidden="true" />;
};

/**
 * Helper: Get icon color based on activity type
 * @param {string} type - Activity type key
 * @returns {string} Hex color value
 */
const getActivityColor = (type) => {
  const colors = {
    registration: '#22c55e',  // green
    event_created: '#3b82f6', // blue
    alert: '#f59e0b',         // amber
    approval: '#8b5cf6',      // purple
    system: '#64748b',        // slate
  };
  return colors[type] || '#64748b';
};

/**
 * AdminActivityLog Component - Displays recent system activity feed
 *
 * @param {Object} props
 * @param {Array} props.activities - Array of activity objects from useAdminDashboard
 * @param {number} props.activities[].id - Unique activity ID
 * @param {string} props.activities[].type - Activity type key
 * @param {string} props.activities[].message - Human-readable activity message
 * @param {string} props.activities[].time - Time ago string (e.g., "2h ago")
 * @param {number} props.maxItems - Maximum items to display (default: 5)
 * 
 * @returns {React.ReactElement} Rendered activity log section
 *
 * @example
 * <AdminActivityLog activities={dashboardData.activities} maxItems={5} />
 */
const AdminActivityLog = ({ activities = [], maxItems = 5 }) => {
  // Handle loading state with skeleton
  if (activities === null || activities === undefined) {
    return (
      <Section>
        <SectionHeader>
          <div>
            <SectionTitle>Activity Log</SectionTitle>
            <SectionSubtitle>Loading recent events...</SectionSubtitle>
          </div>
        </SectionHeader>
        <ActivitySkeleton aria-label="Loading activity log">
          {[...Array(3)].map((_, i) => (
            <div key={`skeleton-${i}`} className="skeleton-item">
              <div className="skeleton-icon" />
              <div className="skeleton-content">
                <div className="skeleton-line" />
                <div className="skeleton-line" />
              </div>
            </div>
          ))}
        </ActivitySkeleton>
      </Section>
    );
  }

  // Slice to max items for display
  const displayedActivities = activities.slice(0, maxItems);

  // Handle empty state gracefully
  if (displayedActivities.length === 0) {
    return (
      <Section>
        <SectionHeader>
          <div>
            <SectionTitle>Activity Log</SectionTitle>
            <SectionSubtitle>Recent system events and updates</SectionSubtitle>
          </div>
          <SectionActions>
            <SectionLink onClick={() => {}} disabled>
              View All
            </SectionLink>
          </SectionActions>
        </SectionHeader>
        <ActivityEmptyState role="status" aria-live="polite">
          <ServerSVG size={32} />
          <p>No recent activity</p>
          <small>System events will appear here</small>
        </ActivityEmptyState>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeader>
        <div>
          <SectionTitle>Activity Log</SectionTitle>
          <SectionSubtitle>Recent system events and updates</SectionSubtitle>
        </div>
        <SectionActions>
          <ViewAllLink 
            as={SectionLink}
            onClick={() => {}}
            aria-label="View full activity log"
          >
            View All
          </ViewAllLink>
        </SectionActions>
      </SectionHeader>
      
      <ActivityList 
        role="list" 
        aria-label="Recent system activity"
        data-testid="activity-log-list"
      >
        {displayedActivities.map((activity) => (
          <ActivityItem 
            key={activity.id} 
            role="listitem"
            aria-label={`Activity: ${activity.message}`}
          >
            <ActivityIcon 
              $color={getActivityColor(activity.type)}
              aria-hidden="true"
            >
              {getActivityIcon(activity.type)}
            </ActivityIcon>
            
            <ActivityContent>
              <ActivityMessage>{activity.message}</ActivityMessage>
              <ActivityTime>{activity.time}</ActivityTime>
            </ActivityContent>
          </ActivityItem>
        ))}
      </ActivityList>
    </Section>
  );
};

// ✅ PropTypes for runtime validation during development
AdminActivityLog.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ),
  maxItems: PropTypes.number,
};

// ✅ Default props for safer rendering
AdminActivityLog.defaultProps = {
  activities: [],
  maxItems: 5,
};

export default AdminActivityLog;