import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/Global.styles';
import ThemeProvider from './contexts/ThemeProvider'; 
import { useTheme } from './hooks/useTheme';           
// import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
// import Navbar from './components/Navbar';
import ToastContainer from './components/ToastNotification';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CreateEvent from './pages/Admin/CreateEvent';
import Events from './pages/Admin/Events';

// this lazy loading is for speeding up the initial load time of the app by only loading the login page when it's needed,
// since the onboarding page is the first thing users see and it doesn't require the login page's code to be loaded immediately.
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

const AppContent = () => {
  const { theme } = useTheme();

  // defuckingbugging: check if time has transitions before rendering the app.
  if (!theme || !theme.transitions) {
    console.log('Theme or theme.transitions is undefined!', theme);
    return <div style={{background: 'white', height: '100vh'}}>Loading Theme...</div>
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
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={
          <Suspense fallback={<div>Loading...</div>}>
            <Login />
            <Footer />
          </Suspense>
        } />
        <Route path="/signup" element={
          <Suspense fallback={<div>Loading...</div>}>
            <Signup />
            <Footer />
          </Suspense>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <Dashboard/>
              <Footer />
            </Suspense>
          </ProtectedRoute>
        } />  
        <Route path="/dashboard/events/new" element={
          <ProtectedRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <CreateEvent />
              <Footer />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/events" element={
          <ProtectedRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <Events />
              <Footer />
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