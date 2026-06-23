import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Hook to fetch and manage habits data
 * @returns {object} Habits state and actions
 */
export function useHabits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/habits?limit=50');
      setHabits(data.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  /**
   * Create a new habit
   * @param {object} habitData
   * @returns {Promise<object>}
   */
  const createHabit = async (habitData) => {
    const { data } = await api.post('/habits', habitData);
    setHabits(prev => [...prev, data.data]);
    return data.data;
  };

  /**
   * Update a habit
   * @param {string} id
   * @param {object} updates
   * @returns {Promise<object>}
   */
  const updateHabit = async (id, updates) => {
    const { data } = await api.put(`/habits/${id}`, updates);
    setHabits(prev => prev.map(h => h.id === id ? data.data : h));
    return data.data;
  };

  /**
   * Delete a habit (soft delete)
   * @param {string} id
   */
  const deleteHabit = async (id) => {
    await api.delete(`/habits/${id}`);
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  /**
   * Log progress for a habit
   * @param {string} habitId
   * @param {object} progressData
   * @returns {Promise<object>}
   */
  const logProgress = async (habitId, progressData = {}) => {
    const { data } = await api.post('/progress', { habit_id: habitId, ...progressData });
    return data.data;
  };

  return { habits, loading, error, fetchHabits, createHabit, updateHabit, deleteHabit, logProgress };
}
