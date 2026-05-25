import { ActionMenu } from '@Shared/ActionCard';
import { PlusSVG, EventSVG, ChartSVG, CalendarSVG } from '@components/SVGs';

/**
 * QuickActionMenu Component - Admin-specific quick action menu
 *
 * @param {Array} actions - Optional custom actions array (overrides defaults)
 * @param {Function} onNavigate - Navigation handler function
 * @returns {React.ReactElement} QuickActionMenu component
 *
 * @example
 * <QuickActionMenu onNavigate={(path) => navigate(path)} />
 */
const QuickActionMenu = ({ actions, onNavigate }) => {
  const defaultActions = [
    {
      label: 'Create Event',
      icon: <PlusSVG size={20} />,
      onClick: () => onNavigate?.('/dashboard/events/new'),
      variant: 'primary',
      description: 'Set up a new campus event',
    },
    {
      label: 'Manage Events',
      icon: <EventSVG size={20} />,
      onClick: () => onNavigate?.('/dashboard/events'),
      variant: 'secondary',
      description: 'Edit or view existing events',
    },
    {
      label: 'View Reports',
      icon: <ChartSVG size={20} />,
      onClick: () => onNavigate?.('/dashboard/analytics'),
      variant: 'ghost',
      description: 'Attendance and participation analytics',
    },
    {
      label: 'Export Data',
      icon: <CalendarSVG size={20} />,
      onClick: () => console.log('Export clicked'),
      variant: 'ghost',
      description: 'Download attendee lists as CSV',
    },
  ];

  const actionsToUse = actions || defaultActions;

  return (
    <ActionMenu
      title="Quick Actions"
      subtitle="Start a common task"
      actions={actionsToUse}
    />
  );
};

export default QuickActionMenu;