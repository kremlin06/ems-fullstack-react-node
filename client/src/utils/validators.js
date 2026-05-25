export const validateFullName = (value) => {
  if (!value?.trim()) return 'Full name is required';
  if (value.trim().length < 2) return 'Name must be at least 2 characters';
  return null;
};

export const validateEmail = (value, options = {}) => {
  const { requireCampusDomain = false } = options;
  if (!value?.trim()) return 'Campus email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
  if (requireCampusDomain && !value.toLowerCase().includes('sti')) {
    return 'Please use your official campus email address';
  }
  return null;
};

export const validateStudentId = (value) => {
  if (!value?.trim()) return 'Student ID is required';

  const format1 = /^(STI-)?[A-Z]{2,4}-?\d{4}-?\d{3,6}$/i;
  const format2 = /^\d{7,11}$/;
  if (!format1.test(value) && !format2.test(value)) {
    return 'Invalid Student ID format';
  }
  return null;
};

export const validateDepartment = (value, allowed = []) => {
  if (!value) return 'Please select your department';
  if (allowed.length && !allowed.includes(value)) {
    return 'Invalid department selection';
  }
  return null;
};

export const validatePassword = (value) => {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
    return 'Password must contain uppercase, lowercase, and number';
  }
  return null;
};

export const validateConfirmPassword = (password, confirm) => {
  if (!confirm) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return null;
};

// all the validators are called
export const validateSignupForm = (formData, options, data = {}) => {
  const errors = {};
  if (!data.email?.includes('@')) errors.email = 'Invalid email';
  if (!data.password || data.password.length < 6) errors.password = 'Password must be at least 6 characters';
  const fullNameErr = validateFullName(formData.fullName);
  if (fullNameErr) errors.fullName = fullNameErr;
  
  const emailErr = validateEmail(formData.email, options);
  if (emailErr) errors.email = emailErr;
  
  const studentIdErr = validateStudentId(formData.studentId);
  if (studentIdErr) errors.studentId = studentIdErr;
  
  const deptErr = validateDepartment(formData.department, options.allowedDepartments);
  if (deptErr) errors.department = deptErr;
  
  const passErr = validatePassword(formData.password);
  if (passErr) errors.password = passErr;
  
  const confirmErr = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (confirmErr) errors.confirmPassword = confirmErr;
  
  if (!formData.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the Terms of Service and Privacy Policy';
  }
  
  return errors;
};