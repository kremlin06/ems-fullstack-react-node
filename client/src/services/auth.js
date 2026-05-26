// mock api function for development/testing
// this lets us test the login flow without a real backend
// when backend is ready, we will comment this out and uncomment the real one below
// don't forget to switch, or we'll wonder why our real credentials don't work
import api from './api'; 

// export const loginApi = async ({ identifier, password }) => {

//   const response = await api.post('/auth/login', { identifier, password });
//   return response.data;
// };

// client/src/services/auth.js

// modified since we are now using actual data
/* 
POST /api/auth/login
Body: { idenfitifier, password }
Returns: { accessToken, user }

The refresh token is returned as an HTTP-only cookie by the backend — we never touch it here. We only store the short-lived accessToken.
*/

export const loginApi = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // { accessToken, user }
};

// export const loginApi = asynx ({ idenfitifier, password }) => {
//  return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const validUsers = [
//         { identifier: 'admin', password: 'admin123', user: { id: 1, fullName: 'Admin User', email: 'admin@sti.edu', role: 'Admin' } },
//         { identifier: 'admin@sti.edu', password: 'admin123', user: { id: 1, fullName: 'Admin User', email: 'admin@sti.edu', role: 'Admin' } },
//       ];

//       const match = validUsers.find(
//         u => u.identifier === identifier && u.password === password
//       );

//       if (match) {
//         resolve({ token: 'mock-token-' + Date.now(), user: match.user });
//       } else {
//         reject({ status: 401, message: 'Invalid credentials' });
//       }
//     }, 1500);
//   });
// }

/*
POST /api/auth/register
Body:    { fullName, email, studentId, department, password }
Returns: { accessToken, user }

Same shape as login on success — the backend issues tokens immediately so the user is logged in right after registering (no separate login step).
*/
// modified registerApi
export const registerApi = async ({ fullName, email, studentId, department, password }) => {
  const response = await api.post('/auth/register', {
    fullName,
    email,
    studentId,
    department,
    password,
  });
  return response.data; // { accessToken, user }
};

/*
export const registerApi = async ({ fullName, email, studentId, department, password}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // basic mock validation
      if (!fullName || !email || !studentId || !department || !password) {
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
        user: { id: Date.now(), fullName, email, studentId: studentId.toUpperCase(), department, role: 'Attendee', } 
      });
    }, 1500);
  });
};
*/
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

/*
POST /api/auth/logout
The backend clears the HTTP-only refresh token cookie AND revokes the stored hash in the DB. We clear localStorage on our side.
*/
export const logoutApi = async () => {
  try {
    await api.post('/auth/logout');
  } catch {
    // Always clear local state even if the backend call fails.
    // A network error or an already-expired token should never trap the user.
  } finally {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // localStorage.removeItem('refreshToken');
  }
  // Optional: notify backend to invalidate token
  // await api.post('/auth/logout').catch(() => {}); // Fail silently
};

/*
GET /api/auth/me
Protected — the request interceptor in api.js attaches the Bearer token. Returns fresh user data from the DB (role changes are reflected immediately).
*/
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  // modifed: added '.user'
  return response.data.user;  // { id, fullName, email, studentId, department, role }
};

/*
POST /api/auth/refresh
The refresh token is sent automatically via the HTTP-only cookie.
Returns: { accessToken }

Called by the response interceptor in api.js on 401 — not called manually.
*/
export const refreshTokenApi = async () => {
  // const refreshToken = localStorage.getItem('refreshToken');
  // if (!refreshToken) throw new Error('No refresh token');
  
  // const response = await api.post('/auth/refresh', { refreshToken });
  const response = await api.post('/auth/refresh');
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
