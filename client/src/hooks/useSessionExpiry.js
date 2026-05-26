import { useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';

/**
 * Call this inside Login.jsx (and only there).
 * If the user arrived because their session expired, it fires the callback
 * once so you can show a toast / banner.
 *
 * Usage:
 *   useSessionExpiry(() =>
 *     setToast({ type: 'warning', message: 'Your session expired. Please log in again.' })
 *   );
 */
const useSessionExpiry = (onExpired) => {
  const { sessionExpired } = useAuth();

  useEffect(() => {
    if (sessionExpired && typeof onExpired === 'function') {
      onExpired();
    }
  }, [sessionExpired]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useSessionExpiry;