#!/usr/bin/env node
/**
 * Initialize the SQLite database by running all migrations.
 * Usage: npm run migrate
 */
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.join(__dirname, '..', 'server', 'data');
const dbPath = path.join(dbDir, 'fetish.db');
const migrationsDir = path.join(__dirname, '..', 'server', 'migrations');

fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
const sql = files.map(f => fs.readFileSync(path.join(migrationsDir, f), 'utf8')).join('\n');

db.exec(sql);
db.close();

console.log(`✓ Database created at ${dbPath}`);
console.log(`✓ Applied ${files.length} migration(s)`);
