import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js';
import { findById } from '../models/User.js';

/**
 * Middleware to verify JWT access token
 */
export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No token provided' } });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret);
    const user = await findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User no longer exists' } });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: { code: 'TOKEN_EXPIRED', message: 'Access token expired' } });
    }
    return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid access token' } });
  }
}

/**
 * Generate access token
 * @param {string} userId
 * @returns {string}
 */
export function generateAccessToken(userId) {
  return jwt.sign({ userId }, authConfig.jwt.secret, { expiresIn: authConfig.jwt.expiry });
}

/**
 * Generate refresh token
 * @param {string} userId
 * @returns {string}
 */
export function generateRefreshToken(userId) {
  return jwt.sign({ userId }, authConfig.jwt.refreshSecret, { expiresIn: authConfig.jwt.refreshExpiry });
}

/**
 * Verify and decode refresh token
 * @param {string} token
 * @returns {object|null}
 */
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, authConfig.jwt.refreshSecret);
  } catch {
    return null;
  }
}
