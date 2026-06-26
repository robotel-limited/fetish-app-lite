import crypto from 'crypto';
import { query, queryOne, execute } from '../config/db.js';

/**
 * Create a new habit
 * @param {object} data - { user_id, name, emoji, description, frequency, target_count, target_unit, color }
 * @returns {object}
 */
export async function createHabit(data) {
  const id = crypto.randomUUID();
  execute(
    `INSERT INTO habits (id, user_id, name, emoji, description, frequency, target_count, target_unit, color)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, data.user_id, data.name, data.emoji || '📌', data.description || '', data.frequency || 'daily', data.target_count || 1, data.target_unit || '', data.color || '#6366f1']
  );
  return queryOne('SELECT * FROM habits WHERE id = ?', [id]);
}

/**
 * Get habits for a user with optional pagination
 * @param {string} userId
 * @param {object} options - { limit, offset, active_only }
 * @returns {{ habits: Array, total: number }}
 */
export async function getHabitsByUser(userId, { limit = 20, offset = 0, active_only = true } = {}) {
  const countWhere = active_only ? 'WHERE user_id = ? AND is_active = 1' : 'WHERE user_id = ?';
  const countRes = queryOne(`SELECT COUNT(*) AS count FROM habits ${countWhere}`, [userId]);
  const total = countRes ? countRes.count : 0;

  const habitsWhere = active_only ? 'WHERE user_id = ? AND is_active = 1' : 'WHERE user_id = ?';
  const res = query(
    `SELECT * FROM habits ${habitsWhere} ORDER BY created_at ASC LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );
  return { habits: res.rows, total };
}

/**
 * Get a single habit by ID
 * @param {string} id
 * @returns {object|null}
 */
export async function getHabitById(id) {
  return queryOne('SELECT * FROM habits WHERE id = ?', [id]);
}

/**
 * Update a habit
 * @param {string} id
 * @param {string} userId
 * @param {object} updates
 * @returns {object|null}
 */
export async function updateHabit(id, userId, updates) {
  const fields = [];
  const values = [];
  for (const [key, val] of Object.entries(updates)) {
    if (val !== undefined) {
      fields.push(`${key} = ?`);
      values.push(val);
    }
  }
  if (fields.length === 0) return getHabitById(id);
  fields.push('updated_at = datetime(\'now\')');
  values.push(id, userId);
  execute(`UPDATE habits SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`, values);
  return queryOne('SELECT * FROM habits WHERE id = ?', [id]);
}

/**
 * Delete a habit (soft delete by setting is_active = false)
 * @param {string} id
 * @param {string} userId
 * @returns {boolean}
 */
export async function deleteHabit(id, userId) {
  const info = execute(
    'UPDATE habits SET is_active = 0, updated_at = datetime(\'now\') WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return info.changes > 0;
}
