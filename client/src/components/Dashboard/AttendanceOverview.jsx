// components/Dashboard/AttendanceOverview.jsx
import * as S from '../../styles/Dashboard.styles';
import { ChartSVG } from '../SVGs';

const AttendanceOverview = ({ events = [] }) => {
  // mock data for chart - replace with real analytics later
  const chartData = [
    { day: 'Mon', count: 45 },
    { day: 'Tue', count: 78 },
    { day: 'Wed', count: 62 },
    { day: 'Thu', count: 91 },
    { day: 'Fri', count: 55 },
    { day: 'Sat', count: 23 },
    { day: 'Sun', count: 12 },
  ];

  const maxCount = Math.max(...chartData.map(d => d.count));

  return (
    <S.Card>
      <S.CardHeader>
        <S.CardTitle>Attendance This Week</S.CardTitle>
        <S.CardActions>
          <S.CardLink href="#details">View Details</S.CardLink>
        </S.CardActions>
      </S.CardHeader>
      <S.CardBody>
        <S.ChartContainer>
          {chartData.map((item, index) => (
            <S.ChartBarWrapper key={index}>
              <S.ChartBar 
                $height={(item.count / maxCount) * 100}
                $color={item.count > 70 ? '#3b82f6' : '#94a3b8'}
              />
              <S.ChartLabel>{item.day}</S.ChartLabel>
              <S.ChartValue>{item.count}</S.ChartValue>
            </S.ChartBarWrapper>
          ))}
        </S.ChartContainer>
        <S.ChartSummary>
          <S.SummaryItem>
            <S.SummaryValue>366</S.SummaryValue>
            <S.SummaryLabel>Total Check-ins</S.SummaryLabel>
          </S.SummaryItem>
          <S.SummaryItem>
            <S.SummaryValue>+12%</S.SummaryValue>
            <S.SummaryLabel>vs Last Week</S.SummaryLabel>
          </S.SummaryItem>
        </S.ChartSummary>
      </S.CardBody>
    </S.Card>
  );
};

export default AttendanceOverview;