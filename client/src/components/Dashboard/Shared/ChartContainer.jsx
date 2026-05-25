import PropTypes from 'prop-types';
import { ChartWrapper, BarChartContainer, BarWrapper, Bar, BarLabel, BarValue, ChartSummary, SummaryItem, SummaryValue, SummaryLabel, ChartSkeleton, } from '../../../styles/Dashboards/Shared/ChartContainer.styles';

/**
 * ChartContainer Component - Wrapper for chart components with theme & loading support
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Chart component(s) to render
 * @param {string} props.height - Container height (default: '300px')
 * @param {boolean} props.loading - Loading state toggle
 * 
 * @returns {React.ReactElement} Themed chart wrapper
 *
 * @example
 * <ChartContainer height="250px" loading={isLoading}>
 *   <SimpleBarChart data={data} />
 * </ChartContainer>
 */
const ChartContainer = ({ children, height = '300px', loading = false }) => {
  if (loading) {
    return (
      <ChartWrapper $height={height} aria-busy="true" role="status">
        <ChartSkeleton aria-hidden="true" />
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper $height={height} role="region" aria-label="Chart container">
      {children}
    </ChartWrapper>
  );
};

ChartContainer.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.string,
  loading: PropTypes.bool,
};

/**
 * SimpleBarChart Component - Lightweight CSS bar chart
 *
 * @param {Object} props
 * @param {Array} props.data - Array of { label, value, color }
 * @param {string} props.height - Chart inner height (default: '200px')
 * @param {React.ReactNode} props.summary - Optional metrics row
 * 
 * @returns {React.ReactElement} CSS-based bar chart
 *
 * @example
 * <SimpleBarChart
 *   data={[
 *     { label: 'Mon', value: 45, color: '#3b82f6' },
 *     { label: 'Tue', value: 78, color: '#3b82f6' },
 *   ]}
 *   summary={<><SummaryItem><SummaryValue>123</SummaryValue></SummaryItem></>}
 * />
 */
const SimpleBarChart = ({ data = [], height = '200px', summary }) => {
  // Prevent division by zero or NaN when data is empty
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <>
      <BarChartContainer 
        $chartHeight={height} 
        role="img" 
        aria-label="Bar chart visualization"
      >
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          return (
            <BarWrapper key={item.label || `bar-${index}`}>
              <Bar $height={barHeight} $color={item.color} />
              <BarLabel>{item.label}</BarLabel>
              <BarValue>{item.value}</BarValue>
            </BarWrapper>
          );
        })}
      </BarChartContainer>
      
      {summary && <ChartSummary>{summary}</ChartSummary>}
    </>
  );
};

SimpleBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string,
    })
  ),
  height: PropTypes.string,
  summary: PropTypes.node,
};

export default ChartContainer;

// ✅ Re-export styled components for backward compatibility
// Prevents breaking imports like: import { BarChartContainer } from '../Shared/ChartContainer'
export {
  ChartWrapper,
  BarChartContainer,
  BarWrapper,
  Bar,
  BarLabel,
  BarValue,
  ChartSummary,
  SummaryItem,
  SummaryValue,
  SummaryLabel,
  ChartSkeleton,
  SimpleBarChart,
};