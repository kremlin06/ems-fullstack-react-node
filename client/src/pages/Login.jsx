// importing react hooks because we need state management and side effects
// if you don't know what useState is, go watch a 10min tutorial first, seriously   
import { useState } from 'react';
// navbar component, just the top bar, nothing fancy
import Navbar from '../components/Navbar';
// footer is commented out, probably because login page doesn't need it? makes sense i guess
// import Footer from '../components/Footer';

// importing all the styled components for layout
// yes, there's a lot of them. welcome to styled-components. deal with it.
import { LoginPageContainer, LoginContainer, LoginWrapper, LoginInfo, LoginTitle, LoginDescription, LoginFeatures, LoginFeature, LoginFormContainer, LoginBox, LoginHeading, LoginForm, LoginFooter, LoginBottomLinks, } from '../styles/Login.styles';

// form-specific styled components, because apparently we can't just use normal css
// (we could, but then we'd have to think about class names, and nobody has time for that)
import { FormGroup, FormLabel, FormInput, FormInputWrapper, PasswordToggle, FormOptions, CheckboxLabel, Checkbox, ForgotLink, LoginButton, SecurityNote, } from '../styles/Form.styles';
import { CheckmarkSVG, ShieldCheckSVG } from '../components/SVGs';
import LoadingSpinner from '../components/LoadingSpinner';
// toast notifications, those little popups that say "hey dumbass, you messed up"
import ToastNotification from '../components/ToastNotification';
import { EyeSVG, EyeOffSVG } from '../components/SVGs';
// react router hook for navigation, because window.location is for the stone age
import { useNavigate } from 'react-router-dom';
// our auth service, where the actual api calls live (or mocks, depending on your luck)
import { loginApi } from '../services/auth';
import ToastContainer from '../components/ToastContainer';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
// legal modals — privacy policy and terms of service
import LegalModal from '../components/LegalModal';
// help modal — 5-section quick-reference guide for all roles
import HelpModal from '../components/HelpModal';

import useSessionExpiry from '../hooks/useSessionExpiry';

// the main login component function
// this is where the magic (and bugs) happen
const Login = () => {
   // state for the username/email field, because users can't decide which one to use
   // and we're cool with that, i guess
   const [email, setEmail] = useState('');
   // const [identifier, setIdentifier] = useState(''); // can be email or username
   const [password, setPassword] = useState('');

   // remember me checkbox state
   // fun fact: we're not actually implementing "remember me" yet, so this does nothing
   // but the ui looks pretty, so who cares?
   const [rememberMe, setRememberMe] = useState(false);
   const [showPassword, setShowPassword] = useState(false);

   // loading state for the button, so users don't spam click and crash our backend
   // (they will anyway, but at least we tried)
   const [isLoading, setIsLoading] = useState(false);

   // toast notification state, for showing errors or success messages
   // null means no toast, object means show toast
   const [toast, setToast] = useState(null);

   // which bottom-link modal is currently open: null | 'privacy' | 'terms' | 'help'
   const [activeModal, setActiveModal] = useState(null);
   const closeModal = () => setActiveModal(null);

   // navigate hook from react router, for redirecting after login
   // use this instead of window.location or you'll break the single page app magic
   const navigate = useNavigate();
   const { login } = useAuth();

   // the main login handler, triggered when form is submitted
   // async because we're waiting for an api call, obviously
   const handleSubmit = async (e) => {
      // prevent default form submission, or the page will refresh and we lose all our state
      // learned this the hard way, don't be like me
      e.preventDefault();

      // set loading to true, disable the button, show spinner
      // basic ux, don't skip this or users will think the app froze
      setIsLoading(true);
      
      try {
         // const response = await loginApi({ identifier, password });
         // login(response.token, response.user);
         // navigate('/dashboard', { replace: true });

         // added: pass rememberMe to the API (backend decides persistent vs session cookie)
         // and to login() (frontend decides localStorage vs sessionStorage for the access token).
         const { accessToken, user } = await loginApi({ email, password, rememberMe });
         login(accessToken, user, rememberMe);

         // old: only two destinations — attendees vs everyone-else-to-/dashboard
         // problem: staff was lumped with admin and sent to /dashboard, but the
         //          dashboard page itself kicks non-admin/organizer users out,
         //          which caused an infinite redirect loop:          //          /dashboard -> /attendee/portal -> /dashboard -> ...
         // fix: send each role to its own correct home page.
         //   admin / organizer -> /dashboard       (admin overview)
         //   staff             -> /staff/dashboard (staff home/landing page)
         //   attendee          -> /attendee/portal (attendee home)
         const role = user?.role;
         if (role === 'Attendee') {
           navigate('/attendee/portal', { replace: true });
         } else if (role === 'Staff') {
           navigate('/staff/dashboard', { replace: true });
         } else {
           // admin and organizer share the admin dashboard
           navigate('/dashboard', { replace: true });
         }

      } catch (error) {
         const status = error.response?.status ?? error.status;
         if (status === 401) {
            setToast({ type: 'error', message: 'Invalid credentials. Please check your email and password.' });
         } else if (status === 429) {
            setToast({ type: 'warning', message: 'Too many login attempts. Please wait a moment and try again.' });
         } else {
            setToast({ type: 'error', message: 'Something went wrong. Please try again.' });
         }
         console.error('Login error:', error);
      } finally {
         setIsLoading(false);
      }

      // try {
      //    // we will simulate API call here for now then we will replace this with actual fetch/axios call to our backend.
      //    // calling our auth service function
      //    // this is either a mock or a real api call, depending on which version is uncommented in auth.js
      //    // pray it's the right one
      //    const response = await loginApi({ identifier, password });

      //    // checking if response is ok
      //    // note: our mock returns { ok: true }, real api might use status codes
      //    // consistency is for people who plan ahead
      //    if (response.ok) {
      //       // logging success to console, because console.log is our debugger now
      //       // don't leave this in production, but for now, whatever
      //       console.log('Login successful:', response.data);
      //       // window.Location.href = '/dashboard'; or use React Router navigate

      //       // storing the token in localStorage
      //       // yes, localStorage has security issues, but we'll deal with that later
      //       // if you're reading this in production and we still use localStorage, i'm sorry
      //       localStorage.setItem('authToken', response.data.token);

      //       // navigating to dashboard, replace: true so user can't go back to login with back button
      //       // small ux win, you're welcome
      //       navigate("/dashboard", { replace: true });
      //    }
      // } catch (error) {
      //    // error handling time
      //    // checking for 401 unauthorized, the most common login error
      //    // error structure might vary between mock and real api, hence the optional chaining
      //    if (error.status === 401 || error.response?.status === 401) {
      //       // setting error toast for invalid credentials
      //       // generic message, don't reveal if username or password was wrong (security 101)
      //       setToast({
      //          type: 'error',
      //          message: 'Invalid Credentials. Please check your username/email and password.'
      //       });
      //    } else {
      //       // catch-all for other errors (network issues, server down, etc)
      //       // vague message because users don't need to know our backend is on fire
      //       setToast({
      //          type: 'error',
      //          message: 'Something went wrong. Please try again.'
      //       });
      //    }
      //    // logging the full error to console for debugging
      //    // this is where we'll spend 2 hours when something breaks, good luck
      //    console.error('Login error:', error);
      // } finally {
      //    // no matter what happened, turn off loading state
      //    // otherwise button stays disabled forever and users rage quit
      //    setIsLoading(false);
      // }
   };

   // simple toggle function for password visibility
   // could be one line, but breaking it out makes it easier to add logic later
   // (we won't, but pretend we're forward-thinking)
   const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev);
   };

   // function to close toast notification
   // just sets toast back to null, which conditionally removes it from the dom
   const closeToast = () => setToast(null);

   // commented out https warning, probably for production use
   // {!window.location.protocol.startsWith('https') && process.env.NODE_ENV === 'production' && (
   //    <div style={{
   //       background: '#fff3e0',
   //       color: '#e65100',
   //       padding: '0.75rem 1rem',
   //       textAlign: 'center',
   //       fontSize: '0.875rem',
   //       borderBottom: '1px solid #ffe0b2'
   //    }}>
   //       ⚠️ For security, this page should be accessed via HTTPS
   //    </div>
   // )}

   useSessionExpiry(() =>
      setToast({ type: 'warning', message: 'Your session has expired. Please log in again.' })
   );
   return (
      <LoginPageContainer id="login">
         {/* pass onHelpClick so the navbar "Help" link opens the same modal as the bottom links */}
         <Navbar onHelpClick={() => setActiveModal('help')} />
         <LoginContainer>
            <LoginWrapper>
           
            {/* left side: app description and features */}
            {/* basically marketing fluff to convince users this login is worth their time */}
            <LoginInfo>
               <LoginTitle>Event Management System</LoginTitle>
               <LoginDescription>
               Centralized platform for campus events, attendance tracking, and analytics.
               </LoginDescription>

               <LoginFeatures>
                  <LoginFeature>
                     <CheckmarkSVG />
                     <span>Quick event creation</span>
                  </LoginFeature>
                  <LoginFeature>
                     <CheckmarkSVG />
                     <span>Real-time analytics</span>
                  </LoginFeature>
                  <LoginFeature>
                     <CheckmarkSVG />
                     <span>Seamless integration</span>
                  </LoginFeature>
               </LoginFeatures>
            </LoginInfo>

            {/* right side: the actual login form */}
            <LoginFormContainer>
               <LoginBox>
                  <LoginHeading>Welcome Back!</LoginHeading>

                  <LoginForm onSubmit={handleSubmit}>
                     <FormGroup>
                     <FormLabel htmlFor="email">Username or Email</FormLabel>
                     {/* input bound to identifier state, controlled component pattern */}
                     {/* autoComplete="username" helps browsers autofill, small ux win */}
                     <FormInput
                        type="text"
                        id="email"
                        placeholder="Enter your username or email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="username"
                     />
                  </FormGroup>

                  <FormGroup>
                     <FormLabel htmlFor="password">Password</FormLabel>
                     <FormInputWrapper>
                        {/* password input, type toggles between text/password */}
                        {/* $hasToggle is a styled-components prop, don't ask */}
                        <FormInput
                           type={showPassword ? 'text' : 'password'}
                           id="password"
                           placeholder="Enter your password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required
                           $hasToggle={true}
                           autoComplete="current-password"
                        />
                        <PasswordToggle type="button" onClick={togglePasswordVisibility} aria-label={showPassword ? 'Hide password' : 'Show password'}> 
                           {showPassword ? <EyeOffSVG /> : <EyeSVG />}
                        </PasswordToggle> 
                     </FormInputWrapper>
                  </FormGroup>

                  <FormOptions>
                     {/* remember me — now functional. when checked:                          frontend: access token → localStorage (persists across restarts)
                         backend: receives rememberMe flag → sets persistent 30-day
                                   HTTP-only refresh cookie instead of a session cookie */}
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                     <CheckboxLabel htmlFor="remember-me">
                        <Checkbox
                           type="checkbox"
                           id="remember-me"
                           checked={rememberMe}
                           onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span>Remember me</span>
                     </CheckboxLabel>
                     {rememberMe && (
                        <SecurityNote>
                           <ShieldCheckSVG size={12} aria-hidden="true" />
                           Session persists for 30 days. Use only on your personal device.
                        </SecurityNote>
                     )}
                     </div>
                      {/* forgot password link, currently just an anchor, no functionality */}
                     {/* todo: wire this up to forgot password flow */}
                     <ForgotLink as={Link} to="/forgot-password">Forgot password?</ForgotLink>
                     </FormOptions>

                     {/* submit button, disabled while loading to prevent spam */}
                     {/* conditional rendering: spinner + text when loading, just text otherwise */}
                     <LoginButton type="submit" disabled={isLoading}>
                        {isLoading ? (
                           <>
                              <LoadingSpinner />
                              <span>Signing in...</span>
                           </>
                        ) : (
                           'Login'
                        )}   
                     </LoginButton>
                  </LoginForm>

               {/* footer text with signup link */}
               {/* href="#signup" is a placeholder, I should use react router link */}
               {/* todo: fix this to use <Link to="/signup"> later */}
               <LoginFooter>
                  <p>
                     Don't have an account? <Link to="/signup">Sign up</Link>
                  </p>
               </LoginFooter>
               </LoginBox>

               <LoginBottomLinks>
                  {/* old: anchor tags with hash hrefs — non-functional placeholder */}
                  {/* a11y: aria-label gives each button a fuller description than
                      the single-word visible text. screen readers will announce
                      "View Privacy Policy, button" instead of just "Privacy, button"
                      which gives users better context before they activate it. */}
                  <button
                     type="button"
                     onClick={() => setActiveModal('privacy')}
                     aria-label="View Privacy Policy"
                  >
                     Privacy
                  </button>
                  <button
                     type="button"
                     onClick={() => setActiveModal('terms')}
                     aria-label="View Terms of Service"
                  >
                     Terms
                  </button>
                  <button
                     type="button"
                     onClick={() => setActiveModal('help')}
                     aria-label="View Help and Support guide"
                  >
                     Help
                  </button>
               </LoginBottomLinks>
               </LoginFormContainer>
            </LoginWrapper>
         </LoginContainer>

         {/* conditional toast rendering */}
         {/* if toast is not null, render the toast container with notification */}
         {/* this is a simple toast system, not fancy but it works */}
         {toast && (
            <ToastContainer>
               <ToastNotification message={toast.message} type={toast.type} onClose={closeToast} />
            </ToastContainer>
         )}

         {/* bottom-link modals — only one renders at a time based on activeModal */}
         {activeModal === 'privacy' && (
            <LegalModal type="privacy" onClose={closeModal} />
         )}
         {activeModal === 'terms' && (
            <LegalModal type="terms" onClose={closeModal} />
         )}
         {/* old: HelpModal had its own overlay + managed isOpen via conditional render.
             new: it wraps the shared <Modal> component, so it receives isOpen + onClose. */}
         <HelpModal isOpen={activeModal === 'help'} onClose={closeModal} />

         {/* <Footer /> */}
      </LoginPageContainer>
   );
};

export default Login;