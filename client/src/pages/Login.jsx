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
import { FormGroup, FormLabel, FormInput, FormInputWrapper, PasswordToggle, FormOptions, CheckboxLabel, Checkbox, ForgotLink, LoginButton, } from '../styles/Form.styles';
import { CheckmarkSVG } from '../components/SVGs';
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

import useSessionExpiry from '../hooks/useSessionExpiry';

// the main login component function
// this is where the magic (and bugs) happen
const Login = () => {
   // state for the username/email field, because users can't decide which one to use
   // and we're cool with that, i guess
   // const [identifier, setIdentifier] = useState(''); // can be email or username
   const [email, setEmail] = useState('');
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

         const { accessToken, user } = await loginApi({ email, password });
         login(accessToken, user);           // stores token + updates AuthContext
         navigate('/dashboard', { replace: true });      

      } catch (error) {
         if (error.status === 401 || error.response?.status === 401) {
         setToast({ type: 'error', message: 'Invalid credentials. Please check your username/email and password.' });
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
         <Navbar />
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
                     <FormLabel htmlFor="identifier">Username or Email</FormLabel>
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
                     <CheckboxLabel>
                        {/* checkbox bound to rememberMe state, currently does nothing */}
                        {/* todo: actually implement remember me or remove this */}
                        <Checkbox
                           type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                        <span>Remember me</span>
                     </CheckboxLabel>
                      {/* forgot password link, currently just an anchor, no functionality */}
                     {/* todo: wire this up to forgot password flow */}
                     <ForgotLink href="#forgot">Forgot password?</ForgotLink>
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
               <a href="#footer-privacy">Privacy</a>
               <a href="#footer-terms">Terms</a>
               <a href="#help">Help</a>
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

         {/* <Footer /> */}
      </LoginPageContainer>
   );
};

export default Login;
