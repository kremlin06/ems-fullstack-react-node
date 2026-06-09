import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/Global.styles';
import ThemeProvider from './contexts/ThemeProvider';
import { useTheme } from './hooks/useTheme';
// old: Onboarding was eagerly imported, which pulled the entire marketing
// landing page (Hero, Features, HowItWorks, CTA) into the main bundle that
// /login also had to download. now lazy-loaded below so it ships in its own
// chunk — keeps the initial bundle small for the login <1s goal (NFR-06).
// import Onboarding from './pages/Onboarding';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
// apple-hig skeleton shown while a lazy route chunk downloads (replaces the
// old plain dark div). subtle grey shimmer pulses, no emojis, no layout shift.
import RouteFallback from './components/Shared/RouteFallback';
// import Layout from './components/Layout';
// import Navbar from './components/Navbar';
// OLD: imported single ToastNotification component — rendered a persistent red error popup with no message
// import ToastContainer from './components/ToastNotification';
// MODIFIED: import the correct portal container that wraps toast children
import ToastContainer from './components/ToastContainer';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
// added Phase 5: bottom-fixed offline status indicator
import OfflineBanner from './components/Shared/OfflineBanner';

// Lazy-loaded route components
//
// WHY: the build was producing a single 1.35 MB bundle that every route had to
// download and parse before React could render anything, causing LCP > 4 s.
// By lazy-loading each page, Vite splits the bundle so a Staff user only
// downloads Staff code, an Attendee only downloads Attendee code, etc.
// Shared modules (StaffLayout, Footer, theme, etc.) are automatically placed
// in shared chunks by the bundler.
//
// Footer, OfflineBanner, ProtectedRoute, RouteFallback stay eager — they are
// tiny and used by every route / needed on first paint. Onboarding is now lazy
// (its marketing sections are heavy and only the "/" landing route needs them).

// landing (marketing) — lazy so its heavy section components stay out of the main bundle
const Onboarding     = lazy(() => import('./pages/Onboarding'));

// auth
const Login          = lazy(() => import('./pages/Login'));
const Signup         = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword  = lazy(() => import('./pages/ResetPassword'));

// admin + shared dashboard
const Dashboard         = lazy(() => import('./pages/Dashboard'));
const CreateEvent       = lazy(() => import('./pages/Admin/CreateEvent'));
const Events            = lazy(() => import('./pages/Admin/Events'));
// added Phase 2: attendee management page
const AttendeeManagement = lazy(() => import('./pages/Admin/AttendeeManagement'));
// added Phase 3: analytics & reporting page
const AnalyticsView     = lazy(() => import('./components/Analytics/AnalyticsView'));
// added Phase 7: admin-owned Scan Attendance page (renders the scanner inside the
// Admin shell instead of bouncing admins into the Staff portal layout)
const AdminScanner      = lazy(() => import('./pages/Admin/AdminScanner'));
// added: admin user management page — create and list Admin/Organizer/Staff accounts
const AdminUsers        = lazy(() => import('./pages/Admin/AdminUsers'));

// staff — Phase 4 scanner + Phase 6 unified area (two-pane dashboard, notifications, history)
// OLD (Phase 6): /staff/dashboard rendered StaffHome (centered welcome card) — wrong layout.
// import StaffHome from './pages/Staff/StaffHome'; // kept as dormant file
const StaffDashboardLayout  = lazy(() => import('./components/Staff/StaffDashboardLayout'));
const StaffDashboard        = lazy(() => import('./pages/Staff/StaffDashboard'));
const StaffNotifications    = lazy(() => import('./pages/Staff/StaffNotifications'));
const StaffAttendanceHistory = lazy(() => import('./pages/Staff/StaffAttendanceHistory'));

// attendee portal — Phase 1 landing + Phase 2 feature pages
// import ComingSoon from './pages/Attendee/ComingSoon'; // KEPT in folder — commented out now that real pages exist
const AttendeePortal   = lazy(() => import('./pages/AttendeePortal'));
const Schedule         = lazy(() => import('./pages/Attendee/Schedule'));
const BrowseEvents     = lazy(() => import('./pages/Attendee/BrowseEvents'));
const MyQRCode         = lazy(() => import('./pages/Attendee/MyQRCode'));
const AttendanceHistory = lazy(() => import('./pages/Attendee/AttendanceHistory'));
const NotificationsPage = lazy(() => import('./pages/Attendee/NotificationsPage'));

// Suspense fallbacks
// shown while a lazy chunk is downloading. apple-hig skeletons (subtle grey
// pulses) that mirror each page type so there is no flash-of-white and no
// layout shift when the real page swaps in.
//
// old: a plain dark-screen div —
//   const PageFallback = () => (
//     <div style={{ minHeight: '100vh', background: 'var(--bg-primary, #0a0a0a)' }} />
//   );
const PageFallback      = () => <RouteFallback />;                       // dashboard / portal / staff pages
const AuthFallback      = () => <RouteFallback variant="auth" />;        // login, signup, password pages
const MarketingFallback = () => <RouteFallback variant="marketing" />;   // onboarding landing

const AppContent = () => {
  const { theme } = useTheme();

  // defuckingbugging: check if theme has transitions before rendering the app.
  if (!theme || !theme.transitions) {
    console.log('Theme or theme.transitions is undefined!', theme);
    return <div style={{ background: 'white', height: '100vh' }}>Loading Theme...</div>;
  }

  // if theme isn't ready yet, show loading
  if (!theme) {
    return <div>Loading theme...</div>;
  }

  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyle />
      {/* <Navbar /> */}
      <ToastContainer />
      {/* added Phase 5: global offline banner — renders at bottom of viewport when network drops */}
      <OfflineBanner />
      <Routes>
        {/* Landing */}
        {/* Onboarding is now lazy — wrap in Suspense with the marketing skeleton */}
        <Route path="/" element={
          <Suspense fallback={<MarketingFallback />}>
            <Onboarding />
          </Suspense>
        } />

        {/* Auth (public) */}
        <Route path="/login" element={
          <Suspense fallback={<AuthFallback />}>
            <Login />
            <Footer />
          </Suspense>
        } />
        <Route path="/signup" element={
          <Suspense fallback={<AuthFallback />}>
            <Signup />
            <Footer />
          </Suspense>
        } />
        <Route path="/forgot-password" element={
          <Suspense fallback={<AuthFallback />}>
            <ForgotPassword />
            <Footer />
          </Suspense>
        } />
        <Route path="/reset-password/:token" element={
          <Suspense fallback={<AuthFallback />}>
            <ResetPassword />
            <Footer />
          </Suspense>
        } />

        {/* Admin / shared dashboard */}
        {/* /dashboard is the default landing for Admin/Organizer/Staff.
            /admin/dashboard is an alias used by the Login redirect.
            NOTE: Dashboard.jsx renders <Footer /> internally — do NOT add a
            second <Footer /> here or you get duplicate footers in the viewport. */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Suspense fallback={<PageFallback />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['Admin', 'Staff', 'Organizer']}>
            <Suspense fallback={<PageFallback />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/events/new" element={
          <ProtectedRoute>
            <Suspense fallback={<PageFallback />}>
              <CreateEvent />
              <Footer />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/events" element={
          <ProtectedRoute>
            <Suspense fallback={<PageFallback />}>
              {/* old: <Footer /> was here, but Events.jsx renders its own Footer
                  internally (line 592), so the route wrapper was producing a
                  double footer. removed the outer one. */}
              <Events />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Admin: attendee management (Phase 2) */}
        <Route path="/admin/attendees" element={
          <ProtectedRoute allowedRoles={['Admin', 'Organizer']}>
            <Suspense fallback={<PageFallback />}>
              <AttendeeManagement />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Admin: analytics & reporting (Phase 3) */}
        <Route path="/admin/analytics" element={
          <ProtectedRoute allowedRoles={['Admin', 'Organizer']}>
            <Suspense fallback={<PageFallback />}>
              <AnalyticsView />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Admin: User Management */}
        {/* Admin-only — Organizer is excluded because provisioning accounts
            is a full system oversight action only the Admin role should have */}
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <Suspense fallback={<PageFallback />}>
              <AdminUsers />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Admin: Scan Attendance (Phase 7) */}
        {/* admin-owned scanner — renders <AttendanceScanner/> inside the Admin
            shell (sidebar + header + footer). this replaces the old wiring where
            the Admin sidebar pointed at /staff/scanner and dropped admins into the
            Staff portal layout. */}
        <Route path="/admin/scanner" element={
          <ProtectedRoute allowedRoles={['Admin', 'Organizer']}>
            <Suspense fallback={<PageFallback />}>
              <AdminScanner />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Staff: live-monitoring dashboard (Phase 6 restructure) */}
        {/* Blueprint 3 two-pane monitoring view — Session Context | Live Feed.
            only Staff land here; Admin/Organizer have /dashboard.
            OLD: rendered <StaffHome /> (centered welcome card) — wrong layout. */}
        <Route path="/staff/dashboard" element={
          <ProtectedRoute allowedRoles={['Staff']}>
            <Suspense fallback={<PageFallback />}>
              <StaffDashboard />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Staff: notifications (Phase 6 restructure) */}
        <Route path="/staff/notifications" element={
          <ProtectedRoute allowedRoles={['Staff']}>
            <Suspense fallback={<PageFallback />}>
              <StaffNotifications />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Staff: attendance history (Phase 6 restructure) */}
        <Route path="/staff/history" element={
          <ProtectedRoute allowedRoles={['Staff']}>
            <Suspense fallback={<PageFallback />}>
              <StaffAttendanceHistory />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Staff: QR attendance scanner (Phase 4 / Phase 6 / Phase 7) */}
        {/* Staff-only now. old: also allowed Admin/Organizer, but admins clicking
            "Scan Attendance" landed in this Staff portal shell — the reported bug.
            Admin/Organizer have their own scanner at /admin/scanner; a stray admin
            hitting this URL is redirected to /dashboard by ProtectedRoute. */}
        <Route path="/staff/scanner" element={
          <ProtectedRoute allowedRoles={['Staff']}>
            <Suspense fallback={<PageFallback />}>
              <StaffDashboardLayout />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Attendee portal (Phase 1) */}
        {/* All attendee routes are protected and restricted to Attendee role.
            ProtectedRoute with allowedRoles prevents Admin/Staff from accidentally
            landing here; they are redirected to /dashboard instead. */}
        <Route path="/attendee/portal" element={
          <ProtectedRoute allowedRoles={['Attendee']}>
            <Suspense fallback={<PageFallback />}>
              <AttendeePortal />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* MODIFIED: Phase 2 — replaced ComingSoon placeholders with real feature pages. */}
        <Route path="/attendee/schedule" element={
          <ProtectedRoute allowedRoles={['Attendee']}>
            <Suspense fallback={<PageFallback />}>
              <Schedule />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/attendee/events" element={
          <ProtectedRoute allowedRoles={['Attendee']}>
            <Suspense fallback={<PageFallback />}>
              <BrowseEvents />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/attendee/qr" element={
          <ProtectedRoute allowedRoles={['Attendee']}>
            <Suspense fallback={<PageFallback />}>
              <MyQRCode />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/attendee/history" element={
          <ProtectedRoute allowedRoles={['Attendee']}>
            <Suspense fallback={<PageFallback />}>
              <AttendanceHistory />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/attendee/notifications" element={
          <ProtectedRoute allowedRoles={['Attendee']}>
            <Suspense fallback={<PageFallback />}>
              <NotificationsPage />
            </Suspense>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </StyledThemeProvider>
  );
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
