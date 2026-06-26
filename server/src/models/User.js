import crypto from 'crypto';
import { query, queryOne, execute } from '../config/db.js';

/**
 * Create a new user
 * @param {object} userData - { email, display_name, password_hash, avatar_url }
 * @returns {object} Created user
 */
export async function createUser({ email, display_name, password_hash, avatar_url }) {
  const id = crypto.randomUUID();
  execute(
    `INSERT INTO users (id, email, display_name, password_hash, avatar_url)
     VALUES (?, ?, ?, ?, ?)`,
    [id, email, display_name || '', password_hash || null, avatar_url || '']
  );
  return findById(id);
}

/**
 * Find user by email
 * @param {string} email
 * @returns {object|null}
 */
export async function findByEmail(email) {
  return queryOne('SELECT * FROM users WHERE email = ?', [email]);
}

/**
 * Find user by ID
 * @param {string} id
 * @returns {object|null}
 */
export async function findById(id) {
  return queryOne('SELECT id, email, display_name, avatar_url, created_at FROM users WHERE id = ?', [id]);
}

/**
 * Update user profile
 * @param {string} id
 * @param {object} updates
 * @returns {object}
 */
export async function updateUser(id, updates) {
  const fields = [];
  const values = [];
  for (const [key, val] of Object.entries(updates)) {
    if (val !== undefined) {
      fields.push(`${key} = ?`);
      values.push(val);
    }
  }
  if (fields.length === 0) return findById(id);
  fields.push('updated_at = datetime(\'now\')');
  values.push(id);
  execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
}
