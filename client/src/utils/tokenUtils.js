// utils/tokenUtils.js
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  // Add 5-minute buffer
  return decoded.exp * 1000 < Date.now() - 300000;
};

export const getTokenRemainingTime = (token) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return 0;
  return decoded.exp * 1000 - Date.now();
};