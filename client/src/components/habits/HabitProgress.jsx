import { motion } from 'framer-motion';

/**
 * Habit progress visualization
 * @param {object} props
 * @param {Array} props.progress - Array of progress entries [{ date, count, note }]
 * @param {string} props.color - Hex color
 * @returns {JSX.Element}
 */
export default function HabitProgress({ progress = [], color = '#6366f1' }) {
  // Generate last 7 days
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const entry = progress.find(p => {
      const pDate = new Date(p.date).toISOString().split('T')[0];
      return pDate === dateStr;
    });
    return {
      date: d,
      dateStr,
      dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
      completed: !!entry,
      count: entry ? parseInt(entry.count, 10) : 0,
    };
  });

  return (
    <div className="flex items-end justify-center gap-2 h-20">
      {days.map((day, i) => (
        <motion.div
          key={day.dateStr}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: day.completed ? '100%' : '40%',
            opacity: 1,
          }}
          transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
          className="flex flex-col items-center gap-1"
        >
          <motion.div
            className="w-6 rounded-md transition-all duration-300"
            style={{
              height: day.completed ? '100%' : '40%',
              background: day.completed
                ? `linear-gradient(180deg, ${color}, ${color}80)`
                : 'rgba(255,255,255,0.05)',
              boxShadow: day.completed ? `0 0 10px ${color}40` : 'none',
            }}
          />
          <span className={`text-[10px] ${day.completed ? 'text-gray-300' : 'text-gray-600'}`}>
            {day.dayLabel}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
