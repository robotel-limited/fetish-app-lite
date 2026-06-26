import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import env from './config/env.js';
import db from './config/db.js';
import authRoutes from './routes/auth.js';
import habitRoutes from './routes/habits.js';
import progressRoutes from './routes/progress.js';
import userRoutes from './routes/user.js';
import { errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Run migrations on startup ──────────────────────────────────────
function runMigrations() {
  const userTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
  if (userTable) {
    console.log('✓ Database already initialized');
    return;
  }

  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  const migrationSql = files.map(f => fs.readFileSync(path.join(migrationsDir, f), 'utf8')).join('\n');

  db.exec(migrationSql);
  console.log(`✓ Ran ${files.length} migration(s)`);
}
runMigrations();

// ── Seed default habits for new users ──────────────────────────────
db.prepare(`
  CREATE TRIGGER IF NOT EXISTS after_user_insert
  AFTER INSERT ON users
  FOR EACH ROW
  BEGIN
    INSERT INTO habits (id, user_id, name, emoji, description, frequency, target_count, target_unit, color) VALUES
      (lower(hex(randomblob(16))), NEW.id, 'Wake up on time', '⏰', 'Start the day right by waking up at your scheduled time', 'daily', 1, 'day', '#f59e0b'),
      (lower(hex(randomblob(16))), NEW.id, 'Read every day', '📖', 'Spend at least 30 minutes reading', 'daily', 1, '30 min', '#10b981'),
      (lower(hex(randomblob(16))), NEW.id, 'Code for at least 30 minutes', '💻', 'Write code and build things every day', 'daily', 1, '30 min', '#6366f1'),
      (lower(hex(randomblob(16))), NEW.id, 'Go for a walk', '🚶', 'Get outside and move your body', 'daily', 1, 'walk', '#22d3ee'),
      (lower(hex(randomblob(16))), NEW.id, 'Manage basic activities like a pro', '🏆', 'Stay organized and manage yourself effectively', 'daily', 1, 'day', '#8b5cf6');
  END
`).run();

const app = express();

// Serve static files from client/dist in production
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  console.log('✓ Serving client/dist as static files');
}

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// Compression
app.use(compression());

// CORS
app.use(cors({
  origin: env.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests, please try again later' } },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/user', userRoutes);

// SPA fallback — serve index.html for non-API, non-file routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` } });
  }
  const indexPath = path.join(clientDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } });
  }
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(env.port, '0.0.0.0', () => {
  console.log(`🚀 Fetish App Lite server running on port ${env.port} in ${env.nodeEnv} mode`);
});

export default app;
