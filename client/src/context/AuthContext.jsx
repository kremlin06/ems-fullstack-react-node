// importing react hooks we need
// createContext for making the auth context, useContext for consuming it
// useState for local state, useEffect for side effects like checking auth on mount
import { createContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutApi } from '../services/auth';

// creating the auth context with null default value
// this will be replaced by the provider's value when components consume it
// the null default is intentional, so useAuth() throws if used outside provider
const AuthContext = createContext(null);

// the provider component that wraps our app and supplies auth state to all children
// this is where we manage the global auth state, so any component can access it
export const AuthProvider = ({ children }) => {
   // state for the current user object, null if not logged in
   const [user, setUser] = useState(null);

   // boolean state for auth status, derived from user but explicit for clarity
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   
   // loading state for initial auth check, so we don't redirect before knowing if user is logged in
   const [loading, setLoading] = useState(true);

   // effect that runs once on mount to check if user is already authenticated
   // this is the "remember me" logic, but using localStorage instead of cookies
   useEffect(() => {
      const initAuth = async () => {
         // getting token from localStorage, the one we saved on login
         const token = localStorage.getItem('authToken');
         // if token exists, try to fetch current user data to validate it
         if (token) {
            try {
               // calling api to get current user, this will fail if token is expired/invalid
               const userData = await getCurrentUser();
               // if successful, set user state and mark as authenticated
               setUser(userData);
               setIsAuthenticated(true);
            } catch (error) {
               // if it fails, token is bad, so clear it and stay logged out
               // logging error for debugging, but not showing to user (they don't care)
               console.error('Auth initialization failed:', error);
               localStorage.removeItem('authToken');
            } finally {
            // done checking, set loading to false so app can render
            // this prevents flickering or wrong redirects on page load
            setLoading(false);
            }
         }
     
      };
      initAuth();
   }, []); // empty deps array = run once on mount, like componentDidMount

   // login function to call after successful authentication
   // this updates state and localStorage in one place, so we don't forget a step
   const login = (token, userData) => {
      localStorage.setItem('authToken', token);
      // optionally storing user data in localStorage too, for quick access without api call
      // this is a tradeoff: faster access vs potential stale data, choose your poison
      if (userData) localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
   };

   // logout function, clears everything and calls backend to invalidate token
   // async because we might need to wait for backend confirmation
   const logout = async () => {
      await logoutApi(); // this clears localStorage in auth.js
      setUser(null);
      setIsAuthenticated(false);
      // note: we don't redirect here, let the component decide where to go after logout
      // more flexible, but you have to remember to navigate, so maybe add a default?
   };

   // function to update user profile data without re-fetching from backend
   // useful for optimistic updates or after editing profile
   const updateProfile = (updatedData) => {
      // spreading previous user data with new updates, immutable update pattern
      setUser(prev => prev ? { ...prev, ...updatedData } : null);
   };

   // returning the context provider with all the auth stuff in the value object
   // any component wrapped by this provider can now use useAuth() to get these values
   return (
      <AuthContext.Provider
         value={{
         user,
         isAuthenticated,
         loading,
         login,
         logout,
         updateProfile,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};

export default AuthContext;
