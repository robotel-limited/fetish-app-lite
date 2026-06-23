import env from './env.js';

export default {
  google: {
    clientId: env.googleClientId,
    clientSecret: env.googleClientSecret,
  },
  jwt: {
    secret: env.jwtSecret,
    refreshSecret: env.jwtRefreshSecret,
    expiry: env.jwtExpiry,
    refreshExpiry: env.jwtRefreshExpiry,
  },
};
