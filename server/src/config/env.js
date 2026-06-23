import dotenv from 'dotenv';
dotenv.config();

export default {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3001,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'fallback_dev_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_dev_refresh',
  jwtExpiry: '15m',
  jwtRefreshExpiry: '7d',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
