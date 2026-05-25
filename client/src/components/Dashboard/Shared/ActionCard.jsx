import PropTypes from 'prop-types';
import { ActionCardContainer, CardHeader, CardTitle, CardSubtitle, ActionGrid, ActionButton, ActionIcon, ActionContent, ActionLabel, ActionDesc, } from '@styles/Dashboards/Shared/ActionCard.styles'
/**
 * ActionMenu Component - Reusable action menu card
 *
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string} props.subtitle - Card subtitle
 * @param {Array} props.actions - Array of action objects
 * @param {string} props.actions[].label - Button label
 * @param {React.ReactNode} props.actions[].icon - Icon component
 * @param {Function} props.actions[].onClick - Click handler
 * @param {string} props.actions[].variant - Button variant: 'primary'|'secondary'|'ghost'
 * @param {string} props.actions[].description - Action description
 * 
 * @returns {React.ReactElement} ActionMenu component
 *
 * @example
 * <ActionMenu
 *   title="Quick Actions"
 *   subtitle="Start a common task"
 *   actions={[
 *     { label: 'Create Event', icon: <PlusSVG />, onClick: handleClick, variant: 'primary' }
 *   ]}
 * />
 */
const ActionMenu = ({ title, subtitle, actions = [] }) => {
  return (
    <ActionCardContainer role="region" aria-label={title}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
      </CardHeader>
      
      <ActionGrid>
        {actions.map((action, index) => (
          <ActionButton
            key={action.label || `action-${index}`}
            onClick={action.onClick}
            $variant={action.variant || 'ghost'}
            type="button"
            aria-label={action.label}
          >
            <ActionIcon>
              {action.icon}
            </ActionIcon>
            <ActionContent>
              <ActionLabel>{action.label}</ActionLabel>
              {action.description && <ActionDesc>{action.description}</ActionDesc>}
            </ActionContent>
          </ActionButton>
        ))}
      </ActionGrid>
    </ActionCardContainer>
  );
};

// adding PropTypes here so the app doesn't break if someone passes the wrong props to ActionMenu!
ActionMenu.propTypes = {
  // title is required (the big text at the top of the menu)
  title: PropTypes.string.isRequired,
  
  // subtitle is optional (smaller text below the title)
  subtitle: PropTypes.string,
  
  // this is the array of buttons/options that will show up inside the menu. Must be provided!
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,       // Text shown on the menu item button
      icon: PropTypes.node.isRequired,          // SVG or Icon component icon to show next to text
      onClick: PropTypes.func.isRequired,       // The click handler function for when they press it
      variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']), // Optional style presets
      description: PropTypes.string,            // Extra detail text for the action item if needed
    })
  ).isRequired,
};

// this is a default props, as you can see—no value
ActionMenu.defaultProps = {
  subtitle: '',
};

export { ActionMenu }; // this is a named export because ActionMenu was enclosed in parenthesis
export default ActionMenu; // this is a default export kasi mag isa siya, fuck you