import { Router } from 'express';
import * as Habit from '../models/Habit.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/habits
 * List habits for authenticated user
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = parseInt(req.query.offset, 10) || 0;
    const activeOnly = req.query.active_only !== 'false';

    const result = await Habit.getHabitsByUser(req.user.id, { limit, offset, active_only: activeOnly });
    res.json({
      success: true,
      data: result.habits,
      meta: { total: result.total, limit, offset },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/habits
 * Create a new habit
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { name, emoji, description, frequency, target_count, target_unit, color } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_NAME', message: 'Habit name is required' } });
    }

    const habit = await Habit.createHabit({
      user_id: req.user.id,
      name,
      emoji: emoji || '📌',
      description,
      frequency: frequency || 'daily',
      target_count: target_count || 1,
      target_unit,
      color: color || '#6366f1',
    });

    res.status(201).json({ success: true, data: habit });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/habits/:id
 * Get a single habit
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const habit = await Habit.getHabitById(req.params.id);
    if (!habit || habit.user_id !== req.user.id) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Habit not found' } });
    }
    res.json({ success: true, data: habit });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/habits/:id
 * Update a habit
 */
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { name, emoji, description, frequency, target_count, target_unit, color, is_active } = req.body;
    const habit = await Habit.updateHabit(req.params.id, req.user.id, {
      name, emoji, description, frequency, target_count, target_unit, color, is_active,
    });
    if (!habit) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Habit not found or unauthorized' } });
    }
    res.json({ success: true, data: habit });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/habits/:id
 * Soft-delete a habit
 */
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const deleted = await Habit.deleteHabit(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Habit not found' } });
    }
    res.json({ success: true, data: { message: 'Habit deleted' } });
  } catch (err) {
    next(err);
  }
});

export default router;
