import PropTypes from 'prop-types';
import { StatCardContainer, StatCardHeader, StatIcon, StatTrend, StatValue, StatLabel, StatCardSkeleton, } from '../../../styles/Dashboards/Shared/StatCard.styles';
import { getTrendStyle } from '../../../hooks/dashboards/useDashboardStats';

/**
 * StatCard Component - Displays a metric with icon, value, label, and optional trend
 *
 * @param {Object} props
 * @param {string} props.label - Descriptive label for the metric
 * @param {number|string} props.value - Numeric or string value to display
 * @param {React.ReactNode} props.icon - SVG icon component to render
 * @param {string} props.color - Hex color for accent border and icon background
 * @param {string} props.trend - Optional trend indicator (e.g., "+12%", "Live", "-3%")
 * @param {boolean} props.loading - Loading state (shows skeleton)
 * @param {Function} props.onClick - Optional click handler for interactive cards
 * @param {string} props.trendVariant - Force trend variant: 'positive'|'negative'|'neutral'|'live'
 * 
 * @returns {React.ReactElement} Rendered stat card
 *
 * @example
 * <StatCard
 *   label="Total Events"
 *   value={24}
 *   icon={<EventSVG />}
 *   color="#3b82f6"
 *   trend="+12%"
 *   onClick={() => navigate('/events')}
 * />
 */
const StatCard = ({ label, value, icon, color, trend, loading = false, onClick, trendVariant: forcedVariant,
}) => {
  // Loading state: show skeleton
  if (loading) {
    return <StatCardSkeleton aria-busy="true" role="status" />;
  }

  // Determine trend variant for styling
  // Priority: forcedVariant > auto-detected from trend string > neutral fallback
  const trendVariant = forcedVariant || (trend ? getTrendStyle(trend).variant : null);

  // Format numeric values with locale-aware commas
  const displayValue = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <StatCardContainer
      $color={color}
      $clickable={!!onClick}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        // Keyboard accessibility for clickable cards
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={onClick ? `${label}: ${displayValue}${trend ? `, trend: ${trend}` : ''}` : undefined}
    >
      <StatCardHeader>
        <StatIcon $color={color} aria-hidden="true">
          {icon}
        </StatIcon>
        
        {trend && (
          <StatTrend $variant={trendVariant} aria-label={`Trend: ${trend}`}>
            {trend}
          </StatTrend>
        )}
      </StatCardHeader>
      
      <StatValue>{displayValue}</StatValue>
      <StatLabel>{label}</StatLabel>
    </StatCardContainer>
  );
};

// ✅ PropTypes for runtime validation
StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string,
  trend: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  trendVariant: PropTypes.oneOf(['positive', 'negative', 'neutral', 'live']),
};

// ✅ Default props for safer rendering
StatCard.defaultProps = {
  color: undefined,
  trend: undefined,
  loading: false,
  onClick: undefined,
  trendVariant: undefined,
};

export default StatCard;

// ✅ Re-export styled components for backward compatibility
export {
  StatCardContainer,
  StatCardHeader,
  StatIcon,
  StatTrend,
  StatValue,
  StatLabel,
  StatCardSkeleton,
};