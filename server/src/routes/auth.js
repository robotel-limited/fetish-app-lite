import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js';
import * as User from '../models/User.js';
import { authenticate, generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/auth/google
 * Google OAuth login/signup
 */
router.post('/google', async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_CREDENTIAL', message: 'Google credential is required' } });
    }

    const client = new OAuth2Client(authConfig.google.clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: authConfig.google.clientId,
    });
    const payload = ticket.getPayload();

    let user = await User.findByGoogleId(payload.sub);
    if (!user) {
      user = await User.createUser({
        email: payload.email,
        display_name: payload.name,
        avatar_url: payload.picture,
        google_id: payload.sub,
      });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, displayName: user.display_name, avatarUrl: user.avatar_url },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_TOKEN', message: 'Refresh token is required' } });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ success: false, error: { code: 'INVALID_REFRESH', message: 'Invalid or expired refresh token' } });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    res.json({
      success: true,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        displayName: req.user.display_name,
        avatarUrl: req.user.avatar_url,
        createdAt: req.user.created_at,
      },
    },
  });
});

export default router;
