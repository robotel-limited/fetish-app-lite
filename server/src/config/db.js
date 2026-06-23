import pkg from 'pg';
const { Pool } = pkg;
import env from './env.js';

const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

/**
 * Execute a single query
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<object>} Query result
 */
export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (env.nodeEnv === 'development') {
    console.log('Executed query', { text: text.substring(0, 80), duration, rows: res.rowCount });
  }
  return res;
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise<object>} Pool client
 */
export async function getClient() {
  return pool.connect();
}

export default pool;
