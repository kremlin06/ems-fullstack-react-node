import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LoginPageContainer, LoginContainer, LoginWrapper, LoginInfo, LoginTitle, LoginDescription, LoginFeatures, LoginFeature, LoginFormContainer, LoginBox, LoginHeading, LoginForm, LoginFooter, LoginBottomLinks, } from '../styles/Login.styles';
import { FormGroup, FormLabel, FormInput, FormOptions, CheckboxLabel, Checkbox, ForgotLink,LoginButton, } from '../styles/Form.styles';
import { CheckmarkSVG } from '../components/SVGs';

const Login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [rememberMe, setRememberMe] = useState(false);

   const handleLogin = (e) => {
      e.preventDefault();
      console.log('Login with:', { email, password, rememberMe });
      // Add API call here
   };

  return (
   <LoginPageContainer id="login">
      <Navbar />
      <LoginContainer>
         <LoginWrapper>
          {/* Left Side - Info */}
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

          {/* Right Side - Login Form */}
         <LoginFormContainer>
            <LoginBox>
               <LoginHeading>Welcome Back!</LoginHeading>

               <LoginForm onSubmit={handleLogin}>
                  <FormGroup>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormInput
                     type="email"
                     id="email"
                     placeholder="Enter your email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                  />
               </FormGroup>

               <FormGroup>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormInput
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                  />
               </FormGroup>

               <FormOptions>
                  <CheckboxLabel>
                     <Checkbox
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                     />
                    Remember me
                  </CheckboxLabel>
                  <ForgotLink href="#forgot">Forgot password?</ForgotLink>
                  </FormOptions>

                  <LoginButton type="submit">Login</LoginButton>
               </LoginForm>

              <LoginFooter>
               <p>
                  Don't have an account? <a href="#signup">Sign up</a>
               </p>
              </LoginFooter>
            </LoginBox>

            <LoginBottomLinks>
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="#help">Help</a>
            </LoginBottomLinks>
            </LoginFormContainer>
         </LoginWrapper>
      </LoginContainer>
      <Footer />
      </LoginPageContainer>
   );
};

export default Login;