// components/Dashboard/ActivityList.jsx
import * as S from '../../styles/Dashboard.styles';
import { CheckmarkSVG, AlertCircleSVG } from '../SVGs';

const ActivityList = () => {
  // mock activity feed - replace with websocket or polling later
  const activities = [
    {
      id: 1,
      type: 'registration',
      message: 'Maria Santos registered for Tech Talk',
      time: '2 min ago',
      icon: <CheckmarkSVG />,
      color: '#22c55e'
    },
    {
      id: 2,
      type: 'event_created',
      message: 'New event: Campus Job Fair created',
      time: '15 min ago',
      icon: <CheckmarkSVG />,
      color: '#3b82f6'
    },
    {
      id: 3,
      type: 'alert',
      message: 'Low attendance alert: Hackathon 2026',
      time: '1 hour ago',
      icon: <AlertCircleSVG />,
      color: '#f59e0b'
    },
    {
      id: 4,
      type: 'registration',
      message: 'Juan Cruz checked in via QR code',
      time: '2 hours ago',
      icon: <CheckmarkSVG />,
      color: '#22c55e'
    },
  ];

  return (
    <S.Card>
      <S.CardHeader>
        <S.CardTitle>Recent Activity</S.CardTitle>
        <S.CardActions>
          <S.CardLink href="#all">View All</S.CardLink>
        </S.CardActions>
      </S.CardHeader>
      <S.ActivityList>
        {activities.map(activity => (
          <S.ActivityItem key={activity.id}>
            <S.ActivityIcon $color={activity.color}>
              {activity.icon}
            </S.ActivityIcon>
            <S.ActivityContent>
              <S.ActivityMessage>{activity.message}</S.ActivityMessage>
              <S.ActivityTime>{activity.time}</S.ActivityTime>
            </S.ActivityContent>
          </S.ActivityItem>
        ))}
      </S.ActivityList>
    </S.Card>
  );
};

export default ActivityList;