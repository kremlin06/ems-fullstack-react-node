import { Nav, NavContainer, NavBrand, BrandName, NavLinks, NavLink, MobileMenuBtn, } from '../styles/Navbar.styles';
import Button from './Button';
// import ThemeToggle from './ThemeToggle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

const Navbar = () => {
   // we are tracking the url. 'useLocation' gives us the current URL. this hook detects where the user is (e.g., /login or /)
   // we use this so the Navbar can change its appearance based on the current page.
   const location = useLocation();
   const navigate = useNavigate();
   const { isAuthenticated, user, logout } = useAuth(); // grab auth state 

   // we create a boolean constant. If this is true, we know to hide landing-page
   // specific links (like #features) and show login-specific buttons instead.
   const isAuthPage = ['/login', '/signup'].includes(location.pathname);
   const isDashboard = location.pathname.startsWith('/dashboard')
   const isLoginPage = location.pathname === '/login';
   const isSignupPage = location.pathname === '/signup';

   // yes, we could make this a switch statement, but three booleans is clearer
   // if you refactor this and break the logic, you get to debug it at 2am

   // handle logout - clear auth state and redirect
   // if we forget to call logout() from context, tokens stay in localStorage forever
   // and that's a security issue, so don't skip this
   const handleLogout = async () => {
      await logout(); // this clears localStorage and updates context
      navigate('/login', { replace: true }); // force redirect, no back button shenanigans
   };

   // 'as={Link}' tells Styled Components to behave like a React Router Link
   // this allows for "Single Page Application" navigation (no full page reload)
   // <NavBrand as={Link} to="/">
   return (
      <Nav>
         <NavContainer>
            {/* Brand/Logo - always visible, always links to home */}
            {/* using as={Link} so react-router handles navigation without page reload */}
            {/* if you use <a href="/"> here, you'll break the SPA and i'll be sad */}
            <NavBrand as={Link} to="/">
               {/* <LogoSVG /> */}
               <BrandName>Event Management System</BrandName>
            </NavBrand>

            <NavLinks>
               {/* LANDING PAGE MODE: show features, how-it-works, cta */}
               {/* this is the default view for users who aren't logged in yet */}
               {!isAuthPage && !isAuthenticated && (
                  <>
                     <NavLink href="#features">Features</NavLink>
                     <NavLink href="#how-it-works">How it Works</NavLink>
                     <NavLink href="#footer-manifesto">Manifesto</NavLink>
                     <Button as={Link} variant="primary" to="/login">Get Started</Button>
                  </>
               )}
               
               {/* LOGIN PAGE MODE: minimal nav, just back + help */}
               {/* users on login page don't need marketing fluff, they just want to log in */}
               {isLoginPage && (
                  <>
                     <NavLink as={Link} to="/">Back to Home</NavLink>
                     <NavLink href="#help">Help</NavLink>
                  </>
               )} 

               {/* SIGNUP PAGE MODE: even more minimal, back + login link */}
               {/* if they're signing up, they might realize they already have an account */}
               {/* so we give them a quick path to login without leaving the flow */}
               {isSignupPage && (
                  <>
                  <NavLink as={Link} to="/">Back to Home</NavLink>
                  <NavLink as={Link} to="/login">Already have an account?</NavLink>
                  </>
               )}


               {/* DASHBOARD / AUTHENTICATED MODE: admin nav */}
               {/* this is where admins live, show event management links + user menu */}
               {isAuthenticated && (
                  <>
                  {/* only show these if user is actually on dashboard or event pages */}
                  {isDashboard && (
                     <>
                        <NavLink as={Link} to="/dashboard" className="active">Dashboard</NavLink>
                        <NavLink as={Link} to="/dashboard/events">Events</NavLink>
                        <NavLink as={Link} to="/dashboard/analytics">Analytics</NavLink>
                     </>
                  )}

                  {/* Quick Create Event button, primary action for admins */}
                  <Button as={Link} variant="primary" to="/dashboard/events/new" size="sm"
                  >
                     + Create Event
                  </Button>
                  
                  {/* User menu: show name + logout */}
                  {/* if you want a dropdown, add it later, but this works for now */}
                  <NavLink as="button" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                     {user?.fullName?.split(' ')[0] || 'Admin'} • Logout
                  </NavLink>
                  </>
               )}


               {/* {!isLoginPage ? (
                  <Button as={Link} variant="primary" to="/">Sign up</Button>
               ) : (
                  <>
                     <NavLink as={Link} to="/login">Login</NavLink>
                     <Button as={Link} variant="primary" to="/login">Get Started</Button>
                  </>
               )}    */}
            {/* <ThemeToggle /> */}
            </NavLinks>   
            
            {/* mobile menu button - hidden on desktop, visible on mobile via css */}
            {/* we're not implementing the mobile menu yet, so this is just a placeholder */}
            {/* todo: add mobile menu dropdown or drawer, but not today */}
            <MobileMenuBtn aria-label="Toggle mobile menu">
               <span></span>
               <span></span>
               <span></span>
            </MobileMenuBtn>
         </NavContainer>
      </Nav>
   );
};

export default Navbar;