// Shared chrome for every Admin/Organizer page (Dashboard, Scan Attendance, ...).
// Owns the persistent sidebar + hamburger drawer, the sticky header
// (title/subtitle, ThemeToggle, notification bell + panel), the reusable Footer,
// the role guard, and the "Create Event" StepperFormModal so the create flow works
// from any admin page. Pages pass their own body as children.

// Phase 7: extracted from Dashboard.jsx so the new admin-owned Scan Attendance
// page shares the EXACT same shell instead of borrowing the Staff portal layout.
// Phase 8: notification bell now opens the NotificationPanel fly-out (was a
// dead button with no click handler or panel).

// usage:
//   <AdminLayout title="Attendance Scanner" subtitle="...">{pageBody}</AdminLayout>

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import ThemeToggle from '../ThemeToggle';
import Footer from '../Footer';
// create-event wizard — opened from the sidebar "Create Event" item
import StepperFormModal from '../Dashboards/Admin/StepperFormModal';
// notification fly-out panel — wired to the bell button
import NotificationPanel from '../Dashboards/Admin/NotificationPanel';
import { getMyNotifications } from '../../services/notifications';
import {
  BellSVG,
  PlusSVG,
  UsersSVG,
  EventSVG,
  ChartBarSVG,
  ChartSVG,
  QrCodeSVG,
  MenuSVG,
  CloseSVG,
  UserSVG,
} from '../SVGs';
import {
  DashboardShell,
  Sidebar,
  SidebarBrand,
  SidebarNav,
  SidebarNavItem,
  SidebarFooter,
  SidebarLogoutBtn,
  DrawerOverlay,
  MobileDrawer,
  DrawerCloseBtn,
  MainArea,
  DashboardHeader,
  HamburgerBtn,
  HeaderTitle,
  HeaderControls,
  IconBtn,
  NotifDot,
} from '../../styles/Dashboards/Admin/AdminDashboard.styles';

// Sidebar nav items — single source of truth for every admin page
// "Create Event" dispatches 'openCreateModal' (handled below) instead of routing.
export const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',        icon: <ChartSVG    size={16} />, route: '/dashboard',        roles: null },
  { id: 'events',     label: 'Events',          icon: <EventSVG    size={16} />, route: '/dashboard/events', roles: null },
  { id: 'attendees',  label: 'Attendees',       icon: <UsersSVG    size={16} />, route: '/admin/attendees',  roles: ['Admin', 'Organizer'] },
  { id: 'analytics',  label: 'Analytics',       icon: <ChartBarSVG size={16} />, route: '/admin/analytics',  roles: ['Admin', 'Organizer'] },
  // old: route was '/staff/scanner' — that rendered the STAFF portal layout, so an
  //      admin clicking "Scan Attendance" was bounced into the staff shell. now
  //      points to the admin-owned scanner page at '/admin/scanner'.
  { id: 'scan',       label: 'Scan Attendance', icon: <QrCodeSVG   size={16} />, route: '/admin/scanner',    roles: ['Admin', 'Organizer', 'Staff'] },
  { id: 'users',      label: 'User Management', icon: <UserSVG     size={16} />, route: '/admin/users',      roles: ['Admin'] },
  { id: 'create',     label: 'Create Event',    icon: <PlusSVG     size={16} />, action: 'openCreateModal',  roles: ['Admin', 'Organizer'] },
];

// Shared sidebar content (rendered in both the fixed Sidebar + MobileDrawer)
const SidebarContent = ({ currentPath, user, onNavClick, onAction, onLogout }) => (
  <>
    <SidebarBrand>
      <div className="brand-name">Event Management</div>
      <div className="brand-sub">Admin Portal</div>
    </SidebarBrand>

    <SidebarNav aria-label="Dashboard navigation">
      {NAV_ITEMS.filter(item => !item.roles || item.roles.includes(user?.role)).map((item) => (
        <SidebarNavItem
          key={item.id}
          $active={
            item.route &&
            (currentPath === item.route || (item.id === 'overview' && currentPath === '/admin/dashboard'))
          }
          onClick={() => (item.action ? onAction(item.action) : onNavClick(item.route))}
          aria-current={item.route && currentPath === item.route ? 'page' : undefined}
        >
          {item.icon}
          {item.label}
        </SidebarNavItem>
      ))}
    </SidebarNav>

    <SidebarFooter>
      <div className="user-name">{user?.fullName || 'Admin'}</div>
      <div className="user-role">{user?.role}</div>
      <SidebarLogoutBtn onClick={onLogout} aria-label="Logout">
        Logout
      </SidebarLogoutBtn>
    </SidebarFooter>
  </>
);

// AdminLayout
const AdminLayout = ({
  title,
  subtitle,
  headerExtras = null,   // optional node rendered before ThemeToggle (date chip, ...)
  onEventCreated,        // called after the Create-Event modal saves (e.g. refresh data)
  children,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen,       setDrawerOpen]       = useState(false);
  const [showCreateModal,  setShowCreateModal]   = useState(false);
  // notification panel state
  const [panelOpen,        setPanelOpen]         = useState(false);
  const [unreadCount,      setUnreadCount]        = useState(0);

  // role guard — only Admin/Organizer use this shell. route everyone else to
  // their own home so nobody renders inside the wrong layout.
  if (isAuthenticated && user) {
    if (user.role === 'Attendee') return <Navigate to="/attendee/portal" replace />;
    if (user.role === 'Staff')    return <Navigate to="/staff/dashboard" replace />;
  }

  // fetch unread count on mount + whenever the route changes so the badge stays
  // accurate as the user navigates between admin pages without reopening the panel.
  // failures are silent — the badge stays at its last known count.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    let active = true;
    getMyNotifications()
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data) ? data : [];
        setUnreadCount(list.filter((n) => !n.read).length);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [location.pathname]);

  // close the notification panel whenever the route changes (user tapped a nav link)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setPanelOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleNav = (route) => {
    navigate(route);
    setDrawerOpen(false);
  };

  const handleSidebarAction = (action) => {
    setDrawerOpen(false);
    if (action === 'openCreateModal') setShowCreateModal(true);
  };

  const togglePanel = () => setPanelOpen((o) => !o);
  const closePanel  = useCallback(() => setPanelOpen(false), []);

  // called by NotificationPanel when it marks items read so the badge updates
  const handleUnreadChange = useCallback((count) => setUnreadCount(count), []);

  const hasHighPriority = unreadCount > 0;

  return (
    <DashboardShell>

      {/* Fixed sidebar (≥1440px) */}
      <Sidebar role="navigation" aria-label="Sidebar navigation">
        <SidebarContent
          currentPath={location.pathname}
          user={user}
          onNavClick={handleNav}
          onAction={handleSidebarAction}
          onLogout={handleLogout}
        />
      </Sidebar>

      {/* Mobile drawer overlay + drawer */}
      <DrawerOverlay
        $open={drawerOpen}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <MobileDrawer
        $open={drawerOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <DrawerCloseBtn
          onClick={() => setDrawerOpen(false)}
          aria-label="Close navigation menu"
        >
          <CloseSVG size={18} />
        </DrawerCloseBtn>
        <SidebarContent
          currentPath={location.pathname}
          user={user}
          onNavClick={handleNav}
          onAction={handleSidebarAction}
          onLogout={handleLogout}
        />
      </MobileDrawer>

      {/* Main area */}
      <MainArea>
        <DashboardHeader>
          <HamburgerBtn
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
          >
            <MenuSVG size={18} />
          </HamburgerBtn>

          <HeaderTitle>
            <p className="header-welcome">{title}</p>
            {subtitle && <p className="header-sub">{subtitle}</p>}
          </HeaderTitle>

          <HeaderControls>
            {headerExtras}
            <ThemeToggle />

            {/* bell button — toggles the notification fly-out panel */}
            <IconBtn
              onClick={togglePanel}
              aria-label={
                unreadCount > 0
                  ? `Notifications — ${unreadCount} unread`
                  : 'Notifications'
              }
              aria-haspopup="dialog"
              aria-expanded={panelOpen}
              title="Notifications"
            >
              <BellSVG size={16} aria-hidden="true" />
              {/* old: notifDot prop was always false — the bell never showed an
                  indicator. now shows the pulsing red dot when unread count > 0. */}
              {hasHighPriority && <NotifDot aria-hidden="true" />}
            </IconBtn>
          </HeaderControls>
        </DashboardHeader>

        {/* page body — each page owns its own content wrapper / padding */}
        {children}

        <Footer />
      </MainArea>

      {/* Notification fly-out panel */}
      <NotificationPanel
        isOpen={panelOpen}
        onClose={closePanel}
        onUnreadChange={handleUnreadChange}
      />

      {/* Create Event wizard — reachable from any admin page */}
      {showCreateModal && (
        <StepperFormModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            onEventCreated?.();
          }}
        />
      )}

    </DashboardShell>
  );
};

export default AdminLayout;
