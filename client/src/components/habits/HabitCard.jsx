import { motion } from 'framer-motion';
import { getHabitColors, getStreakMessage } from '../../utils/helpers';

/**
 * Individual habit card with glassmorphism, streak display, and animations
 * @param {object} props
 * @param {object} props.habit - { id, name, emoji, description, color, streak, completedToday, todayCount, target_count, target_unit }
 * @param {Function} props.onLog - Callback to log progress
 * @param {Function} props.onEdit - Callback to edit
 * @param {Function} props.onDelete - Callback to delete
 * @returns {JSX.Element}
 */
export default function HabitCard({ habit, onLog, onEdit, onDelete }) {
  const colors = getHabitColors(habit.emoji);
  const streakMsg = getStreakMessage(habit.streak || 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300 } }}
      className="glass rounded-2xl p-5 glass-hover group relative overflow-hidden"
    >
      {/* Gradient accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }}
      />

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: `linear-gradient(135deg, ${colors.from}20, ${colors.to}20)` }}
          >
            {habit.emoji}
          </div>
          <div>
            <h3 className="font-semibold text-white">{habit.name}</h3>
            {habit.description && (
              <p className="text-sm text-gray-400 mt-0.5">{habit.description}</p>
            )}
            {habit.target_unit && (
              <p className="text-xs text-gray-500 mt-1">Target: {habit.target_count} {habit.target_unit}</p>
            )}
          </div>
        </div>

        {/* Streak badge */}
        {habit.streak > 0 && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
          >
            <span className="text-sm">🔥</span>
            <span className="text-sm font-bold text-orange-300">{habit.streak}</span>
          </motion.div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
          <span>{habit.completedToday ? 'Completed today' : 'Not completed today'}</span>
          <span>{streakMsg}</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: habit.completedToday ? '100%' : '0%' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4 pt-3 border-t border-white/5">
        <div className="flex-1">
          {!habit.completedToday && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLog(habit.id)}
              className="w-full py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-400 transition-all duration-200"
            >
              Log Progress
            </motion.button>
          )}
          {habit.completedToday && (
            <div className="w-full py-2 text-sm font-medium rounded-xl bg-green-500/10 text-green-400 text-center border border-green-500/20">
              ✓ Completed
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(habit)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"
          >
            🗑️
          </button>
        </div>
      </div>
    </motion.div>
  );
}
