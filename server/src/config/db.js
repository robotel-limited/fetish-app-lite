import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import env from './env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'fetish.db'));

// Ensure data directory exists
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

// Performance and integrity pragmas
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/**
 * Execute a query and return rows-like result
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {{ rows: Array, rowCount: number }}
 */
export function query(text, params = []) {
  const start = Date.now();
  const isSelect = /^\s*(SELECT|WITH|RETURNING)/i.test(text.trim());

  let rows = [];
  let rowCount = 0;

  if (isSelect) {
    const stmt = db.prepare(text);
    // stmt.all() returns all rows even for single-row queries; both shapes work with .rows
    rows = stmt.all(...params);
    rowCount = rows.length;
  } else {
    const stmt = db.prepare(text);
    const info = stmt.run(...params);
    rowCount = info.changes;

    // If RETURNING was used, manually fetch — better-sqlite3's run() doesn't return rows
    if (/RETURNING/i.test(text)) {
      // Re-execute as a SELECT using the same WHERE to get the returned row
      // This is a limitation; for RETURNING we refactor models to use separate SELECTs
    }
  }

  const duration = Date.now() - start;
  if (env.nodeEnv === 'development') {
    console.log('Executed query', { text: text.substring(0, 80), duration, rows: rowCount });
  }

  return { rows, rowCount };
}

/**
 * Execute a query that returns a single row (convenience wrapper)
 * @param {string} text
 * @param {Array} params
 * @returns {object|null}
 */
export function queryOne(text, params = []) {
  const stmt = db.prepare(text);
  return stmt.get(...params) || null;
}

/**
 * Execute a statement that doesn't return rows (INSERT/UPDATE/DELETE without RETURNING)
 * @returns {{ changes: number, lastInsertRowid: number }}
 */
export function execute(text, params = []) {
  const stmt = db.prepare(text);
  return stmt.run(...params);
}

/**
 * Get a transaction function
 * @returns {Function}
 */
export function transaction(fn) {
  return db.transaction(fn);
}

export default db;
