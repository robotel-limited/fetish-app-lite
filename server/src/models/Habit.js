import { query } from '../config/db.js';

/**
 * Create a new habit
 * @param {object} data - { user_id, name, emoji, description, frequency, target_count, target_unit, color }
 * @returns {Promise<object>}
 */
export async function createHabit(data) {
  const res = await query(
    `INSERT INTO habits (user_id, name, emoji, description, frequency, target_count, target_unit, color)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [data.user_id, data.name, data.emoji, data.description, data.frequency, data.target_count, data.target_unit, data.color]
  );
  return res.rows[0];
}

/**
 * Get habits for a user with optional pagination
 * @param {string} userId
 * @param {object} options - { limit, offset, active_only }
 * @returns {Promise<{ habits: Array, total: number }>}
 */
export async function getHabitsByUser(userId, { limit = 20, offset = 0, active_only = true } = {}) {
  const whereClause = active_only ? 'WHERE user_id = $1 AND is_active = true' : 'WHERE user_id = $1';
  const countRes = await query(`SELECT COUNT(*) FROM habits ${whereClause}`, [userId]);
  const total = parseInt(countRes.rows[0].count, 10);

  const res = await query(
    `SELECT * FROM habits ${whereClause} ORDER BY created_at ASC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return { habits: res.rows, total };
}

/**
 * Get a single habit by ID
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export async function getHabitById(id) {
  const res = await query('SELECT * FROM habits WHERE id = $1', [id]);
  return res.rows[0] || null;
}

/**
 * Update a habit
 * @param {string} id
 * @param {string} userId
 * @param {object} updates
 * @returns {Promise<object|null>}
 */
export async function updateHabit(id, userId, updates) {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const [key, val] of Object.entries(updates)) {
    if (val !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(val);
    }
  }
  if (fields.length === 0) return getHabitById(id);
  fields.push('updated_at = NOW()');
  values.push(id, userId);
  const res = await query(
    `UPDATE habits SET ${fields.join(', ')} WHERE id = $${idx} AND user_id = $${idx + 1} RETURNING *`,
    values
  );
  return res.rows[0] || null;
}

/**
 * Delete a habit (soft delete by setting is_active = false)
 * @param {string} id
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export async function deleteHabit(id, userId) {
  const res = await query(
    'UPDATE habits SET is_active = false, updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return res.rowCount > 0;
}
