// import api from './api';

/**
 * Fetch dashboard data based on user role
 * @param {string} role - User role (Admin, Staff, Organizer, Attendee)
 * @returns {Promise<Object>} Dashboard data object
 */
export const getDashboardData = async (role) => {
  // Mock API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Role-specific mock data
  const mockData = {
    Admin: {
      stats: {
        totalEvents: 24,
        upcomingEvents: 8,
        totalAttendees: 1847,
        activeNow: 3,
        pendingApprovals: 5,
        systemAlerts: 2,
      },
      events: [
        { id: 1, title: 'Campus Job Fair', date: '2026-05-20', status: 'Upcoming', attendees: 234, department: 'Career Services' },
        { id: 2, title: 'Tech Talk: AI in Education', date: '2026-05-15', status: 'Ongoing', attendees: 89, department: 'Computer Science' },
        { id: 3, title: 'Student Council Elections', date: '2026-05-10', status: 'Completed', attendees: 512, department: 'Student Affairs' },
        { id: 4, title: 'Hackathon 2026', date: '2026-06-01', status: 'Draft', attendees: 0, department: 'Engineering' },
        { id: 5, title: 'Research Symposium', date: '2026-05-25', status: 'Upcoming', attendees: 156, department: 'Graduate Studies' },
        { id: 6, title: 'Alumni Networking Night', date: '2026-05-18', status: 'Upcoming', attendees: 78, department: 'Alumni Relations' },
      ],
      activities: [
        { id: 1, type: 'registration', message: 'Maria Santos registered for Tech Talk', time: '2 min ago', icon: 'checkmark', color: '#22c55e' },
        { id: 2, type: 'event_created', message: 'New event: Campus Job Fair created', time: '15 min ago', icon: 'checkmark', color: '#3b82f6' },
        { id: 3, type: 'alert', message: 'Low attendance alert: Hackathon 2026', time: '1 hour ago', icon: 'alert', color: '#f59e0b' },
        { id: 4, type: 'approval', message: 'Event approval pending: Research Symposium', time: '2 hours ago', icon: 'clock', color: '#8b5cf6' },
        { id: 5, type: 'registration', message: 'Juan Cruz checked in via QR code', time: '3 hours ago', icon: 'checkmark', color: '#22c55e' },
        { id: 6, type: 'system', message: 'System backup completed successfully', time: '5 hours ago', icon: 'server', color: '#64748b' },
      ],
      attendanceOverview: {
        weeklyData: [
          { day: 'Mon', count: 245 },
          { day: 'Tue', count: 378 },
          { day: 'Wed', count: 312 },
          { day: 'Thu', count: 491 },
          { day: 'Fri', count: 355 },
          { day: 'Sat', count: 123 },
          { day: 'Sun', count: 67 },
        ],
        totalCheckins: 1971,
        weekOverWeek: '+18%',
      },
      notifications: [
        { id: 1, type: 'approval', title: 'Pending Event Approvals', count: 5, urgency: 'high' },
        { id: 2, type: 'alert', title: 'System Maintenance', count: 1, urgency: 'medium' },
        { id: 3, type: 'report', title: 'Weekly Reports Ready', count: 3, urgency: 'low' },
      ],
    },
    Staff: {
      stats: {
        assignedEvents: 12,
        upcomingTasks: 6,
        completedToday: 4,
        pendingTasks: 2,
      },
      events: [],
      activities: [],
      notifications: [],
    },
    Organizer: {
      stats: {
        myEvents: 8,
        totalRegistrations: 456,
        upcomingEvents: 3,
        drafts: 2,
      },
      events: [],
      activities: [],
      notifications: [],
    },
    Attendee: {
      stats: {
        registeredEvents: 5,
        attendedEvents: 12,
        upcomingEvents: 2,
        favoriteEvents: 8,
      },
      events: [],
      activities: [],
      notifications: [],
    },
  };

  return mockData[role] || mockData.Attendee;
};

/**
 * Fetch admin-specific statistics
 * @returns {Promise<Object>} Admin stats object
 */
export const getAdminStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    totalEvents: 24,
    upcomingEvents: 8,
    totalAttendees: 1847,
    activeNow: 3,
    pendingApprovals: 5,
    systemAlerts: 2,
    weekOverWeekGrowth: '+12%',
    monthOverMonthGrowth: '+28%',
  };
};

/**
 * Fetch events list with optional filters
 * @param {Object} filters - Filter options (status, department, date range)
 * @returns {Promise<Array>} Array of event objects
 */
export const getEvents = async (filters = {}) => {
  await new Promise(resolve => setTimeout(resolve, 600));

  const allEvents = [
    { id: 1, title: 'Campus Job Fair', date: '2026-05-20', status: 'Upcoming', attendees: 234, department: 'Career Services' },
    { id: 2, title: 'Tech Talk: AI in Education', date: '2026-05-15', status: 'Ongoing', attendees: 89, department: 'Computer Science' },
    { id: 3, title: 'Student Council Elections', date: '2026-05-10', status: 'Completed', attendees: 512, department: 'Student Affairs' },
    { id: 4, title: 'Hackathon 2026', date: '2026-06-01', status: 'Draft', attendees: 0, department: 'Engineering' },
    { id: 5, title: 'Research Symposium', date: '2026-05-25', status: 'Upcoming', attendees: 156, department: 'Graduate Studies' },
    { id: 6, title: 'Alumni Networking Night', date: '2026-05-18', status: 'Upcoming', attendees: 78, department: 'Alumni Relations' },
  ];

  // Apply filters
  let filtered = allEvents;
  if (filters.status) {
    filtered = filtered.filter(e => e.status === filters.status);
  }
  if (filters.department) {
    filtered = filtered.filter(e => e.department === filters.department);
  }

  return filtered;
};

/**
 * Fetch activity feed
 * @returns {Promise<Array>} Array of activity objects
 */
export const getActivityFeed = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));

  return [
    { id: 1, type: 'registration', message: 'Maria Santos registered for Tech Talk', time: '2 min ago', icon: 'checkmark', color: '#22c55e' },
    { id: 2, type: 'event_created', message: 'New event: Campus Job Fair created', time: '15 min ago', icon: 'checkmark', color: '#3b82f6' },
    { id: 3, type: 'alert', message: 'Low attendance alert: Hackathon 2026', time: '1 hour ago', icon: 'alert', color: '#f59e0b' },
    { id: 4, type: 'approval', message: 'Event approval pending: Research Symposium', time: '2 hours ago', icon: 'clock', color: '#8b5cf6' },
    { id: 5, type: 'registration', message: 'Juan Cruz checked in via QR code', time: '3 hours ago', icon: 'checkmark', color: '#22c55e' },
    { id: 6, type: 'system', message: 'System backup completed successfully', time: '5 hours ago', icon: 'server', color: '#64748b' },
  ];
};

/**
 * Fetch attendance analytics
 * @param {string} period - Time period (week, month, year)
 * @returns {Promise<Object>} Attendance analytics object
 */
export const getAttendanceAnalytics = async (period = 'week') => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const weeklyData = [
    { day: 'Mon', count: 245 },
    { day: 'Tue', count: 378 },
    { day: 'Wed', count: 312 },
    { day: 'Thu', count: 491 },
    { day: 'Fri', count: 355 },
    { day: 'Sat', count: 123 },
    { day: 'Sun', count: 67 },
  ];

  return {
    weeklyData,
    totalCheckins: 1971,
    weekOverWeek: '+18%',
    period,
  };
};

/**
 * Fetch admin notifications
 * @returns {Promise<Array>} Array of notification objects
 */
export const getAdminNotifications = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return [
    { id: 1, type: 'approval', title: 'Pending Event Approvals', count: 5, urgency: 'high' },
    { id: 2, type: 'alert', title: 'System Maintenance', count: 1, urgency: 'medium' },
    { id: 3, type: 'report', title: 'Weekly Reports Ready', count: 3, urgency: 'low' },
  ];
};

export default {
  getDashboardData,
  getAdminStats,
  getEvents,
  getActivityFeed,
  getAttendanceAnalytics,
  getAdminNotifications,
};