import dotenv from 'dotenv';
dotenv.config();

export default {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3201,
  dbPath: process.env.DB_PATH || '',
  jwtSecret: process.env.JWT_SECRET || 'fallback_dev_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_dev_refresh',
  jwtExpiry: process.env.JWT_EXPIRY || '15m',
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3201',
};
