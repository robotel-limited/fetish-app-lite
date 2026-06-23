/**
 * Format a date string for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Get today's date as YYYY-MM-DD
 * @returns {string}
 */
export function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Classname utility for conditional classes
 * @param  {...(string|object|boolean)} args
 * @returns {string}
 */
export function cn(...args) {
  return args
    .filter(Boolean)
    .map(arg => {
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'object') {
        return Object.entries(arg)
          .filter(([, v]) => v)
          .map(([k]) => k)
          .join(' ');
      }
      return '';
    })
    .join(' ');
}

/**
 * Get emoji-based gradient colors for a habit
 * @param {string} emoji
 * @returns {object} { from, to }
 */
export function getHabitColors(emoji) {
  const colorMap = {
    '⏰': { from: '#f59e0b', to: '#f97316' },
    '📖': { from: '#10b981', to: '#059669' },
    '💻': { from: '#6366f1', to: '#4f46e5' },
    '🚶': { from: '#22d3ee', to: '#0891b2' },
    '🏆': { from: '#8b5cf6', to: '#7c3aed' },
  };
  return colorMap[emoji] || { from: '#6366f1', to: '#8b5cf6' };
}

/**
 * Get a motivational message based on streak count
 * @param {number} streak
 * @returns {string}
 */
export function getStreakMessage(streak) {
  if (streak === 0) return 'Start your streak today!';
  if (streak < 3) return 'Good start! Keep going!';
  if (streak < 7) return 'Building momentum!';
  if (streak < 14) return 'You\'re on fire! 🔥';
  if (streak < 30) return 'Unstoppable! 💪';
  if (streak < 60) return 'Legendary streak! ⚡';
  return 'Absolutely crushing it! 🏆';
}
