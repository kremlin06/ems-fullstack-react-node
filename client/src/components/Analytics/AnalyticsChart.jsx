// Session capacity utilisation bar chart (Recharts).
// Phase 8 update: all inline styles removed — use styled components from AnalyticsView.styles.

// states  : loading -> ChartSkeletonWrap with axis-label + body skeletons
//           empty   -> ChartEmptyState centred message
//           data    -> responsive BarChart with custom tooltip
// a11y    : ChartA11yTable (visually hidden) lets screen readers read the raw numbers

import { useTheme } from 'styled-components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import * as S from '../../styles/Analytics/AnalyticsView.styles';
// added Phase 5: replace text "Loading chart..." with animated skeletons
import { SkeletonBlock, SkeletonLine } from '../Shared/Skeleton';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <S.TooltipCard>
      <S.TooltipLabel>{label}</S.TooltipLabel>
      <S.TooltipRow>Capacity fill: {d.capacityPct.toFixed(1)}%</S.TooltipRow>
      <S.TooltipRow>Registered: {d.registeredCount}</S.TooltipRow>
      <S.TooltipRow>Attended: {d.attendedCount}</S.TooltipRow>
      {d.capacity > 0 && (
        <S.TooltipRow>Capacity: {d.capacity}</S.TooltipRow>
      )}
    </S.TooltipCard>
  );
};

const AnalyticsChart = ({ data = [], loading }) => {
  const theme = useTheme();

  if (loading) {
    // old: plain text "Loading chart..." centred in the chart area
    return (
      <S.ChartSkeletonWrap aria-label="Loading chart" aria-busy="true">
        {/* x-axis label placeholders — $flex="1" distributes them evenly */}
        <S.ChartSkeletonAxisRow>
          {[55, 70, 48, 62, 50].map((_, i) => (
            <SkeletonLine key={i} $h="10px" $mb="0" $flex="1" />
          ))}
        </S.ChartSkeletonAxisRow>
        {/* bar chart body */}
        <SkeletonBlock $h="220px" $r="6px" />
      </S.ChartSkeletonWrap>
    );
  }

  if (!data.length) {
    return (
      <S.ChartEmptyState>
        No session data available.
      </S.ChartEmptyState>
    );
  }

  // truncate long session titles so the X-axis stays readable
  const chartData = data.map(d => ({
    ...d,
    shortTitle: d.title.length > 18 ? d.title.slice(0, 16) + '…' : d.title,
  }));

  return (
    <>
      {/* accessible fallback table — visually hidden but read by screen readers */}
      <S.ChartA11yTable aria-label="Session capacity utilisation data">
        <thead>
          <tr>
            <th scope="col">Session</th>
            <th scope="col">Capacity fill (%)</th>
            <th scope="col">Registered</th>
            <th scope="col">Attended</th>
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d.id ?? d.title}>
              <td>{d.title}</td>
              <td>{d.capacityPct.toFixed(1)}</td>
              <td>{d.registeredCount}</td>
              <td>{d.attendedCount}</td>
            </tr>
          ))}
        </tbody>
      </S.ChartA11yTable>

      <S.ChartWrapper
        role="img"
        aria-label="Bar chart showing session capacity utilisation percentages"
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
            barCategoryGap="36%"
          >
            <CartesianGrid
              vertical={false}
              stroke={theme.colors.borderColor}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="shortTitle"
              tick={{
                fill: theme.colors.textTertiary,
                fontSize: 11,
                fontFamily: theme.fonts?.primary,
              }}
              axisLine={{ stroke: theme.colors.borderColor }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
              tick={{
                fill: theme.colors.textTertiary,
                fontSize: 11,
                fontFamily: theme.fonts?.primary,
              }}
              axisLine={false}
              tickLine={false}
              width={42}
            />
            <Tooltip
              cursor={false}
              content={<CustomTooltip />}
            />
            <Bar
              dataKey="capacityPct"
              fill={theme.colors.accentPrimary}
              radius={[4, 4, 0, 0]}
              maxBarSize={56}
              isAnimationActive
              animationDuration={400}
            />
          </BarChart>
        </ResponsiveContainer>
      </S.ChartWrapper>
    </>
  );
};

export default AnalyticsChart;
