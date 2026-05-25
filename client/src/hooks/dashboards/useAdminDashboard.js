import { useState, useEffect } from 'react';
import { getAdminStats, getEvents, getActivityFeed, getAttendanceAnalytics, getAdminNotifications } from '../../services/dashboards';

/**
 * @typedef {Object} AdminDashboardData
 * @property {Object} stats - Admin statistics
 * @property {Array} events - Events list
 * @property {Array} activities - Activity feed
 * @property {Object} attendanceOverview - Attendance analytics
 * @property {Array} notifications - Admin notifications
 * @property {boolean} loading - Loading state
 * @property {string|null} error - Error message if any
 * @property {Function} refresh - Function to refresh data
 */

/**
 * Hook for fetching and managing admin dashboard data
 * @returns {AdminDashboardData} Admin dashboard data and utilities
 */
export const useAdminDashboard = () => {
   const [stats, setStats] = useState(null);
   const [events, setEvents] = useState([]);
   const [activities, setActivities] = useState([]);
   const [attendanceOverview, setAttendanceOverview] = useState(null);
   const [notifications, setNotifications] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   /**
      * Fetch all admin dashboard data
      */
   const fetchData = async () => {
      try {
         setLoading(true);
         setError(null);

         // Fetch all data in parallel for better performance
         const [statsData, eventsData, activitiesData, attendanceData, notificationsData] = await Promise.all([
            getAdminStats(),
            getEvents(),
            getActivityFeed(),
            getAttendanceAnalytics('week'),
            getAdminNotifications(),
         ]);

         setStats(statsData);
         setEvents(eventsData);
         setActivities(activitiesData);
         setAttendanceOverview(attendanceData);
         setNotifications(notificationsData);
      } catch (err) {
         console.error('Failed to fetch admin dashboard data:', err);
         setError(err.message || 'Failed to load dashboard data');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      let isMounted = true;

      const loadDashboard = async () => {
         try {
            setLoading(true);
            setError(null);

            const [statsData, eventsData, activitiesData, attendanceData, notificationsData] = await Promise.all([
               getAdminStats(),
               getEvents(),
               getActivityFeed(),
               getAttendanceAnalytics('week'),
               getAdminNotifications(),
            ]);

            if (isMounted) {
               setStats(statsData);
               setEvents(eventsData);
               setActivities(activitiesData);
               setAttendanceOverview(attendanceData);
               setNotifications(notificationsData);
            }
         } catch (err) {
            if (isMounted) {
               console.error('Failed to fetch admin dashboard data:', err);
               setError(err.message || 'Failed to load dashboard data');
            }
         } finally {
            if (isMounted) {
               setLoading(false);
            }
         }
      };

      loadDashboard();

      return () => {
         isMounted = false;
      };
   }, []);

   return {
      stats,
      events,
      activities,
      attendanceOverview,
      notifications,
      loading,
      error,
      refresh: fetchData,
   };
};

export default useAdminDashboard;