import { query } from '../config/db.js';

/**
 * Log progress for a habit on a given date
 * @param {object} data - { habit_id, user_id, date, count, note }
 * @returns {Promise<object>}
 */
export async function logProgress({ habit_id, user_id, date, count = 1, note }) {
  const res = await query(
    `INSERT INTO progress (habit_id, user_id, date, count, note)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (habit_id, user_id, date)
     DO UPDATE SET count = progress.count + EXCLUDED.count, note = COALESCE(EXCLUDED.note, progress.note)
     RETURNING *`,
    [habit_id, user_id, date, count, note]
  );
  return res.rows[0];
}

/**
 * Get progress for a habit within a date range
 * @param {string} habitId
 * @param {string} userId
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<Array>}
 */
export async function getProgress(habitId, userId, startDate, endDate) {
  const res = await query(
    `SELECT * FROM progress
     WHERE habit_id = $1 AND user_id = $2 AND date >= $3 AND date <= $4
     ORDER BY date ASC`,
    [habitId, userId, startDate, endDate]
  );
  return res.rows;
}

/**
 * Get today's progress for all active habits of a user
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getTodayProgress(userId) {
  const res = await query(
    `SELECT p.*, h.name, h.emoji, h.color, h.target_count
     FROM progress p
     JOIN habits h ON p.habit_id = h.id
     WHERE p.user_id = $1 AND p.date = CURRENT_DATE
     ORDER BY h.created_at ASC`,
    [userId]
  );
  return res.rows;
}

/**
 * Get streak count for a habit
 * @param {string} habitId
 * @param {string} userId
 * @returns {Promise<number>}
 */
export async function getStreak(habitId, userId) {
  const res = await query(
    `WITH daily AS (
       SELECT date FROM progress
       WHERE habit_id = $1 AND user_id = $2
       ORDER BY date DESC
     ),
     streaks AS (
       SELECT date,
              date - ROW_NUMBER() OVER (ORDER BY date)::int AS grp
       FROM daily
     )
     SELECT COUNT(*) AS streak
     FROM streaks
     WHERE grp = (SELECT grp FROM streaks LIMIT 1)`,
    [habitId, userId]
  );
  return parseInt(res.rows[0]?.streak || 0, 10);
}

/**
 * Get all streaks for a user's habits
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getAllStreaks(userId) {
  const res = await query(
    `SELECT h.id, h.name, h.emoji, h.color, COALESCE(s.streak, 0) AS streak
     FROM habits h
     LEFT JOIN LATERAL (
       WITH daily AS (
         SELECT date FROM progress
         WHERE habit_id = h.id AND user_id = $1
         ORDER BY date DESC
       ),
       streaks AS (
         SELECT date, date - ROW_NUMBER() OVER (ORDER BY date)::int AS grp
         FROM daily
       )
       SELECT COUNT(*) AS streak FROM streaks
       WHERE grp = (SELECT grp FROM streaks LIMIT 1)
     ) s ON true
     WHERE h.user_id = $1 AND h.is_active = true
     ORDER BY h.created_at ASC`,
    [userId]
  );
  return res.rows;
}
