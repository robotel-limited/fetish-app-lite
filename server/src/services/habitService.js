import * as Habit from '../models/Habit.js';
import * as Progress from '../models/Progress.js';

/**
 * Get dashboard stats for a user
 * @param {string} userId
 * @returns {Promise<object>}
 */
export async function getDashboardStats(userId) {
  const { habits, total } = await Habit.getHabitsByUser(userId, { limit: 50 });
  const streaks = await Progress.getAllStreaks(userId);
  const todayProgress = await Progress.getTodayProgress(userId);

  const completedToday = todayProgress.length;
  const totalHabits = total;
  const totalLogged = todayProgress.reduce((sum, p) => sum + parseInt(p.count, 10), 0);
  const bestStreak = streaks.reduce((max, s) => Math.max(max, parseInt(s.streak, 10)), 0);
  const avgStreak = streaks.length > 0
    ? Math.round(streaks.reduce((sum, s) => sum + parseInt(s.streak, 10), 0) / streaks.length)
    : 0;

  return {
    stats: { completedToday, totalHabits, totalLogged, bestStreak, avgStreak },
    habits: habits.map(h => {
      const s = streaks.find(st => st.id === h.id);
      const tp = todayProgress.find(p => p.habit_id === h.id);
      return {
        ...h,
        streak: s ? parseInt(s.streak, 10) : 0,
        completedToday: !!tp,
        todayCount: tp ? parseInt(tp.count, 10) : 0,
      };
    }),
    todayProgress,
  };
}

/**
 * Log progress for a habit and return updated streak
 * @param {string} habitId
 * @param {string} userId
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function logHabitProgress(habitId, userId, { date, count, note } = {}) {
  const habit = await Habit.getHabitById(habitId);
  if (!habit || habit.user_id !== userId) {
    const err = new Error('Habit not found');
    err.statusCode = 404;
    err.code = 'HABIT_NOT_FOUND';
    throw err;
  }

  const progress = await Progress.logProgress({
    habit_id: habitId,
    user_id: userId,
    date: date || new Date().toISOString().split('T')[0],
    count: count || 1,
    note,
  });

  const streak = await Progress.getStreak(habitId, userId);
  return { progress, streak, habit };
}
