import { query } from '../config/db.js';

/**
 * Create a new user
 * @param {object} userData - { email, display_name, avatar_url, google_id }
 * @returns {Promise<object>} Created user
 */
export async function createUser({ email, display_name, avatar_url, google_id }) {
  const res = await query(
    `INSERT INTO users (email, display_name, avatar_url, google_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, display_name, avatar_url, created_at`,
    [email, display_name, avatar_url, google_id]
  );
  return res.rows[0];
}

/**
 * Find user by email
 * @param {string} email
 * @returns {Promise<object|null>}
 */
export async function findByEmail(email) {
  const res = await query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0] || null;
}

/**
 * Find user by Google ID
 * @param {string} googleId
 * @returns {Promise<object|null>}
 */
export async function findByGoogleId(googleId) {
  const res = await query('SELECT * FROM users WHERE google_id = $1', [googleId]);
  return res.rows[0] || null;
}

/**
 * Find user by ID
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export async function findById(id) {
  const res = await query('SELECT id, email, display_name, avatar_url, created_at FROM users WHERE id = $1', [id]);
  return res.rows[0] || null;
}

/**
 * Update user profile
 * @param {string} id
 * @param {object} updates
 * @returns {Promise<object>}
 */
export async function updateUser(id, updates) {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const [key, val] of Object.entries(updates)) {
    if (val !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(val);
    }
  }
  if (fields.length === 0) return findById(id);
  fields.push(`updated_at = NOW()`);
  values.push(id);
  const res = await query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, email, display_name, avatar_url, created_at`,
    values
  );
  return res.rows[0];
}
