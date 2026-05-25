import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { CalendarSVG, UsersSVG } from '../../SVGs';
import { EventsCard, CardHeader, CardTitle, CardActions, CardLink, EventList, EventItem, EventDate, EventDetails, EventTitle, EventMeta, EventStatus, EmptyState, EmptyIcon, EmptyText, EmptyAction, EventsSkeleton, } from '../../../styles/Dashboards/UpcomingEvents/UpcomingEvents.styles';

/**
 * Helper: Format date string to "Mon DD" format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
const formatDate = (dateString) => {
  if (!dateString) return 'TBD';
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Helper: Get semantic status variant for styling
 * @param {string} status - Event status string
 * @returns {{ bg: string, color: string, variant: string }} Style object + variant
 */
const getStatusStyle = (status) => {
  const styles = {
    'Upcoming': { bg: '#dbeafe', color: '#1e40af', variant: 'info' },
    'Ongoing': { bg: '#dcfce7', color: '#166534', variant: 'success' },
    'Draft': { bg: '#f3e8ff', color: '#6b21a8', variant: 'warning' },
    'Completed': { bg: '#f1f5f9', color: '#475569', variant: 'neutral' },
  };
  return styles[status] || styles['Upcoming'];
};

/**
 * UpcomingEvents Component - Displays list of upcoming events with status badges
 *
 * @param {Object} props
 * @param {Array} props.events - Array of event objects
 * @param {number} props.events[].id - Unique event ID
 * @param {string} props.events[].title - Event title
 * @param {string} props.events[].date - Event date (ISO string)
 * @param {number} props.events[].attendees - Registered attendee count
 * @param {string} props.events[].status - Event status: 'Upcoming'|'Ongoing'|'Draft'|'Completed'
 * @param {boolean} props.loading - Loading state (shows skeleton)
 * 
 * @returns {React.ReactElement} Rendered upcoming events card
 *
 * @example
 * <UpcomingEvents 
 *   events={[{ id: 1, title: 'Tech Talk', date: '2026-05-15', attendees: 89, status: 'Upcoming' }]} 
 * />
 */
const UpcomingEvents = ({ events = [], loading = false }) => {
  // this is a loading state, obviously a state skeleton
  if (loading) {
    return (
      <EventsCard aria-busy="true" role="status">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <EventsSkeleton aria-hidden="true">
        {/* 'Array(3)' creates an empty array with a 'length' of 3 [empty * 3]
        '...' spread operator this spreads those empty slots into a "real" array. This is necessary because map() will skip empty slots if you don't spread them first.
        result? we get [undefined, undefined, undefined]. Now that we have an array with 3 actual items in it, .map() can finally work on it.

        why do we use it?
        when our page is loading, we don't have real data (no events from our database). but we want the UI to look ready—so we show "skeleton screens" (gray boxes)
        to fill the space while the data fetches. Since we want to show, say, 3 loading boxes, we use this trick to force the loop to run 3 times.

        .map((_, i) => {}), the first argument is 'Undefined', so we use '_' to show we are ignoring it. the second 'i' argument is the index (the current position)
        */}
          {[...Array(3)].map((_, i) => (
            <div key={`skeleton-${i}`} className="skeleton-item">
              <div className="skeleton-date" />
              <div className="skeleton-details">
                <div className="skeleton-title" />
                <div className="skeleton-meta" />
              </div>
              <div className="skeleton-status" />
            </div>
          ))}
        </EventsSkeleton>
      </EventsCard>
    );
  }

  // Empty state: friendly message + CTA
  if (events.length === 0) {
    return (
      <EventsCard>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <EmptyState role="status" aria-live="polite">
          <EmptyIcon aria-hidden="true">📅</EmptyIcon>
          <EmptyText>No upcoming events</EmptyText>
          <EmptyAction to="/dashboard/events/new" aria-label="Create your first event">
            + Create Your First Event
          </EmptyAction>
        </EmptyState>
      </EventsCard>
    );
  }

  return (
    <EventsCard role="region" aria-label="Upcoming events list">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardActions>
          <CardLink to="/dashboard/events" aria-label="Manage all events">
            Manage All
          </CardLink>
        </CardActions>
      </CardHeader>
      
      <EventList role="list">
        {events.map((event) => {
          const { bg, color } = getStatusStyle(event.status);
          return (
            <EventItem 
              key={event.id} 
              as={Link} 
              to={`/dashboard/events/${event.id}`}
              role="listitem"
              aria-label={`Event: ${event.title}, ${event.status}, ${formatDate(event.date)}`}
            >
              <EventDate>
                <CalendarSVG size={14} aria-hidden="true" />
                {formatDate(event.date)}
              </EventDate>
              
              <EventDetails>
                <EventTitle>{event.title}</EventTitle>
                <EventMeta>
                  <UsersSVG size={14} aria-hidden="true" />
                  {event.attendees || 0} registered
                </EventMeta>
              </EventDetails>
              
              <EventStatus $bg={bg} $color={color}>
                {event.status}
              </EventStatus>
            </EventItem>
          );
        })}
      </EventList>
    </EventsCard>
  );
};

// ✅ PropTypes for runtime validation
UpcomingEvents.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      attendees: PropTypes.number,
      status: PropTypes.oneOf(['Upcoming', 'Ongoing', 'Draft', 'Completed']),
    })
  ),
  loading: PropTypes.bool,
};

// ✅ Default props
UpcomingEvents.defaultProps = {
  events: [],
  loading: false,
};

export default UpcomingEvents;