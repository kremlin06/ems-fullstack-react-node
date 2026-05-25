import { useState, useMemo, useCallback } from 'react';
import { validateSignupForm } from '../utils/validators';

export const useSignupForm = (initialValues = {}, options = {}) => {

   // form state object - now with required fields for our database 
   // yes, we removed 'username' because StudentID is the real identifier
   // if you add fields back without checking the schema, you're creating tech debt
   const [formData, setFormData] = useState({
      fullName: '',        // required - stored in User.fullName
      email: '',           // required - unique, campus email format
      studentId: '',       // CRITICAL - used for Student Directory Lookup, prevents duplicates
      department: '',      // required - categorizes attendee in campus structure
      password: '',        // required - will be hashed with bcryptjs on backend
      confirmPassword: '', // required - must match password
      agreeToTerms: false, // required - legal compliance
      ...initialValues,
   });
   
   const [errors, setErrors] = useState({});
   const [isLoading, setIsLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   // Password strength calculation
   const passwordStrength = useMemo(() => {
      const pwd = formData.password;
      if (!pwd) return '';
      let strength = 'weak';
      if (pwd.length >= 8) strength = 'medium';
      if (pwd.length >= 12 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) {
         strength = 'strong';
      }
      return strength;
   }, [formData.password]);

   // Generic change handler
   const handleChange = useCallback((e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: type === 'checkbox' ? checked : value,
      }));
      // this does ano, when user types to clear one field's error
      if (errors[name]) {
         setErrors(prev => ({ ...prev, [name]: null }));
      }
   }, [errors]);

   // Validation wrapper
   const validate = useCallback(() => {
      const validationErrors = validateSignupForm(formData, {
         allowedDepartments: options.allowedDepartments,
         requireCampusDomain: options.requireCampusDomain,
      });
      setErrors(validationErrors);
      return validationErrors;
   }, [formData, options]);

   // Toggle handlers
   const togglePasswordVisibility = useCallback(() => {
      setShowPassword(prev => !prev);
   }, []);
   
   const toggleConfirmPasswordVisibility = useCallback(() => {
      setShowConfirmPassword(prev => !prev);
   }, []);

   const reset = useCallback(() => {
      setFormData({
         fullName: '',
         email: '',
         studentId: '',
         department: '',
         password: '',
         confirmPassword: '',
         agreeToTerms: false,
      });
      setErrors({});
   }, []);

   return {
      formData,
      errors,
      isLoading,
      setIsLoading,
      showPassword,
      showConfirmPassword,
      passwordStrength,
      handleChange,
      validate,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
      reset,
      setFormData, 
      setErrors,  
   };
};