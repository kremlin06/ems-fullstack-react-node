// mock api function for development/testing
// this lets us test the login flow without a real backend
// when backend is ready, we will comment this out and uncomment the real one below
// don't forget to switch, or we'll wonder why our real credentials don't work
import api from './api'; 

export const loginApi = async ({ identifier, password }) => {

  const response = await api.post('/auth/login', { identifier, password });
  return response.data;
};

export const registerApi = async ({ fullname, email, studentId, department, password}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // basic mock validation
      if (!fullname || !email || !studentId || !department || !password) {
        reject({ status: 400, response: { data: { message: 'All fields required' } } });
        return;
      }

      const mockExistingStudents = ['STI-BAL-2024-0001', '202400123'];
      if (mockExistingStudents.includes(studentId.toUpperCase())) {
        reject({
          status: 409, // conflict ito
          response: { data: { message: 'Student ID already registered', field: 'studentId'} } });
        return;
      
      } 

      // mock success, return token and user with AUTO-ASSIGNED ROLE
      resolve({ 
        token: 'mock-token-' + Date.now(), 
        user: { id: Date.now(), fullname, email, studentId: studentId.toUpperCase(), department, role: 'Attendee', } 
      });
    }, 1500);
  });
};

/*
export const registerApi = async ({ username, email, password, fullName }) => {
  const response = await api.post('/auth/register', {
    username,
    email,
    password,
    fullName,
  });
  return response.data;
};
*/

export const logoutApi = async () => {
  // Optional: notify backend to invalidate token
  await api.post('/auth/logout').catch(() => {}); // Fail silently
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

export const refreshTokenApi = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token');
  
  const response = await api.post('/auth/refresh', { refreshToken });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const forgotPasswordApi = async ({ email }) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPasswordApi = async ({ token, newPassword }) => {
  const response = await api.post('/auth/reset-password', { token, newPassword });
  return response.data;
};

/*
export const loginApi = async ({ identifier, password }) => {
   return new Promise((resolve, reject) => {
        returning a promise to simulate async api call
        setTimeout mimics network latency, so you can test loading states
      setTimeout(() => {
            hardcoded test credentials, change these or remove before production
            yes, this is a security risk if deployed, don't be dumb
            Test credentials: username: 'test', password: 'test123'
         if (identifier === 'test' && password === 'test123') {
              resolving with mock token and user data
              structure matches what real backend should return, for easy swapping
            resolve({ ok: true, data: { token: 'mock-token-12345', user: { id: 1, name: 'Test User' } } });
         } else {
              rejecting with 401 for invalid creds, matches http status code convention
            reject({ status: 401, message: 'Invalid credentials' });
         }
      }, 1500);
   });
};
*/
 
/*
// REAL API VERSION - uncomment this when backend is actually ready
// and comment out the mock above, or you'll have a bad time
export const loginApi = async ({ identifier, password }) => {
   // fetch call to your actual backend endpoint
   // make sure this url matches your deployed api, or it'll 404 and you'll cry
   const response = await fetch('https://your-api.com/auth/login', {
      method: 'POST', // login is always post, never get, don't @ me
      headers: { 'Content-Type': 'application/json' }, // telling server we're sending json
      body: JSON.stringify({ identifier, password }) // converting js object to json string
   });

   // checking if response is not ok (status 200-299)
   // fetch doesn't reject on http error codes, so we have to check manually
   // yes, this is annoying, no, i didn't design fetch
   if (!response.ok) {
      // trying to parse error response, with fallback to empty object
      // .catch(() => ({})) prevents unhandled promise rejection if response isn't json
      const error = await response.json().catch(() => ({}));
      // throwing a custom error object with status and message
      // this matches what our catch block in Login.jsx expects
      throw { status: response.status, message: error.message || 'Login failed' };
   }

   // if we got here, response is ok, parse and return the json data
   // this is what gets used in the .ok check in Login.jsx
   return response.json();
};
*/