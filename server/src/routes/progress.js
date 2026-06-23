import { Router } from 'express';
import * as Progress from '../models/Progress.js';
import { authenticate } from '../middleware/auth.js';
import { logHabitProgress, getDashboardStats } from '../services/habitService.js';

const router = Router();

/**
 * POST /api/progress
 * Log progress for a habit
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { habit_id, date, count, note } = req.body;
    if (!habit_id) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_HABIT', message: 'habit_id is required' } });
    }

    const result = await logHabitProgress(habit_id, req.user.id, { date, count, note });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/progress/today
 * Get today's progress for all habits
 */
router.get('/today', authenticate, async (req, res, next) => {
  try {
    const progress = await Progress.getTodayProgress(req.user.id);
    res.json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/progress/streaks
 * Get all streaks
 */
router.get('/streaks', authenticate, async (req, res, next) => {
  try {
    const streaks = await Progress.getAllStreaks(req.user.id);
    res.json({ success: true, data: streaks });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/progress/dashboard
 * Get dashboard stats
 */
router.get('/dashboard', authenticate, async (req, res, next) => {
  try {
    const data = await getDashboardStats(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/progress/:habitId
 * Get progress for a specific habit
 */
router.get('/:habitId', authenticate, async (req, res, next) => {
  try {
    const endDate = req.query.end ? new Date(req.query.end) : new Date();
    const startDate = req.query.start ? new Date(req.query.start) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const progress = await Progress.getProgress(req.params.habitId, req.user.id, startDate, endDate);
    res.json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
});

export default router;
