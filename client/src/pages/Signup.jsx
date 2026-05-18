import { useState } from 'react';
// react router hooks for navigation and linking between our auth pages
import { useNavigate, Link } from 'react-router-dom';
// our register api call, make sure the mock exists in auth.js
import { registerApi } from '../services/auth';
import { useAuth } from '../contexts/useAuth';

import { useSignupForm } from '../hooks/useSignupForm';

import ToastNotification from '../components/ToastNotification';
import ToastContainer from '../components/ToastContainer';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import { EyeSVG, EyeOffSVG, CheckmarkSVG } from '../components/SVGs';
import LegalModal from '../components/LegalModal';
import { SignupPageContainer, SignupContainer, SignupWrapper, SignupInfo, SignupTitle, SignupDescription, SignupFeatures, SignupFeature, SignupFormContainer, SignupBox, SignupHeading, SignupForm, SignupFooter, SignupBottomLinks, PasswordStrength, TermsCheckbox, TermsLink, } from '../styles/Signup.styles';
import { FormGroup, FormLabel, FormInput,FormInputWrapper, PasswordToggle, CheckboxLabel, Checkbox,SignupButton,ErrorMessage, FormSelect } from '../styles/Form.styles';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [openModal, setOpenModal] = useState(null); // modal state for terms/privacy
  const [toast, setToast] = useState(null);

  /*
  client-side validation - MANDATORY but NOT sufficient
  backend MUST re-validate everything, always, no exceptions
  if you remove a validation rule here, add it to the backend or we get hacked
  const validate = () => {
    const newErrors = {};

    Full Name validation - required, min 2 chars
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    Campus Email validation - required, must be @sti-college-balagtas.edu.ph or similar
    adjust the regex if your institution uses a different domain
    if (!formData.email.trim()) {
      newErrors.email = 'Campus email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    } else if (!formData.email.toLowerCase().includes('sti') && !formData.email.toLowerCase().includes('college')) {
      optional: enforce campus domain, remove if too strict for your use case
      newErrors.email = 'Please use your official campus email address';
    }



    /* StudentID validation, ^\d{7,10}$
   '^' start of string, '\d' any digit (0-9), '{7,10}' between 7 (1234567) and 10 (1234567890) times, '$' end of string
     example: STI-BAL-2024-00123 or just numeric like 202400123
     ADJUST THIS REGEX TO MATCH YOUR STUDENT ID FORMAT
    */

    /*
    commented for modified studentId validation
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (!/^(STI-)?[A-Z]{2,4}-?\d{4}-?\d{3,6}$/i.test(formData.studentId) && !/^\d{7,11}$/.test(formData.studentId)) {
      fallback: allow 7-10 digit numeric IDs if regex is too strict
      newErrors.studentId = 'Invalid Student ID format';
    }
    */
    /*
    // new studentId validation
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required.';
    } else {
      const format1 = /^(STI-)?[A-Z]{2,4}\d{4}-?{3,6}%/i; // STI-BAL-2026-00123
      const format2 = /^\d{7,11}$/; // 7-11 digit numeric (e.g., 02000341383)
    }

    if (!format1.test(formData.studentId) && !format2.test(formData.studentId)) {
      newErrors.studentId = 'Invalid Student ID format.';
    }

    // Department validation - required, must be one of the allowed values
    const allowedDepartments = ['BSIT', 'BSCS', 'BSBA', 'BSTM', 'BSHM', 'BSE', 'BEED', 'Other'];
    if (!formData.department) {
      newErrors.department = 'Please select your department';
    } else if (!allowedDepartments.includes(formData.department)) {
      newErrors.department = 'Invalid department selection';
    }



    // Password validation - required, min 8 chars, complexity rules
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm Password validation - must match exactly
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement - legally required, no bypass
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    return newErrors;
  }; */

  const {
    formData, errors, setErrors, isLoading, setIsLoading,
    showPassword, showConfirmPassword, passwordStrength,
    handleChange, validate, togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = useSignupForm({}, {
    allowedDepartments: ['BSIT', 'BSCS', 'BSBA', 'BSTM', 'BSHM', 'BSE', 'BEED', 'Other'],
  });

  // form submit handler, async because api call, obviously
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    // console.log('Validation errors:', validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      // console.log('Frontend validation failed:', validationErrors);
      setErrors(validationErrors);
      return;
    }

    // DEBUG: Log exactly what we're sending to the API
    /* 
    console.log('---------- SENDING TO API ----------');
    console.log({
      fullName: formData.fullName.trim(),
      email: formData.email.toLowerCase().trim(),
      studentId: formData.studentId.trim().toUpperCase(),
      department: formData.department, 
      password: formData.password ? '[REDACTED]' : '',
    });
    console.log('-------------------------------');
    */ 

    // logging this actual form data for debugging
    // console.log('---------- Form Data ----------');
    // console.log('fullname:', formData.fullName, '- trimmed:', formData.fullName.trim());
    // console.log('email:', formData.email, '- trimmed:', formData.email.trim());
    // console.log('studentId:', formData.studentId, '- trimmed:', formData.studentId.trim());
    // console.log('department:', formData.department);
    // console.log('password:', formData.password);
    // console.log('confirmPassword:', formData.confirmPassword);
    // console.log('agreeToTerms:', formData.agreeToTerms);
    // console.log('-------------------------------')

    setIsLoading(true);

    try {
      /* calling our register api with ALL required fields for our database schema
      note: we're NOT sending 'role', backend will auto-assign 'Attendee' for public signup
      if you need to send role, uncomment the line below and update backend to validate it */
      const response = await registerApi({
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        studentId: formData.studentId.trim().toUpperCase(), // normalize to uppercase for consistency
        department: formData.department,
        password: formData.password,
        // role: 'Attendee', // backend should default this, don't trust frontend
      });

      // auto-login after successful registration - seamless ux
      // this calls our context's login function, which sets token and user state
      login(response.token, response.user);
      setToast({ type: 'success', message: 'Account created successfully! Welcome to Event Management System.' });
      // navigate to dashboard immediately, no pointless delays
      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      // error handling - don't leak backend details to users
      let message = 'Registration failed. Please try again.';
      
      // handle specific error cases from backend
      if (error.response?.status === 409) {
        // 409 = Conflict, likely duplicate StudentID or Email
        const field = error.response?.data?.field;
        if (field === 'studentId') {
          message = 'This Student ID is already registered. Please use your official ID or contact support.';
          setErrors(prev => ({ ...prev, studentId: message }));
        } else if (field === 'email') {
          message = 'This email is already registered. Did you forget your password?';
          setErrors(prev => ({ ...prev, email: message }));
        }
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      setToast({ type: 'error', message });
      
      // handle field-specific errors from backend (if not already handled above)
      if (error.response?.data?.errors && !error.response?.data?.field) {
        const backendErrors = error.response.data.errors;
        const normalized = Array.isArray(backendErrors) 
          ? backendErrors.reduce((acc, err) => ({ ...acc, [err.field || 'general']: err.message }), {})
          : backendErrors;
        setErrors(normalized);
      }
    } finally {
      // always turn off loading, even on error, or button stays disabled forever
      setIsLoading(false);
    }
  };

  // password visibility toggle handlers
  // const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  // const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  // modal handlers for terms/privacy
  const openTermsModal = (e) => { e.preventDefault(); setOpenModal('terms'); };
  const openPrivacyModal = (e) => { e.preventDefault(); setOpenModal('privacy'); };
  const closeLegalModal = () => setOpenModal(null);

  // close toast handler
  const closeToast = () => setToast(null);

  // get strength text for display
  const getStrengthText = () => {
    if (!passwordStrength) return '';
    const texts = { weak: 'Weak password', medium: 'Medium strength', strong: 'Strong password' };
    return texts[passwordStrength] || '';
  };

  // department options - update this list to match your institution's actual departments
  // if you hardcode these, remember to update backend validation too
  const departmentOptions = [
    { value: '', label: 'Select your department' },
    { value: 'BSIT', label: 'BS in Information Technology' },
    { value: 'BSCS', label: 'BS in Computer Science' },
    { value: 'BSBA', label: 'BS in Business Administration' },
    { value: 'BSTM', label: 'BS in Tourism Management' },
    { value: 'BSHM', label: 'BS in Hospitality Management' },
    { value: 'BSE', label: 'Bachelor of Secondary Education' },
    { value: 'BEED', label: 'Bachelor of Elementary Education' },
    { value: 'Other', label: 'Other / Not Listed' },
  ];

  return (
    <SignupPageContainer id="signup">
      {/* HTTPS warning for production - uncomment if deploying without HTTPS */}
      {/* 
      {!window.location.protocol.startsWith('https') && process.env.NODE_ENV === 'production' && (
        <div style={{
          background: '#fff3e0',
          color: '#e65100',
          padding: '0.75rem 1rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          borderBottom: '1px solid #ffe0b2'
        }}>
          ⚠️ For security, this page should be accessed via HTTPS
        </div>
      )}
      */}
      
      <Navbar />
      
      <SignupContainer>
        <SignupWrapper>
          
          {/* left side: info and features */}
          <SignupInfo>
            <SignupTitle>Student Self-Registration</SignupTitle>
            <SignupDescription>
              Create your EMS account using your official Student ID. 
              This account will be used for event registration, attendance tracking, and campus analytics.
            </SignupDescription>

            <SignupFeatures>
              <SignupFeature>
                <CheckmarkSVG />
                <span>Register for campus events in seconds</span>
              </SignupFeature>
              <SignupFeature>
                <CheckmarkSVG />
                <span>QR code check-in for attendance</span>
              </SignupFeature>
              <SignupFeature>
                <CheckmarkSVG />
                <span>View your event history and certificates</span>
              </SignupFeature>
              <SignupFeature>
                <CheckmarkSVG />
                <span>Free for all STI College Balagtas students</span>
              </SignupFeature>
            </SignupFeatures>
          </SignupInfo>

          {/* right side: signup form */}
          <SignupFormContainer>
            <SignupBox>
              <SignupHeading>Create Your Account</SignupHeading>

              <SignupForm onSubmit={handleSubmit}>
                {/* Full Name field - required */}
                <FormGroup>
                  <FormLabel htmlFor="fullName">Full Name *</FormLabel>
                  <FormInput
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Angelo Esuma Santiago"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    $hasError={!!errors.fullName}
                  />
                  {errors.fullName && <ErrorMessage>{errors.fullName}</ErrorMessage>}
                </FormGroup>

                {/* Campus Email field - required, unique */}
                <FormGroup>
                  <FormLabel htmlFor="email">Campus Email *</FormLabel>
                  <FormInput
                    type="email"
                    id="email"
                    name="email"
                    placeholder="angeloe_santiago@sti-college-balagtas.edu.ph"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    $hasError={!!errors.email}
                  />
                  {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </FormGroup>

                {/* StudentID field - CRITICAL, used for directory lookup */}
                <FormGroup>
                  <FormLabel htmlFor="studentId">Student ID *</FormLabel>
                  <FormInput
                    type="text"
                    id="studentId"
                    name="studentId"
                    placeholder="STI-BAL-2024-00123 or 202400123"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                    autoComplete="off" // don't autofill student ID, too sensitive
                    $hasError={!!errors.studentId}
                  />
                  {errors.studentId && <ErrorMessage>{errors.studentId}</ErrorMessage>}
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: '2px' }}>
                    Used to verify your enrollment and prevent duplicate accounts
                  </small>
                </FormGroup>

                {/* Department dropdown - required for categorization */}
                <FormGroup>
                  <FormLabel htmlFor="department">Department *</FormLabel>
                  <FormSelect
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={(e) => {
                      console.log('Department changed to:', e.target.value); // debugger
                      handleChange(e); // calling main handler
                    }}
                    required
                    $hasError={!!errors.department}
                  >
                    {departmentOptions.map(opt => (
                      <option key={opt.value} value={opt.value} disabled={!opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </FormSelect>
                  {errors.department && <ErrorMessage>{errors.department}</ErrorMessage>}
                </FormGroup>

                {/* Password field with strength indicator */}
                <FormGroup>
                  <FormLabel htmlFor="password">Password *</FormLabel>
                  <FormInputWrapper>
                    <FormInput
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      $hasToggle={true}
                      $hasError={!!errors.password}
                      autoComplete="new-password"
                    />
                    <PasswordToggle 
                      type="button" 
                      onClick={togglePasswordVisibility} 
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    > 
                      {showPassword ? <EyeOffSVG /> : <EyeSVG />}
                    </PasswordToggle> 
                  </FormInputWrapper>
                  {passwordStrength && (
                    <PasswordStrength $strength={passwordStrength}>
                      {getStrengthText()}
                    </PasswordStrength>
                  )}
                  {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                </FormGroup>

                {/* Confirm Password field */}
                <FormGroup>
                  <FormLabel htmlFor="confirmPassword">Confirm Password *</FormLabel>
                  <FormInputWrapper>
                    <FormInput
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      $hasToggle={true}
                      $hasError={!!errors.confirmPassword}
                      autoComplete="new-password"
                    />
                    <PasswordToggle 
                      type="button" 
                      onClick={toggleConfirmPasswordVisibility} 
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    > 
                      {showConfirmPassword ? <EyeOffSVG /> : <EyeSVG />}
                    </PasswordToggle> 
                  </FormInputWrapper>
                  {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
                </FormGroup>

                {/* Terms and conditions checkbox - legally required */}
                <TermsCheckbox>
                  <Checkbox
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                  <CheckboxLabel htmlFor="agreeToTerms" style={{ margin: 0, fontSize: '0.875rem' }}>
                    I agree to the{' '}
                    <TermsLink href="#terms" onClick={openTermsModal}>
                      Terms of Service
                    </TermsLink>{' '}
                    and{' '}
                    <TermsLink href="#privacy" onClick={openPrivacyModal}>
                      Privacy Policy
                    </TermsLink>
                  </CheckboxLabel>
                </TermsCheckbox>
                {errors.agreeToTerms && <ErrorMessage>{errors.agreeToTerms}</ErrorMessage>}

                {/* Submit button - disabled while loading */}
                <SignupButton type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      <span>Verifying & creating account...</span>
                    </>
                  ) : (
                    'Create Account'
                  )}   
                </SignupButton>
              </SignupForm>

              {/* Footer with login link */}
              <SignupFooter>
                <p>
                  Already have an account? <Link to="/login">Login here</Link>
                </p>
              </SignupFooter>

              {/* Bottom links */}
              <SignupBottomLinks>
                <a href="#privacy" onClick={openPrivacyModal}>Privacy</a>
                <a href="#terms" onClick={openTermsModal}>Terms</a>
                <a href="#help">Help</a>
              </SignupBottomLinks>
            </SignupBox>
          </SignupFormContainer>
        </SignupWrapper>
      </SignupContainer>

      {/* Toast notifications */}
      {toast && (
        <ToastContainer>
          <ToastNotification message={toast.message} type={toast.type} onClose={closeToast} />
        </ToastContainer>
      )}

      {/* Legal modals - terms or privacy */}
      {openModal && (
        <LegalModal type={openModal} onClose={closeLegalModal} />
      )}
    </SignupPageContainer>
  );
};

export default Signup;