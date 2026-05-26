import { createContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, logoutApi } from '../services/auth';

// creating the auth context with null default value
// this will be replaced by the provider's value when components consume it
// the null default is intentional, so useAuth() throws if used outside provider
const AuthContext = createContext(null);

// the provider component that wraps our app and supplies auth state to all children
// this is where we manage the global auth state, so any component can access it
export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [loading, setLoading] = useState(true);
   const [sessionExpired, setSessionExpired] = useState(false); // tracks whether the session expired mid-use (vs. never logged in). 
   // used to show a "session expired" toast on the login page.

   // effect that runs once on mount to check if user is already authenticated
   // this is the "remember me" logic, but using localStorage instead of cookies
   useEffect(() => {
      const initAuth = async () => {
         // getting token from localStorage, the one we saved on login
         const token = localStorage.getItem('authToken');
         // if token exists, try to fetch current user data to validate it
         if (!token) {
            setLoading(false);
            return;
         }

         try {
            // calling api to get current user, this will fail if token is expired/invalid
            const userData = await getCurrentUser();
            // if successful, set user state and mark as authenticated
            setUser(userData);
            setIsAuthenticated(true);
         } catch {
            // if it fails, token is bad, so clear it and stay logged out
            // logging error for debugging, but not showing to user (they don't care)
            // console.error('Auth initialization failed:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
         } finally {
         // done checking, set loading to false so app can render
         // this prevents flickering or wrong redirects on page load
            setLoading(false);
         }
      };
      initAuth();
   }, []); // empty deps array = run once on mount, like componentDidMount

   /* 
      api.js fires this event when a 401 refresh cycle fails (token fully expired).
      we sync context state here so the UI reflects the logged-out state before the redirect kicks in.
   */
   useEffect(() => {
      const handleSessionExpired = () => {
         setUser(null);
         setIsAuthenticated(false);
         setSessionExpired(true);
      };

      window.addEventListener('auth:session-expired', handleSessionExpired);
      return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
   }, []);

   // login function to call after successful authentication
   // this updates state and localStorage in one place, so we don't forget a step
   const login = useCallback((accessToken, userData) => {
      localStorage.setItem('authToken', accessToken);
      // cache user data so the app can render immediately on next load without waiting for /auth/me (avoids flash of empty UI).
      // optionally storing user data in localStorage too, for quick access without api call
      // this is a tradeoff: faster access vs potential stale data, choose your poison
      localStorage.setItem('use', JSON.stringify(userData));
      setUser(userData);
      
      // if (userData) localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setSessionExpired(false);
   }, []);

   // logout function, clears everything and calls backend to invalidate token
   // async because we might need to wait for backend confirmation
   const logout = useCallback(async () => {
      try {
         await logoutApi(); // this clears localStorage in auth.js
      } finally {
         setUser(null);
         setIsAuthenticated(false);
         // note: we don't redirect here, let the component decide where to go after logout
         // more flexible, but you have to remember to navigate, so maybe add a default?
      }
   }, []);

   // function to update user profile data without re-fetching from backend
   // useful for optimistic updates or after editing profile
   // const updateProfile = (updatedData) => {
   //    // spreading previous user data with new updates, immutable update pattern
   //    setUser(prev => prev ? { ...prev, ...updatedData } : null);
   // };

   // called after profile edits so the navbar / dashboard reflect changes
   // without requiring a full re-login.
   const updateUser = useCallback((updatedFields) => {
      setUser((prev) => {
         const merged = { ...prev, ...updatedFields };
         localStorage.setItem('user', JSON.stringify(merged));
         return merged;
      });
   }, []);

   const value = {
      user,
      isAuthenticated,
      loading,
      sessionExpired,
      login,
      logout,
      updateUser,
   };

   // returning the context provider with all the auth stuff in the value object
   // any component wrapped by this provider can now use useAuth() to get these values
   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   );
};

export default AuthContext;

