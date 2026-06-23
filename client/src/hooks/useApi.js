import { useState, useCallback } from 'react';
import api from '../services/api';

/**
 * Hook for generic API calls with loading/error state
 * @returns {object} { loading, error, execute }
 */
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute an API call
   * @param {Function} apiCall - () => api.get(...)
   * @returns {Promise<any>}
   */
  const execute = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      const message = err.response?.data?.error?.message || 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
}
