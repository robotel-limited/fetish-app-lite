import { Router } from 'express';
import * as User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/user/profile
 * Get user profile
 */
router.get('/profile', authenticate, async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      email: req.user.email,
      displayName: req.user.display_name,
      avatarUrl: req.user.avatar_url,
      createdAt: req.user.created_at,
    },
  });
});

/**
 * PUT /api/user/profile
 * Update user profile
 */
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { display_name, avatar_url } = req.body;
    const user = await User.updateUser(req.user.id, { display_name, avatar_url });
    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        avatarUrl: user.avatar_url,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
