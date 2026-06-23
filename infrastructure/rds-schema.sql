-- RDS Schema initialization script
-- Run on fresh RDS PostgreSQL instance

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  google_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  emoji VARCHAR(10) DEFAULT '📌',
  description TEXT,
  frequency VARCHAR(20) DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  target_count INTEGER DEFAULT 1,
  target_unit VARCHAR(50),
  color VARCHAR(7) DEFAULT '#6366f1',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);

CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER DEFAULT 1,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_progress_habit_id ON progress(habit_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_date ON progress(date);

-- Seed function: create default habits for new users
CREATE OR REPLACE FUNCTION seed_default_habits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO habits (user_id, name, emoji, description, frequency, target_count, target_unit, color) VALUES
    (NEW.id, 'Wake up on time', '⏰', 'Start the day right by waking up at your scheduled time', 'daily', 1, 'day', '#f59e0b'),
    (NEW.id, 'Read every day', '📖', 'Spend at least 30 minutes reading', 'daily', 1, '30 min', '#10b981'),
    (NEW.id, 'Code for at least 30 minutes', '💻', 'Write code and build things every day', 'daily', 1, '30 min', '#6366f1'),
    (NEW.id, 'Go for a walk', '🚶', 'Get outside and move your body', 'daily', 1, 'walk', '#22d3ee'),
    (NEW.id, 'Manage basic activities like a pro', '🏆', 'Stay organized and manage your daily activities effectively', 'daily', 1, 'day', '#8b5cf6');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS after_user_created ON users;
CREATE TRIGGER after_user_created
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION seed_default_habits();
