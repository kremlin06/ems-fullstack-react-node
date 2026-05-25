import { BellSVG, AlertCircleSVG, CheckmarkSVG, DocumentSVG } from '@components/SVGs';
import { NotificationCard, NotificationIcon, NotificationContent, NotificationTitle, NotificationCount, EmptyState, } from '@styles/Dashboards/NotificationPanel.styles';
import {  Section,  SectionHeader,  SectionTitle,  SectionSubtitle,  SectionBody } from '@Shared/DashboardLayout';

/**
 * Helper: Map notification type to appropriate SVG icon
 * @param {string} type - Notification type key
 * @returns {React.ReactElement} SVG icon component
 */
const getNotificationIcon = (type) => {
  const icons = {
    approval: <CheckmarkSVG size={18} />,
    alert: <AlertCircleSVG size={18} />,
    report: <DocumentSVG size={18} />,
  };
  return icons[type] || <BellSVG size={18} />;
};

/**
 * NotificationsPanel Component - Displays admin notifications
 *
 * @param {Object} props
 * @param {Array} props.notifications - Array of notification objects
 * @param {number} props.notifications[].id - Unique notification ID
 * @param {string} props.notifications[].type - 'approval' | 'alert' | 'report'
 * @param {string} props.notifications[].title - Notification title text
 * @param {number} props.notifications[].count - Badge count value
 * @param {'high'|'medium'|'low'} props.notifications[].urgency - Visual urgency level
 * 
 * @returns {React.ReactElement} Rendered notifications panel
 *
 * @example
 * <NotificationsPanel notifications={dashboardData.notifications} />
 */
const NotificationsPanel = ({ notifications = [] }) => {
  // Early return for empty state
  if (notifications.length === 0) {
    return (
      <Section>
        <SectionHeader>
          <div>
            <SectionTitle>Notifications</SectionTitle>
            <SectionSubtitle>You're all caught up!</SectionSubtitle>
          </div>
        </SectionHeader>
        <SectionBody>
          <EmptyState>No pending notifications</EmptyState>
        </SectionBody>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeader>
        <div>
          <SectionTitle>Notifications</SectionTitle>
          <SectionSubtitle>Items requiring your attention</SectionSubtitle>
        </div>
      </SectionHeader>
      
      <SectionBody style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            $urgency={notification.urgency}
            role="listitem"
            aria-label={`Notification: ${notification.title}`}
          >
            <NotificationIcon $type={notification.type} aria-hidden="true">
              {getNotificationIcon(notification.type)}
            </NotificationIcon>
            
            <NotificationContent>
              <NotificationTitle>{notification.title}</NotificationTitle>
            </NotificationContent>
            
            {notification.count > 0 && (
              <NotificationCount aria-label={`${notification.count} items`}>
                {notification.count}
              </NotificationCount>
            )}
          </NotificationCard>
        ))}
      </SectionBody>
    </Section>
  );
};

export default NotificationsPanel;