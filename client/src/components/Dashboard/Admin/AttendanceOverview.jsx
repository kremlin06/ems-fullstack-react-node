import PropTypes from 'prop-types';
import {  Section,  SectionHeader,  SectionTitle,  SectionSubtitle,  SectionActions,  SectionLink,  SectionBody } from '@Shared/DashboardLayout';
import ChartContainer, { SimpleBarChart } from '../Shared/ChartContainer';
import { ChartWrapper, SummaryContainer, SummaryMetric, MetricValue, MetricLabel, EmptyState, SkeletonLoader, } from '@styles/Dashboards/Admin/AttendanceOverview.styles';

/**
 * AttendanceOverview Component - Displays weekly attendance chart and summary
 *
 * @param {Object} props
 * @param {Object} props.attendanceData - Attendance data from useAdminDashboard hook
 * @param {Array} props.attendanceData.weeklyData - Array of { day: string, count: number }
 * @param {number} props.attendanceData.totalCheckins - Total check-ins for the period
 * @param {string} props.attendanceData.weekOverWeek - Week over week change (e.g., "+12%")
 * 
 * @returns {React.ReactElement|null} Rendered attendance overview or null if loading
 *
 * @example
 * <AttendanceOverview attendanceData={dashboardData.attendanceOverview} />
 */
const AttendanceOverview = ({ attendanceData }) => {
  // Handle loading/empty states gracefully
  if (!attendanceData) {
    return (
      <Section>
        <SectionHeader>
          <div>
            <SectionTitle>Attendance Overview</SectionTitle>
            <SectionSubtitle>Loading statistics...</SectionSubtitle>
          </div>
        </SectionHeader>
        <SectionBody>
          <ChartWrapper>
            <SkeletonLoader />
          </ChartWrapper>
        </SectionBody>
      </Section>
    );
  }

  const { weeklyData, totalCheckins, weekOverWeek } = attendanceData;

  // Handle empty data state
  if (!weeklyData || weeklyData.length === 0) {
    return (
      <Section>
        <SectionHeader>
          <div>
            <SectionTitle>Attendance Overview</SectionTitle>
            <SectionSubtitle>No data available</SectionSubtitle>
          </div>
        </SectionHeader>
        <SectionBody>
          <EmptyState>
            <p>No attendance records for this period</p>
            <small>Check back after events have check-ins</small>
          </EmptyState>
        </SectionBody>
      </Section>
    );
  }

  // Prepare chart data with conditional coloring
  const chartData = weeklyData.map(item => ({
    label: item.day,
    value: item.count,
    // Color logic: highlight high-attendance days
    color: item.count > 300 ? '#3b82f6' : '#94a3b8',
  }));

  // Determine trend color for visual feedback
  const trendColor = weekOverWeek?.startsWith('+') ? '#22c55e' : 
                     weekOverWeek?.startsWith('-') ? '#ef4444' : 
                     undefined;

  return (
    <Section>
      <SectionHeader>
        <div>
          <SectionTitle>Attendance Overview</SectionTitle>
          <SectionSubtitle>Weekly check-in statistics</SectionSubtitle>
        </div>
        <SectionActions>
          <SectionLink 
            onClick={() => {}} 
            aria-label="View detailed attendance report"
          >
            View Details
          </SectionLink>
        </SectionActions>
      </SectionHeader>
      
      <SectionBody>
        <ChartWrapper>
          <ChartContainer height="180px">
            <SimpleBarChart
              data={chartData}
              height="120px"
              aria-label="Weekly attendance bar chart"
              summary={
                <SummaryContainer>
                  <SummaryMetric>
                    <MetricValue>{totalCheckins?.toLocaleString() || 0}</MetricValue>
                    <MetricLabel>Total Check-ins</MetricLabel>
                  </SummaryMetric>
                  
                  <SummaryMetric>
                    <MetricValue $trendColor={trendColor}>
                      {weekOverWeek || '+0%'}
                    </MetricValue>
                    <MetricLabel>vs Last Week</MetricLabel>
                  </SummaryMetric>
                </SummaryContainer>
              }
            />
          </ChartContainer>
        </ChartWrapper>
      </SectionBody>
    </Section>
  );
};

// ✅ PropTypes for runtime validation (optional but recommended)
AttendanceOverview.propTypes = {
  attendanceData: PropTypes.shape({
    weeklyData: PropTypes.arrayOf(
      PropTypes.shape({
        day: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
      })
    ),
    totalCheckins: PropTypes.number,
    weekOverWeek: PropTypes.string,
  }),
};

export default AttendanceOverview;