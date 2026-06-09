// Shared layout wrapper for all Attendee sub-pages.
// Renders: fixed Navbar + scrollable content area + Footer.
// Use this instead of duplicating Navbar/Footer in every page.
import Navbar from '../Navbar';
import Footer from '../Footer';
import {
  PageWrapper,
  PageContent,
  PageHeader,
  PageHeaderLeft,
  PageHeaderRight,
  BackButton,
  PageTitle,
  PageSubtitle,
} from '../../styles/Dashboards/Attendee/AttendeePage.styles';
import { ArrowLeftSVG } from '../SVGs';
import { useNavigate } from 'react-router-dom';

const PortalPageLayout = ({
  title,
  subtitle,
  headerRight,
  backTo = '/attendee/portal',
  backLabel = 'Back to Portal',
  children,
}) => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Navbar />

      <PageContent>
        <PageHeader>
          <PageHeaderLeft>
            <BackButton onClick={() => navigate(backTo)} aria-label={backLabel}>
              <ArrowLeftSVG size={15} />
              {backLabel}
            </BackButton>
            {title && <PageTitle>{title}</PageTitle>}
            {subtitle && <PageSubtitle>{subtitle}</PageSubtitle>}
          </PageHeaderLeft>

          {headerRight && <PageHeaderRight>{headerRight}</PageHeaderRight>}
        </PageHeader>

        {children}
      </PageContent>

      <Footer />
    </PageWrapper>
  );
};

export default PortalPageLayout;
