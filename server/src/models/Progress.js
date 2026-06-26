import crypto from 'crypto';
import { query, queryOne, execute } from '../config/db.js';

/**
 * Log progress for a habit on a given date
 * @param {object} data - { habit_id, user_id, date, count, note }
 * @returns {object}
 */
export async function logProgress({ habit_id, user_id, date, count = 1, note }) {
  // Try UPDATE first (upsert pattern for SQLite)
  const existing = queryOne(
    'SELECT id FROM progress WHERE habit_id = ? AND user_id = ? AND date = ?',
    [habit_id, user_id, date || new Date().toISOString().split('T')[0]]
  );

  if (existing) {
    execute(
      `UPDATE progress SET count = count + ?, note = COALESCE(?, note) WHERE id = ?`,
      [count, note || null, existing.id]
    );
    return queryOne('SELECT * FROM progress WHERE id = ?', [existing.id]);
  }

  const id = crypto.randomUUID();
  const today = new Date().toISOString().split('T')[0];
  execute(
    `INSERT INTO progress (id, habit_id, user_id, date, count, note)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, habit_id, user_id, date || today, count, note || '']
  );
  return queryOne('SELECT * FROM progress WHERE id = ?', [id]);
}

/**
 * Get progress for a habit within a date range
 * @param {string} habitId
 * @param {string} userId
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Array}
 */
export async function getProgress(habitId, userId, startDate, endDate) {
  const res = query(
    `SELECT * FROM progress
     WHERE habit_id = ? AND user_id = ? AND date >= ? AND date <= ?
     ORDER BY date ASC`,
    [habitId, userId, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
  );
  return res.rows;
}

/**
 * Get today's progress for all active habits of a user
 * @param {string} userId
 * @returns {Array}
 */
export async function getTodayProgress(userId) {
  const res = query(
    `SELECT p.*, h.name, h.emoji, h.color, h.target_count
     FROM progress p
     JOIN habits h ON p.habit_id = h.id
     WHERE p.user_id = ? AND p.date = date('now')
     ORDER BY h.created_at ASC`,
    [userId]
  );
  return res.rows;
}

/**
 * Get streak count for a habit
 * In SQLite, julianday() converts TEXT dates to numbers for arithmetic.
 * ROW_NUMBER() window functions work in SQLite 3.25+.
 * @param {string} habitId
 * @param {string} userId
 * @returns {number}
 */
export async function getStreak(habitId, userId) {
  const row = queryOne(
    `WITH daily AS (
       SELECT date FROM progress
       WHERE habit_id = ? AND user_id = ?
       ORDER BY date DESC
     ),
     streaks AS (
       SELECT date,
              julianday(date) - ROW_NUMBER() OVER (ORDER BY date) AS grp
       FROM daily
     )
     SELECT COUNT(*) AS streak
     FROM streaks
     WHERE grp = (SELECT grp FROM streaks LIMIT 1)`,
    [habitId, userId]
  );
  return row ? row.streak : 0;
}

/**
 * Get all streaks for a user's habits
 * SQLite doesn't support LATERAL joins, so we compute in JS.
 * @param {string} userId
 * @returns {Array}
 */
export async function getAllStreaks(userId) {
  const res = query(
    `SELECT h.id, h.name, h.emoji, h.color
     FROM habits h
     WHERE h.user_id = ? AND h.is_active = 1
     ORDER BY h.created_at ASC`,
    [userId]
  );
  const habits = res.rows;

  // Compute streaks for each habit
  const results = [];
  for (const habit of habits) {
    const streak = await getStreak(habit.id, userId);
    results.push({
      id: habit.id,
      name: habit.name,
      emoji: habit.emoji,
      color: habit.color,
      streak,
    });
  }
  return results;
}
