import { useMemo } from 'react';

/**
 * Calculate stats from events data
 * @param {Array} events - Array of event objects
 * @returns {Object} Calculated statistics
 */
export const useDashboardStats = (events = []) => {
  return useMemo(() => {
    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => e.status === 'Upcoming').length;
    const ongoingEvents = events.filter(e => e.status === 'Ongoing').length;
    const completedEvents = events.filter(e => e.status === 'Completed').length;
    const draftEvents = events.filter(e => e.status === 'Draft').length;
    const totalAttendees = events.reduce((sum, e) => sum + (e.attendees || 0), 0);

    return {
      totalEvents,
      upcomingEvents,
      ongoingEvents,
      completedEvents,
      draftEvents,
      totalAttendees,
      averageAttendees: totalEvents > 0 ? Math.round(totalAttendees / totalEvents) : 0,
    };
  }, [events]);
};

/**
 * Calculate trend percentage
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {string} Formatted trend string (e.g., "+12%" or "-5%")
 */
export const calculateTrend = (current, previous) => {
  if (!previous || previous === 0) return '+0%';
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${Math.round(change)}%`;
};

/**
 * Get status color based on event status
 * @param {string} status - Event status
 * @returns {Object} Color configuration
 */
export const getStatusColors = (status) => {
  const colors = {
    Upcoming: { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
    Ongoing: { bg: '#dcfce7', text: '#166534', border: '#22c55e' },
    Completed: { bg: '#f1f5f9', text: '#475569', border: '#64748b' },
    Draft: { bg: '#f3e8ff', text: '#6b21a8', border: '#8b5cf6' },
    Cancelled: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
  };
  return colors[status] || colors.Upcoming;
};

/**
 * Get trend styling based on value
 * @param {string|number} trend - Trend value
 * @returns {Object} Style object for trend display
 */
export const getTrendStyle = (trend) => {
  if (trend === 'Live') {
    return { color: '#ea580c', background: '#fff7ed' };
  }
  if (typeof trend === 'string' && trend.startsWith('+')) {
    return { color: '#16a34a', background: '#f0fdf4' };
  }
  if (typeof trend === 'string' && trend.startsWith('-')) {
    return { color: '#dc2626', background: '#fef2f2' };
  }
  return { color: '#6e6e73', background: '#f5f5f7' };
};

export default useDashboardStats;