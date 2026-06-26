import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import HabitProgress from '../components/habits/HabitProgress';

/**
 * Dashboard page with stats and overview
 * @returns {JSX.Element}
 */
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: res } = await api.get('/progress/dashboard');
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6">
              <div className="h-4 w-20 rounded shimmer mb-3" />
              <div className="h-8 w-16 rounded shimmer" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-4 sm:p-5">
              <div className="h-10 w-10 rounded-xl shimmer mb-3" />
              <div className="h-5 w-3/4 rounded shimmer mb-2" />
              <div className="h-3 w-1/2 rounded shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="glass rounded-2xl p-4 sm:p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats, habits } = data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 sm:space-y-8"
    >
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="text-gray-400 mt-1">Here's your progress overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Completed Today', value: stats.completedToday, icon: '✅', color: '#10b981' },
          { label: 'Active Habits', value: stats.totalHabits, icon: '📋', color: '#6366f1' },
          { label: 'Best Streak', value: stats.bestStreak, icon: '🔥', color: '#f59e0b' },
          { label: 'Total Logs', value: stats.totalLogged, icon: '📊', color: '#8b5cf6' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">{stat.label}</span>
              <span>{stat.icon}</span>
            </div>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.15 + 0.3, type: 'spring', stiffness: 150 }}
              className="stat-number"
            >
              {stat.value}
            </motion.p>
          </motion.div>
        ))}
      </div>

      {/* Habits Overview */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Today's Habits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit, i) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-4 sm:p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl sm:text-2xl">{habit.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{habit.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">
                      {habit.completedToday ? '✓ Completed' : 'Not done yet'}
                    </span>
                    {habit.streak > 0 && (
                      <span className="text-xs text-orange-400">🔥 {habit.streak}d</span>
                    )}
                  </div>
                </div>
              </div>
              <HabitProgress progress={habit.progress || []} color={habit.color} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
