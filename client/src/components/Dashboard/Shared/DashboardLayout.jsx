import PropTypes from 'prop-types';
import { DashboardContainer, Header, HeaderContent, StatsGrid, HeaderTitle, HeaderSubtitle, HeaderRight, DateChip, IconButton, NotifDot, BottomGrid, LeftColumn, RightColumn, Section, SectionHeader, SectionTitle, SectionSubtitle, SectionActions, SectionBody, SectionLink, } from '@styles/Dashboards/Shared/DashboardLayout.styles';

/**
 * DashboardLayout Component - Provides common layout structure for all dashboards
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {React.ReactNode} props.headerContent - Optional custom header content
 * @param {string} props.title - Dashboard title
 * @param {string} props.subtitle - Dashboard subtitle
 * @param {React.ReactNode} props.headerRight - Right side header actions
 * 
 * @returns {React.ReactElement} Dashboard layout wrapper
 *
 * @example
 * <DashboardLayout title="Admin Dashboard" subtitle="Manage your events">
 *   <StatsGrid>...</StatsGrid>
 * </DashboardLayout>
 */
const DashboardLayout = ({
  children,
  headerContent,
  title,
  subtitle,
  headerRight,
}) => {
  return (
    <DashboardContainer>
      {headerContent || (
        <Header>
          <HeaderContent>
            <HeaderTitle>{title}</HeaderTitle>
            {subtitle && <HeaderSubtitle>{subtitle}</HeaderSubtitle>}
          </HeaderContent>
          
          {headerRight && (
            <HeaderRight>
              {headerRight}
            </HeaderRight>
          )}
        </Header>
      )}
      {children}
    </DashboardContainer>
  );
};

// ✅ PropTypes for runtime validation
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  headerContent: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  headerRight: PropTypes.node,
};

export default DashboardLayout;

// Hey team, I'm re-exporting all these style blocks right here so no one has to look inside the styles folder!
export { 
  DashboardContainer, // Main container layout wrapper for the dashboard screen
  Header,             // Top header section area
  HeaderContent,      // Wrapper inside the header for titles and descriptions
  HeaderTitle,        // Big bold dashboard title text
  HeaderSubtitle,     // Small descriptive caption text below the title
  HeaderRight,        // Right side alignment container for headers (like profiles/buttons)
  DateChip,           // Small rounded badge container for displaying dates
  IconButton,         // Clickable button block designed specifically for wrapping SVG icons
  NotifDot,           // Small colored dot indicator for pending alerts or notifications
  StatsGrid,          // Grid display helper for tracking metric or number cards
  BottomGrid,         // Grid block to arrange bottom panels side-by-side
  LeftColumn,         // Main wider column layout wrapper for left-side details
  RightColumn,        // Narrower column layout sidebar container on the right
  Section,            // Structural panel widget box layout used for sub-modules
  SectionHeader,      // Title bar layout wrapper for internal sections
  SectionTitle,       // Regular sub-module heading label
  SectionSubtitle,    // Extra text description details beneath a section heading
  SectionActions,     // Container to hold buttons or toggles on the right of section headers
  SectionBody,        // Interior padding wrapper holding the main details inside a section
  SectionLink,        // Text clickable link style for buttons like "View Details"
};