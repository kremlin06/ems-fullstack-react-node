import { useContext } from 'react'
import AuthContext from './AuthContext'

// custom hook to consume the auth context
// this is the public api for other components to access auth state
// the error check ensures you don't use this outside the provider, which would break
export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) throw new Error('useAuth must be used within AuthProvider');
   return context;
};