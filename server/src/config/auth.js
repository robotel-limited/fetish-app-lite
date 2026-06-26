import env from './env.js';

export default {
  jwt: {
    secret: env.jwtSecret,
    refreshSecret: env.jwtRefreshSecret,
    expiry: env.jwtExpiry,
    refreshExpiry: env.jwtRefreshExpiry,
  },
};
