// importing axios, the fetch wrapper that doesn't suck
// if you don't have axios installed, run: npm install axios
// yes, you could use fetch, but then you'd be writing more code, and we're lazy
import axios from 'axios';
// import { logoutApi, refreshTokenApi } from './auth';

// doing this for lazy import to avoid the circular dependency (api.js -> auth.js -> api.js) we resolve it at call-time inside the interceptor instead.
let refreshTokenApi = null;
let logoutApi = null;

const loadAuthUtils = async () => {
   if (!refreshTokenApi || !logoutApi) {
      const mod = await import('./auth');
      refreshTokenApi = mod.refreshTokenApi;
      logoutApi = mod.logoutApi;
   }
};

// creating an axios instance with default config
// this way we don't repeat baseURL and headers in every api call
// DRY principle, look it up
const api = axios.create({
   // baseURL from env variable or fallback to placeholder
   // always use env vars for urls, or you'll forget to change them before deploy
   baseURL: import.meta.env.VITE_API_URL || 'https://localhost:5000/api',
   headers: {
      'Content-Type': 'application/json', // default content type for most apis
   },
   // withCredentials must be true so the browser sends the HTTP-only
   // refresh token cookie on every request (login, refresh, logout).
   withCredentials: true, // if our backend uses cookies for auth, keep this
   // if we're using jwt in headers only, we can set this to false
});

// request interceptor: runs before every api call
// this is where we attach the auth token to headers
// so you don't have to remember to do it in every single request
// (you will forget, trust me)

// attaches the access token to every outgoing request.
// the token is stored in localStorage (short-lived, 15 min by default).
api.interceptors.request.use(
   (config) => {
      // getting token from localStorage
      // yes, we're still using localStorage, we'll migrate to cookies later maybe
      const token = localStorage.getItem('authToken');

      // if token exists, add it to Authorization header in Bearer format
      // this is the standard jwt auth header format, don't change it
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }

      // always return the config, or the request won't go through
      // learned this after 2 hours of debugging, you're welcome
      return config;
   },
   // error handler for request interceptor, just pass the error along
  (error) => Promise.reject(error)
);

// response interceptor 
// on 401 (expired access token):
//   1. Try to silently get a new access token via the refresh cookie.
//   2. Save the new token and retry the original request exactly once.
//   3. If refresh also fails (cookie expired / revoked), log the user out
//      and redirect to /login.

// The _retry flag prevents infinite loops if the refresh endpoint itself
// returns 401 (which would otherwise trigger the interceptor again).

let isRefreshing = false;
// queue of requests that arrived while a refresh was already in-flight.
// once the refresh resolves (or rejects) we flush the queue.
let failedQueue = [];

const processQueue = (error, token = null) => {
   failedQueue.forEach(({ resolve, reject }) => {
      if (error) reject(error);
      else resolve(token);
   });
   failedQueue = [];
};

// response interceptor: runs after every api response
// this is where we handle 401 errors and auto-refresh tokens
// the fancy stuff that makes auth feel seamless, fucking shit
api.interceptors.response.use(
   // success case: just return the response, nothing special
   (response) => response,
   // error case: this is where the magic (and complexity) happens
   async (error) => {
      // saving original request config so we can retry it later
      const originalRequest = error.config;
      
      // checking if error is 401 (unauthorized) AND we haven't already retried this request
      // AGAIN, only handle 401 errors that haven't already been retried.
      // the _retry flag prevents infinite loops if refresh also fails
      if (error.response?.status !== 401 || originalRequest._retry) {
         // marking request as retried, so we don't loop forever
         // originalRequest._retry = true;
         return Promise.reject(error);
      }
         
      // don't try to refresh if the failing request IS the refresh endpoint — that means the refresh token itself is bad. Log out immediately.
      if (originalRequest.url?.includes('/auth/refresh')) {
         await handleForceLogout();
         return Promise.reject(error);
      }

      // if a refresh is already in-flight, queue this request until it settles.
      if (isRefreshing) {
         return new Promise((resolve, reject) => {
         failedQueue.push({ resolve, reject });
         }).then((token) => {
         originalRequest.headers.Authorization = `Bearer ${token}`;
         return api(originalRequest);
         });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
         await loadAuthUtils();
         const { accessToken } = await refreshTokenApi();

         // calling refresh token endpoint to get new access token
         // this assumes you implemented refresh token logic in backend
         // if you didn't, this will fail and you'll end up in the catch block
         // const { token } = await refreshTokenApi();

         // storing new token in localStorage, overwriting old one
         localStorage.setItem('authToken', accessToken);
         api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
         processQueue(null, accessToken);

         // updating the original request's auth header with new token
         originalRequest.headers.Authorization = `Bearer ${accessToken}`;

         // retrying the original request with new token
         // this is the whole point: user doesn't even notice their token expired
         return api(originalRequest);
      } catch (refreshError) {
         processQueue(refreshError, null);
         await handleForceLogout();
         // if refresh failed (token expired, invalid, etc), we gotta logout
         // calling logout function to clear local storage
         // await logoutApi();
         // redirecting to login page, force reload to reset any stale state
         // window.location.href = '/login';
         // rejecting the promise so the original call's catch block runs
         return Promise.reject(refreshError);
      } finally {
         isRefreshing = false;
      }
      
      // if error wasn't 401 or we already retried, just pass it along
      // let the component handle it with error messages or whatever
      // return Promise.reject(error);
   }
);

// clears local state and redirects to /login. fires a custom event so AuthContext can sync its state without a hard import.
const handleForceLogout = async () => {
   try {
      await loadAuthUtils();
      await logoutApi();
   } catch {
      // logoutApi already handles its own errors — just make sure we redirect.
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
   }

   // let AuthContext know the session is gone without a circular import.
   window.dispatchEvent(new CustomEvent('auth:session-expired'));

   // small delay so the event can be handled before the redirect.
   setTimeout(() => {
      window.location.href = '/login';
   }, 100);
};

export default api;