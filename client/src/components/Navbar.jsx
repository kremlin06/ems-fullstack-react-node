import { Nav, NavContainer, NavBrand, BrandName, NavLinks, NavLink, MobileMenuBtn, MobileMenu, MobileMenuOverlay, } from '../styles/Navbar.styles';
import Button from './Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
// added: useState/useEffect to drive the functional mobile hamburger menu
import { useState, useEffect } from 'react';
// ADDED: ThemeToggle for the Attendee Portal navbar section (spec requirement)
import ThemeToggle from './ThemeToggle';
// ADDED: BellSVG for the notification link icon
import { BellSVG } from './SVGs';

// onHelpClick — optional callback. when provided (login page passes setActiveModal('help'))
// the navbar Help link fires it instead of following an anchor href.
const Navbar = ({ onHelpClick } = {}) => {
   // we are tracking the url. 'useLocation' gives us the current URL. this hook detects where the user is (e.g., /login or /)
   // we use this so the Navbar can change its appearance based on the current page.
   const location = useLocation();
   const navigate = useNavigate();
   const { isAuthenticated, user, logout } = useAuth(); // grab auth state

   // added: mobile menu open/close state
   const [menuOpen, setMenuOpen] = useState(false);

   // close the mobile menu whenever the route changes (e.g. user taps a link)
   useEffect(() => {
      setMenuOpen(false);
   }, [location.pathname]);

   // lock body scroll while the mobile menu is open so the page behind doesn't move
   useEffect(() => {
      document.body.style.overflow = menuOpen ? 'hidden' : '';
      return () => { document.body.style.overflow = ''; };
   }, [menuOpen]);

   // we create a boolean constant. If this is true, we know to hide landing-page
   // specific links (like #features) and show auth-specific buttons instead.
   const isLoginPage          = location.pathname === '/login';
   const isSignupPage         = location.pathname === '/signup';
   // old: only /login and /signup were treated as auth pages, so /forgot-password
   //      and /reset-password/:token fell through to the landing-page nav (Features,
   //      How it Works, Manifesto, Get Started) — wrong for a password reset screen.
   const isForgotPasswordPage = location.pathname === '/forgot-password';
   const isResetPasswordPage  = location.pathname.startsWith('/reset-password');
   const isAuthPage = (
     isLoginPage || isSignupPage || isForgotPasswordPage || isResetPasswordPage
   );
   const isDashboardPage = location.pathname.startsWith('/dashboard');
   const isEventsPage = location.pathname === '/Admin/events';
   const isCreateEventPage = location.pathname === '/dashboard/events/new';
   const isAnalyticsPage = location.pathname === '/dashboard/analytics';

   // ADDED: detect attendee portal pages so we show the correct nav links
   const isAttendeePage = location.pathname.startsWith('/attendee');

   // yes, we could make this a switch statement, but three booleans is clearer
   // if you refactor this and break the logic, you get to debug it at 2am

   // handle logout - clear auth state and redirect
   // if we forget to call logout() from context, tokens stay in localStorage forever
   // and that's a security issue, so don't skip this
   const handleLogout = async () => {
      await logout(); // this clears localStorage and updates context
      navigate('/login', { replace: true }); // force redirect, no back button shenanigans
   };

   // navItems holds the full link set so we can render it in BOTH the desktop
   // <NavLinks> row and the mobile <MobileMenu> drawer without duplicating logic.
   const navItems = (
      <>
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
                     {/* old: href="#help" was a dead anchor — scrolled nowhere and didn't open the modal.
                         now: if the parent (Login.jsx) passes onHelpClick, the link fires it instead
                         so clicking "Help" in the navbar opens the same Help modal as the bottom link. */}
                     {onHelpClick
                       ? <NavLink as="button" onClick={onHelpClick} style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>Help</NavLink>
                       : <NavLink href="#help">Help</NavLink>
                     }
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

               {/* FORGOT PASSWORD / RESET PASSWORD MODE: just a back to login link */}
               {/* old: these routes had no nav block so the landing-page links showed instead */}
               {(isForgotPasswordPage || isResetPasswordPage) && (
                  <NavLink as={Link} to="/login">Back to Login</NavLink>
               )}


               {/* DASHBOARD / AUTHENTICATED MODE: admin nav */}
               {/* this is where admins live, show event management links + user menu */}
               {isAuthenticated && (
                  <>
                     {/* ADMIN / STAFF / ORGANIZER NAV — show only on /dashboard* pages */}
                     {/* OLD: was unconditionally for all authenticated users on dashboard pages */}
                     {/* MODIFIED: now also checks role is not Attendee */}
                     {isDashboardPage && user?.role !== 'Attendee' && (
                        <>
                           <NavLink
                              as={Link}
                              to="/dashboard"
                              className={location.pathname === '/dashboard' ? 'active' : ''}
                           >
                              Dashboard
                           </NavLink>
                           <NavLink
                              as={Link}
                              to="/Admin/events"
                              className={isEventsPage || isCreateEventPage ? 'active' : ''}
                           >
                              Events
                           </NavLink>
                           <NavLink
                              as={Link}
                              to="/dashboard/analytics"
                              className={isAnalyticsPage ? 'active' : ''}
                           >
                              Analytics
                           </NavLink>
                        </>
                     )}

                     {/* Quick Create Event button — admin/staff/organizer on dashboard pages only */}
                     {/* OLD: was for all authenticated users on dashboard pages */}
                     {/* MODIFIED: guard added so Attendees never see this button */}
                     {isDashboardPage && user?.role !== 'Attendee' && (
                        <Button
                           as={Link}
                           variant="primary"
                           to="/dashboard/events/new"
                           size="sm"
                        >
                           + Create Event
                        </Button>
                     )}

                     {/* ADDED: ATTENDEE NAV — show only on /attendee* pages for Attendee role */}
                     {/* Matches NotebookLM spec: Dashboard, Register, My QR Code, History, Notifications */}
                     {isAttendeePage && user?.role === 'Attendee' && (
                        <>
                           <NavLink
                              as={Link}
                              to="/attendee/portal"
                              className={location.pathname === '/attendee/portal' ? 'active' : ''}
                           >
                              Dashboard
                           </NavLink>
                           <NavLink
                              as={Link}
                              to="/attendee/events"
                              className={location.pathname === '/attendee/events' ? 'active' : ''}
                           >
                              Register
                           </NavLink>
                           <NavLink
                              as={Link}
                              to="/attendee/qr"
                              className={location.pathname === '/attendee/qr' ? 'active' : ''}
                           >
                              My QR Code
                           </NavLink>
                           <NavLink
                              as={Link}
                              to="/attendee/history"
                              className={location.pathname === '/attendee/history' ? 'active' : ''}
                           >
                              History
                           </NavLink>
                           {/* ADDED: Notifications bell icon link — spec FR-08 */}
                           <NavLink
                              as={Link}
                              to="/attendee/notifications"
                              className={location.pathname === '/attendee/notifications' ? 'active' : ''}
                              aria-label="Notifications"
                              title="Notifications"
                              style={{ display: 'flex', alignItems: 'center' }}
                           >
                              <BellSVG size={18} />
                           </NavLink>
                           {/* ADDED: ThemeToggle in the Attendee Portal navbar — spec requirement */}
                           <ThemeToggle />
                        </>
                     )}

                     {/* User menu with logout — always visible for all authenticated users */}
                     {/* OLD: label was hardcoded 'Admin'. MODIFIED: falls back to 'User' for non-admins */}
                     {/* a11y: aria-label gives a complete description so screen readers
                         announce "Logout from account, button" rather than only reading
                         the visible text which includes the user's first name + bullet
                         character, which can sound odd when read aloud. */}
                     <NavLink
                        as="button"
                        onClick={handleLogout}
                        aria-label={`Logout from account (${user?.fullName?.split(' ')[0] || 'User'})`}
                        style={{
                           background: 'none',
                           border: 'none',
                           cursor: 'pointer',
                           padding: 0,
                           color: 'inherit',
                           fontSize: 'inherit'
                        }}
                     >
                        {user?.fullName?.split(' ')[0] || 'User'} • Logout
                     </NavLink>
                  </>
               )}
              


      </>
   );

   // 'as={Link}' tells Styled Components to behave like a React Router Link
   // this allows for SPA navigation (no full page reload)
   return (
      <Nav>
         <NavContainer>
            {/* Brand/Logo - always visible, always links to home */}
            {/* using as={Link} so react-router handles navigation without page reload */}
            <NavBrand as={Link} to="/">
               {/* <LogoSVG /> */}
               <BrandName>Event Management System</BrandName>
            </NavBrand>

            {/* desktop link row — hidden ≤968px via css */}
            <NavLinks>{navItems}</NavLinks>

            {/* hamburger — now functional; toggles the mobile drawer and morphs into an X */}
            <MobileMenuBtn
               aria-label="Toggle mobile menu"
               aria-expanded={menuOpen}
               $open={menuOpen}
               onClick={() => setMenuOpen((o) => !o)}
            >
               <span></span>
               <span></span>
               <span></span>
            </MobileMenuBtn>
         </NavContainer>

         {/* dimmed backdrop — tap anywhere outside the panel to close */}
         <MobileMenuOverlay $open={menuOpen} onClick={() => setMenuOpen(false)} />

         {/* slide-down mobile drawer — closes when a link/button inside is tapped */}
         <MobileMenu
            $open={menuOpen}
            onClick={(e) => { if (e.target.closest('a, button')) setMenuOpen(false); }}
         >
            {navItems}
         </MobileMenu>
      </Nav>
   );
};

export default Navbar;