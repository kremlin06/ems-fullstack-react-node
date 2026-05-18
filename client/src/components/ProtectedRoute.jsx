import { Navigate, useLocation } from 'react-router-dom';
// importing our auth hook to check if user is logged in
import { useAuth } from '../contexts/useAuth';
// loading spinner component for the "checking auth" state
import LoadingSpinner from './LoadingSpinner';

// protected route component, wraps any route that requires authentication
// if user is not logged in, redirects to login page, otherwise renders children
// this is the gatekeeper, don't skip this or our "private" pages are public
const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  // getting auth state from context, including loading flag
  const { isAuthenticated, loading } = useAuth();
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

  // if we got here, user is authenticated, so render the protected content
  // children is whatever component was wrapped by this ProtectedRoute
  return children;
};

export default ProtectedRoute;