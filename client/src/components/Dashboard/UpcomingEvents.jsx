// components/Dashboard/UpcomingEvents.jsx
import * as S from '../../styles/Dashboard.styles';
import { CalendarSVG, UsersSVG } from '../SVGs';
import { Link } from 'react-router-dom';

const UpcomingEvents = ({ events = [] }) => {
  // format date helper - could move to utils later
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // status badge colors
  const getStatusStyle = (status) => {
    const styles = {
      'Upcoming': { bg: '#dbeafe', color: '#1e40af' },
      'Ongoing': { bg: '#dcfce7', color: '#166534' },
      'Draft': { bg: '#f3e8ff', color: '#6b21a8' },
      'Completed': { bg: '#f1f5f9', color: '#475569' },
    };
    return styles[status] || styles['Upcoming'];
  };

  if (events.length === 0) {
    return (
      <S.Card>
        <S.CardHeader>
          <S.CardTitle>Upcoming Events</S.CardTitle>
        </S.CardHeader>
        <S.EmptyState>
          <S.EmptyIcon>📅</S.EmptyIcon>
          <S.EmptyText>No upcoming events</S.EmptyText>
          <S.EmptyAction as={Link} to="/dashboard/events/new">
            + Create Your First Event
          </S.EmptyAction>
        </S.EmptyState>
      </S.Card>
    );
  }

  return (
    <S.Card>
      <S.CardHeader>
        <S.CardTitle>Upcoming Events</S.CardTitle>
        <S.CardActions>
          <S.CardLink as={Link} to="/dashboard/events">Manage All</S.CardLink>
        </S.CardActions>
      </S.CardHeader>
      <S.EventList>
        {events.map(event => {
          const statusStyle = getStatusStyle(event.status);
          return (
            <S.EventItem key={event.id} as={Link} to={`/dashboard/events/${event.id}`}>
              <S.EventDate>
                <CalendarSVG size={14} />
                {formatDate(event.date)}
              </S.EventDate>
              <S.EventDetails>
                <S.EventTitle>{event.title}</S.EventTitle>
                <S.EventMeta>
                  <UsersSVG size={14} />
                  {event.attendees || 0} registered
                </S.EventMeta>
              </S.EventDetails>
              <S.EventStatus style={statusStyle}>
                {event.status}
              </S.EventStatus>
            </S.EventItem>
          );
        })}
      </S.EventList>
    </S.Card>
  );
};

export default UpcomingEvents;