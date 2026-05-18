import { createContext, useState, useEffect } from 'react';
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
            //  } finally {
            // // done checking, set loading to false so app can render
            // // this prevents flickering or wrong redirects on page load
            // setLoading(false);
            }
         }
         setLoading(false);
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


/*
   okay, buckle up, because this one-liner is doing way more heavy lifting than it looks like
   and if you don't get how functional state updates work, you're about to have a bad time

   setUser(prev => prev ? { ...prev, ...updatedData } : null);

   breakdown, because apparently we can't trust anyone to just "know" this stuff:

   - setUser() is the state setter from useState, standard react boilerplate
   but here we're passing a FUNCTION instead of a direct value
   why? because we need the PREVIOUS state value, and react guarantees this is the freshest copy
   if you just did setUser({ ...user, ...updatedData }) you might be working with stale state
   and then you'll wonder why your ui doesn't update and you'll spend 3 hours debugging
   don't be that person. use the functional update form. end of story.

   - (prev => ...) is an arrow function that receives the current state value as 'prev'
   'prev' is just a variable name, could be 'banana' for all react cares, but let's be professionals
   this function runs right before react commits the state update, so it's always in sync
   if you're not sure why that matters, imagine two state updates firing in quick succession
   yeah. exactly. that's why.

   - prev ? ... : null is a ternary operator, aka "the if-else that got lazy and moved to one line"
   it checks: is there a previous user object? (is prev truthy?)
   if YES: do the spread magic below
   if NO: just return null, because we can't update properties on nothing, genius

   - { ...prev, ...updatedData } is the spread operator doing its thing
   first, ...prev copies all existing properties from the old user object into a new object
   then, ...updatedData copies the new/changed properties ON TOP of that
   this means updatedData will OVERWRITE any matching keys from prev
   example: if prev has { name: 'john', role: 'user' } and updatedData is { role: 'admin' }
   result is { name: 'john', role: 'admin' } -- see? role got updated, name stayed
   this is immutable update pattern, because react state must be treated as read-only
   if you mutate state directly (user.role = 'admin'), react won't re-render and you'll cry
   yes, i've seen it happen. no, i didn't enjoy debugging it.

   - the whole thing returns a brand new object, which setUser then uses to update state
   new object = new reference = react sees a change = component re-renders
   same reference = react shrugs and does nothing = you think your code is broken
   it's not broken. you just don't understand referential equality. yet.

   - why not just do setUser(updatedData)? 
   because updatedData might only have a subset of fields (like just { role: 'admin' })
   and if you replace the whole user object with just that, you lose name, email, preferences, etc
   then the ui breaks, users complain, and guess who gets paged at midnight?
   yeah. me. because you didn't spread the previous state.

   - why the null fallback? 
   because if user is somehow null (edge case, race condition, user logged out mid-update, whatever)
   we don't want to crash trying to spread null (which throws "cannot spread non-iterable")
   so we gracefully return null, which keeps state consistent (still logged out)
   defensive programming, look it up.

   tl;dr: this line safely merges new data into the existing user state without mutation,
         handles the edge case where user doesn't exist, and uses react's functional update
         pattern to avoid stale state bugs. if you change this without understanding why,
         you're volunteering to debug auth issues on a friday afternoon. your call.
   */