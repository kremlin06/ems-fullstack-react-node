// importing axios, the fetch wrapper that doesn't suck
// if you don't have axios installed, run: npm install axios
// yes, you could use fetch, but then you'd be writing more code, and we're lazy
import axios from 'axios';
import { logoutApi, refreshTokenApi } from './auth';

// creating an axios instance with default config
// this way we don't repeat baseURL and headers in every api call
// DRY principle, look it up
const api = axios.create({
   // baseURL from env variable or fallback to placeholder
   // always use env vars for urls, or you'll forget to change them before deploy
   baseURL: import.meta.env.VITE_API_URL || 'https://your-api.com/api',
   headers: {
      'Content-Type': 'application/json', // default content type for most apis
   },
   withCredentials: true, // if your backend uses cookies for auth, keep this
   // if we're using jwt in headers only, we can set this to false
});

// request interceptor: runs before every api call
// this is where we attach the auth token to headers
// so you don't have to remember to do it in every single request
// (you will forget, trust me)
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
      // the _retry flag prevents infinite loops if refresh also fails
      if (error.response?.status === 401 && !originalRequest._retry) {
         // marking request as retried, so we don't loop forever
         originalRequest._retry = true;
         
         try {
            // calling refresh token endpoint to get new access token
            // this assumes you implemented refresh token logic in backend
            // if you didn't, this will fail and you'll end up in the catch block
            const { token } = await refreshTokenApi();

            // storing new token in localStorage, overwriting old one
            localStorage.setItem('authToken', token);

            // updating the original request's auth header with new token
            originalRequest.headers.Authorization = `Bearer ${token}`;

            // retrying the original request with new token
            // this is the whole point: user doesn't even notice their token expired
            return api(originalRequest);
         } catch (refreshError) {
            // if refresh failed (token expired, invalid, etc), we gotta logout
            // calling logout function to clear local storage
            await logoutApi();
            // redirecting to login page, force reload to reset any stale state
            window.location.href = '/login';
            // rejecting the promise so the original call's catch block runs
            return Promise.reject(refreshError);
         }
      }
      
      // if error wasn't 401 or we already retried, just pass it along
      // let the component handle it with error messages or whatever
      return Promise.reject(error);
  }
);

export default api;