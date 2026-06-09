import { Navigate, useLocation } from 'react-router-dom';
// importing our auth hook to check if user is logged in
import { useAuth } from '../contexts/useAuth';
// loading spinner component for the "checking auth" state
import LoadingSpinner from './LoadingSpinner';

// protected route component, wraps any route that requires authentication
// if user is not logged in, redirects to login page, otherwise renders children
// this is the gatekeeper, don't skip this or our "private" pages are public
//
// MODIFIED: added `allowedRoles` prop for role-based access control.
// Pass allowedRoles={['Admin']} or allowedRoles={['Attendee']} to restrict access.
// If the authenticated user's role is NOT in allowedRoles, they are redirected
// to their own portal rather than seeing an unauthorized error.
const ProtectedRoute = ({ children, redirectTo = '/login', allowedRoles }) => {
  // getting auth state from context, including loading flag
  // MODIFIED: also destructure `user` to check role
  const { isAuthenticated, user, loading } = useAuth();
  // getting current location, so we can redirect back after login
  const location = useLocation();

  // if still checking auth (loading), show spinner instead of content or redirect
  // prevents flickering or wrong redirects while we verify the token
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <LoadingSpinner />
      </div>
    );
  }

  // if not authenticated after loading, redirect to login page
  // state={{ from: location }} lets login page know where to send user after success
  // replace: true prevents back button from returning to protected page
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // ADDED: role-based access check — only runs when allowedRoles is provided
  // If the user's role is not in the allowed list, redirect them to their correct portal
  // instead of showing a generic unauthorized page.
  if (allowedRoles && allowedRoles.length > 0 && user?.role) {
    if (!allowedRoles.includes(user.role)) {
      // Attendees trying to access admin routes → send to attendee portal
      // Admin/Staff/Organizer trying to access attendee routes → send to admin dashboard
      const isAdminRole = ['Admin', 'Staff', 'Organizer'].includes(user.role);
      return <Navigate to={isAdminRole ? '/dashboard' : '/attendee/portal'} replace />;
    }
  }

  // if we got here, user is authenticated (and has the right role), render content
  // children is whatever component was wrapped by this ProtectedRoute
  return children;
};

export default ProtectedRoute;