// src/components/Analytics/AnalyticsView.jsx
// Reports & Analytics — Blueprint 8 layout
// Phase 8: Filter Side Panel (desktop) + Bottom Drawer (mobile ≤768px)
//
// layout   : AnalyticsLayout → FilterSidePanel (260px sticky) + AnalyticsContent
// mobile   : FilterSidePanel hidden → FilterDrawerBtn in header opens bottom sheet
// metrics  : Total Attendees, Present Count, Participation Rate, Attendance per Session
// filters  : Event, Session, Date Range, Text Search, PIIToggle (Admin-only)
// chart    : session capacity utilisation (Recharts bar)
// table    : paginated, sortable, with StatusBadges for reg/attendance status
// export   : CSV + PDF via ExportButton in DashboardHeader
// PII      : backend masks emails/studentIds for Organizer; Admin can toggle unmask

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { getAdminEvents, getSessions } from '../../services/admin';
import { getOverview, getSessionAnalytics, getReportPreview } from '../../services/analytics';
import StatCard from '../Dashboards/Shared/StatCard';
import ThemeToggle from '../ThemeToggle';
import Footer from '../Footer';

import {
  EventSVG, UsersSVG, ChartBarSVG, ClockSVG, CheckCircleSVG,
  ChartSVG, QrCodeSVG, PlusSVG, MenuSVG, CloseSVG, FilterSVG,
} from '../SVGs';

import ReportFilters from './ReportFilters';
import AnalyticsChart from './AnalyticsChart';
import ExportButton from './ExportButton';
import ReportTable from './ReportTable';
// added: 2-step event + session creation wizard, opened in place from the sidebar
import StepperFormModal from '../Dashboards/Admin/StepperFormModal';
import * as S from '../../styles/Analytics/AnalyticsView.styles';

// admin shell — shared with Dashboard, Events, AttendeeManagement
import {
  DashboardShell,
  Sidebar, SidebarBrand, SidebarNav, SidebarNavItem, SidebarFooter, SidebarLogoutBtn,
  DrawerOverlay, MobileDrawer, DrawerCloseBtn,
  MainArea, DashboardHeader, HamburgerBtn, HeaderTitle, HeaderControls,
  DashboardContent,
} from '../../styles/Dashboards/Admin/AdminDashboard.styles';

// Sidebar nav — same 6 items across all admin pages
const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',        icon: <ChartSVG    size={16} />, route: '/dashboard' },
  { id: 'events',    label: 'Events',           icon: <EventSVG    size={16} />, route: '/dashboard/events' },
  { id: 'attendees', label: 'Attendees',        icon: <UsersSVG    size={16} />, route: '/admin/attendees', roles: ['Admin', 'Organizer'] },
  { id: 'analytics', label: 'Analytics',        icon: <ChartBarSVG size={16} />, route: '/admin/analytics', roles: ['Admin', 'Organizer'] },
  // old: route was '/staff/scanner' (dropped admins into the staff portal shell);
  //      now points to the admin-owned scanner page.
  { id: 'scan',      label: 'Scan Attendance',  icon: <QrCodeSVG   size={16} />, route: '/admin/scanner',   roles: ['Admin', 'Organizer', 'Staff'] },
  // old: route '/dashboard' navigated away to Overview just to open the modal —
  //      that's the "page jumped back to Overview" bug. now opens the wizard here.
  { id: 'create',    label: 'Create Event',     icon: <PlusSVG     size={16} />, action: 'openCreateModal', roles: ['Admin', 'Organizer'] },
];

// camelCase column key → snake_case sort field
const SORT_MAP = {
  registeredAt: 'registered_at',
  fullName: 'full_name',
  email: 'email',
  registrationStatus: 'status',
  checkInTime: 'check_in_time',
};

const DEFAULT_FILTERS = {
  eventId: undefined,
  sessionId: undefined,
  startDate: undefined,
  endDate: undefined,
  q: undefined,
};

const AnalyticsView = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();
  const hamburgerRef    = useRef(null);

  // nav drawer (sidebar on mobile)
  const [drawerOpen,       setDrawerOpen]       = useState(false);
  // filter drawer (filter panel on mobile ≤768px)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // filter / sort / pagination
  const [filters,  setFilters]  = useState(DEFAULT_FILTERS);
  const [sort,     setSort]     = useState('registeredAt');
  const [sortDir,  setSortDir]  = useState('desc');
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // data
  const [events,         setEvents]         = useState([]);
  const [filterSessions, setFilterSessions] = useState([]);
  const [overview,       setOverview]       = useState(null);
  const [chartSessions,  setChartSessions]  = useState([]);
  const [report,         setReport]         = useState({ total: 0, rows: [] });

  // loading
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingChart,    setLoadingChart]    = useState(false);
  const [loadingReport,   setLoadingReport]   = useState(false);

  // PII toggle — Admin-only switch to show unmasked emails / student IDs
  // default false (masked) so Admin must explicitly opt in to viewing raw PII
  const [piiUnmasked, setPiiUnmasked] = useState(false);
  // create-event wizard (opened from the sidebar "Create Event")
  const [showCreateModal, setShowCreateModal] = useState(false);

  // debounce timer for text search
  const searchTimer = useRef(null);

  // fetch events list for filter dropdown
  // extracted into a callback so the create-event modal can refresh it on success
  const loadEvents = useCallback(() => {
    getAdminEvents({ pageSize: 100 })
      .then(data => setEvents(data.events ?? data.data ?? []))
      .catch(err => console.error('[AnalyticsView] events fetch:', err));
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  // fetch sessions when event changes
  useEffect(() => {
    if (!filters.eventId) { setFilterSessions([]); return; }
    getSessions({ eventId: filters.eventId, pageSize: 100 })
      .then(data => setFilterSessions(data.sessions ?? data.data ?? []))
      .catch(err => console.error('[AnalyticsView] sessions fetch:', err));
  }, [filters.eventId]);

  // overview fetch (event + date range only)
  const fetchOverview = useCallback(() => {
    setLoadingOverview(true);
    getOverview({
      eventId: filters.eventId,
      sessionId: filters.sessionId,
      startDate: filters.startDate,
      endDate: filters.endDate,
    })
      .then(data => setOverview(data))
      .catch(err => console.error('[AnalyticsView] overview fetch:', err))
      .finally(() => setLoadingOverview(false));
  }, [filters.eventId, filters.sessionId, filters.startDate, filters.endDate]);

  useEffect(() => { fetchOverview(); }, [fetchOverview]);

  // chart data fetch when event is selected
  useEffect(() => {
    if (!filters.eventId) { setChartSessions([]); return; }
    setLoadingChart(true);
    getSessionAnalytics({ eventId: filters.eventId })
      .then(data => setChartSessions(data.sessions ?? []))
      .catch(err => console.error('[AnalyticsView] chart fetch:', err))
      .finally(() => setLoadingChart(false));
  }, [filters.eventId]);

  // report table fetch
  const fetchReport = useCallback(() => {
    setLoadingReport(true);
    getReportPreview({
      ...filters,
      sort: SORT_MAP[sort] ?? 'registered_at',
      sortDir,
      page,
      pageSize,
    })
      .then(data => {
        // piiUnmasked only applies for Admin — organizer always gets masked data from backend
        const isMasked = !(user?.role === 'Admin' && piiUnmasked);
        setReport({
          total: data.total,
          rows: (data.rows ?? []).map(r => ({ ...r, _masked: isMasked })),
        });
      })
      .catch(err => console.error('[AnalyticsView] report fetch:', err))
      .finally(() => setLoadingReport(false));
  }, [filters, sort, sortDir, page, pageSize, user?.role, piiUnmasked]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  // lock body scroll when either drawer is open
  useEffect(() => {
    document.body.style.overflow = (drawerOpen || filterDrawerOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen, filterDrawerOpen]);

  // handlers
  const handleFilterChange = (newFilters) => {
    setPage(1);
    if (newFilters.q !== filters.q) {
      clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => setFilters(newFilters), 300);
    } else {
      setFilters(newFilters);
    }
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleSort = (key, dir) => {
    setSort(key);
    setSortDir(dir);
    setPage(1);
  };

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => hamburgerRef.current?.focus(), 0);
  }, []);

  const handleNav = (route) => { navigate(route); closeDrawer(); };

  // sidebar action dispatcher — opens the Create Event wizard in place
  const handleSidebarAction = (action) => {
    closeDrawer();
    if (action === 'openCreateModal') setShowCreateModal(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // count active filters so the mobile button can show a badge
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // metric cards (US-17 KPIs)
  // Total Attendees | Present Count | Participation Rate | Attendance per Session
  const metrics = [
    {
      label: 'Total Attendees',
      value: overview?.totalAttendees ?? overview?.activeAttendees ?? '—',
      icon: <UsersSVG size={16} />,
      color: '#007bff',
      trend: null,
    },
    {
      label: 'Present Count',
      value: overview?.presentCount ?? '—',
      icon: <CheckCircleSVG size={16} />,
      color: '#28a745',
      trend: null,
    },
    {
      label: 'Participation Rate',
      value: overview?.participationRate ?? '—',
      icon: <ChartBarSVG size={16} />,
      color: '#8b5cf6',
      trend: overview?.monthOverMonthGrowth ?? null,
    },
    {
      label: filters.sessionId ? 'Session Attendance' : 'Avg. per Session',
      value: overview?.sessionAttendanceRate ?? overview?.avgSessionAttendance ?? '—',
      icon: <ClockSVG size={16} />,
      color: '#f59e0b',
      trend: null,
    },
  ];

  // PIIToggle rendering — used in both desktop panel and mobile drawer
  const renderPIIToggle = () => {
    if (user?.role !== 'Admin') return null;
    return (
      <S.PIIToggleSection>
        <S.PIIToggleLeft>
          <S.PIIToggleTitle>Unmask PII</S.PIIToggleTitle>
          <S.PIIToggleSub>Show full emails and student IDs</S.PIIToggleSub>
        </S.PIIToggleLeft>
        <S.ToggleTrack
          $on={piiUnmasked}
          onClick={() => setPiiUnmasked(v => !v)}
          role="switch"
          aria-checked={piiUnmasked}
          aria-label={piiUnmasked ? 'PII unmasked — click to mask' : 'PII masked — click to unmask'}
        >
          <S.ToggleKnob $on={piiUnmasked} aria-hidden="true" />
        </S.ToggleTrack>
      </S.PIIToggleSection>
    );
  };

  // shared sidebar content (desktop nav sidebar + mobile nav drawer)
  const renderSidebarContent = () => (
    <>
      <SidebarBrand>
        <div className="brand-name">Event Management</div>
        <div className="brand-sub">Admin Portal</div>
      </SidebarBrand>

      <SidebarNav aria-label="Dashboard navigation">
        {NAV_ITEMS
          .filter(item => !item.roles || item.roles.includes(user?.role))
          .map(item => (
            <SidebarNavItem
              key={item.id}
              $active={item.route && location.pathname === item.route}
              onClick={() => (item.action ? handleSidebarAction(item.action) : handleNav(item.route))}
              aria-current={item.route && location.pathname === item.route ? 'page' : undefined}
            >
              {item.icon}
              {item.label}
            </SidebarNavItem>
          ))}
      </SidebarNav>

      <SidebarFooter>
        <div className="user-name">{user?.fullName || 'Admin'}</div>
        <div className="user-role">{user?.role}</div>
        <SidebarLogoutBtn onClick={handleLogout} aria-label="Logout">
          Logout
        </SidebarLogoutBtn>
      </SidebarFooter>
    </>
  );

  // render
  return (
    <DashboardShell>

      {/* Fixed nav sidebar (≥1440px) */}
      <Sidebar role="navigation" aria-label="Sidebar navigation">
        {renderSidebarContent()}
      </Sidebar>

      {/* Mobile nav drawer */}
      <DrawerOverlay $open={drawerOpen} onClick={closeDrawer} aria-hidden="true" />
      <MobileDrawer
        $open={drawerOpen}
        inert={drawerOpen ? undefined : ''}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <DrawerCloseBtn onClick={closeDrawer} aria-label="Close navigation menu">
          <CloseSVG size={18} />
        </DrawerCloseBtn>
        {renderSidebarContent()}
      </MobileDrawer>

      {/* Main column */}
      <MainArea>

        {/* sticky page header */}
        <DashboardHeader>
          <HamburgerBtn
            ref={hamburgerRef}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            aria-haspopup="dialog"
          >
            <MenuSVG size={18} />
          </HamburgerBtn>

          <HeaderTitle>
            <p className="header-welcome">Reports &amp; Analytics</p>
            <p className="header-sub">Attendance summaries, session metrics, and data exports</p>
          </HeaderTitle>

          <HeaderControls>
            {/* "Filters" button — only shows on ≤768px (CSS-controlled) */}
            <S.FilterDrawerBtn
              onClick={() => setFilterDrawerOpen(true)}
              aria-expanded={filterDrawerOpen}
              aria-haspopup="dialog"
              aria-label={`Open filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ''}`}
            >
              <FilterSVG size={13} aria-hidden="true" />
              Filters
              {activeFilterCount > 0 && (
                <S.FilterActiveBadge aria-hidden="true">{activeFilterCount}</S.FilterActiveBadge>
              )}
            </S.FilterDrawerBtn>

            {/* CSV + PDF export — always visible */}
            <ExportButton filters={filters} disabled={loadingReport} />
            <ThemeToggle />
          </HeaderControls>
        </DashboardHeader>

        {/* Blueprint 8: Two-column analytics layout */}
        <DashboardContent>
          <S.AnalyticsLayout>

                Left: Filter Side Panel (desktop ≥769px, sticky)
                Contains: Event, Session, Date Range, Text Search, PIIToggle
            ─────────────────────────────────────────────────────────────────── */}
            <S.FilterSidePanel aria-label="Report filters">
              <S.FilterPanelHeader>
                <S.FilterPanelTitle>
                  <FilterSVG size={13} aria-hidden="true" />
                  Filters
                </S.FilterPanelTitle>
                <S.FilterResetBtn
                  onClick={handleResetFilters}
                  aria-label="Reset all filters"
                  disabled={activeFilterCount === 0}
                >
                  Reset
                </S.FilterResetBtn>
              </S.FilterPanelHeader>

              <ReportFilters
                filters={filters}
                events={events}
                sessions={filterSessions}
                onFilterChange={handleFilterChange}
                loading={loadingReport}
              />

              {/* PII toggle — Admin-only */}
              {renderPIIToggle()}
            </S.FilterSidePanel>

                Right: Main analytics content
                4 MetricCards → Chart → Report Table
            ─────────────────────────────────────────────────────────────────── */}
            <S.AnalyticsContent>

              {/* 4 KPI MetricCards (US-17) */}
              <S.MetricGrid>
                {metrics.map(m => (
                  <StatCard
                    key={m.label}
                    label={m.label}
                    value={m.value}
                    icon={m.icon}
                    color={m.color}
                    trend={m.trend}
                    loading={loadingOverview}
                  />
                ))}
              </S.MetricGrid>

              {/* Session Capacity Utilisation chart (US-18) */}
              <S.SectionCard aria-labelledby="chart-heading">
                <S.CardHeader>
                  <div>
                    <h2 id="chart-heading">Session Capacity Utilisation</h2>
                    <p>
                      {filters.eventId
                        ? 'Percentage of capacity filled per session (attended / capacity)'
                        : 'Select an event to view session breakdown'}
                    </p>
                  </div>
                </S.CardHeader>
                <S.CardBody>
                  <AnalyticsChart data={chartSessions} loading={loadingChart} />
                </S.CardBody>
              </S.SectionCard>

              {/* Paginated attendance report table (US-19) */}
              <S.SectionCard aria-labelledby="report-heading">
                <S.CardHeader>
                  <div>
                    <h2 id="report-heading">Attendance Report</h2>
                    <p>
                      {report.total > 0
                        ? `${report.total.toLocaleString()} registration${report.total !== 1 ? 's' : ''} found`
                        : 'No records match the current filters'}
                      {user?.role !== 'Admin' && (
                        <S.MaskedCell
                          as="span"
                          title="Email and student ID are partially masked for Organizer role"
                        >
                          {' — PII masked'}
                        </S.MaskedCell>
                      )}
                    </p>
                  </div>
                </S.CardHeader>

                <ReportTable
                  rows={report.rows}
                  total={report.total}
                  page={page}
                  pageSize={pageSize}
                  sort={sort}
                  sortDir={sortDir}
                  loading={loadingReport}
                  onPageChange={setPage}
                  onPageSizeChange={n => { setPageSize(n); setPage(1); }}
                  onSort={handleSort}
                />
              </S.SectionCard>

            </S.AnalyticsContent>

          </S.AnalyticsLayout>
        </DashboardContent>

        <Footer />

        {/* ── Mobile Filter Bottom Drawer ──────────────────────────────────────
            shown on ≤768px when the "Filters" button in the header is tapped.
            position: fixed — rendered inside MainArea but appears at viewport bottom.
        ────────────────────────────────────────────────────────────────────────── */}
        <S.FilterDrawerOverlay
          $open={filterDrawerOpen}
          onClick={() => setFilterDrawerOpen(false)}
          aria-hidden="true"
        />
        <S.FilterDrawer
          $open={filterDrawerOpen}
          role="dialog"
          aria-modal="true"
          aria-label="Report filters"
          inert={filterDrawerOpen ? undefined : ''}
        >
          <S.FilterDrawerHandle aria-hidden="true" />
          <S.FilterDrawerHeader>
            <S.FilterDrawerTitle>
              <FilterSVG size={13} aria-hidden="true" />
              Filters
            </S.FilterDrawerTitle>
            <S.FilterDrawerCloseBtn
              onClick={() => setFilterDrawerOpen(false)}
              aria-label="Close filters"
            >
              <CloseSVG size={16} />
            </S.FilterDrawerCloseBtn>
          </S.FilterDrawerHeader>
          <S.FilterDrawerBody>
            <ReportFilters
              filters={filters}
              events={events}
              sessions={filterSessions}
              onFilterChange={handleFilterChange}
              loading={loadingReport}
            />
            {renderPIIToggle()}
            <S.DrawerApplyBtn onClick={() => setFilterDrawerOpen(false)}>
              Apply Filters
            </S.DrawerApplyBtn>
          </S.FilterDrawerBody>
        </S.FilterDrawer>

      </MainArea>

      {/* ── Create Event wizard (opened from the sidebar "Create Event") ──────
          old: the sidebar item navigated to /dashboard to open this modal there;
          now it opens in place here. onSuccess refreshes the event filter list. */}
      {showCreateModal && (
        <StepperFormModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadEvents();
          }}
        />
      )}

    </DashboardShell>
  );
};

export default AnalyticsView;
