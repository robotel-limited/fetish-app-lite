import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const habitEmojis = ['⏰', '📖', '💻', '🚶', '🏆', '💪', '🧘', '🎯', '📝', '🎨', '🏃', '🧠', '🌱', '🎵', '✍️'];
const habitColors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#22d3ee', '#f97316', '#ec4899'];

/**
 * Habit creation/edit form inside a modal
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onSubmit
 * @param {object|null} props.editHabit - Habit to edit, null for new
 * @returns {JSX.Element}
 */
export default function HabitForm({ isOpen, onClose, onSubmit, editHabit }) {
  const [name, setName] = useState(editHabit?.name || '');
  const [emoji, setEmoji] = useState(editHabit?.emoji || '📌');
  const [description, setDescription] = useState(editHabit?.description || '');
  const [frequency, setFrequency] = useState(editHabit?.frequency || 'daily');
  const [targetCount, setTargetCount] = useState(editHabit?.target_count || 1);
  const [targetUnit, setTargetUnit] = useState(editHabit?.target_unit || '');
  const [color, setColor] = useState(editHabit?.color || '#6366f1');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        emoji,
        description: description.trim(),
        frequency,
        target_count: targetCount,
        target_unit: targetUnit,
        color,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editHabit ? 'Edit Habit' : 'Create Habit'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Morning meditation"
            className="input-glass"
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this habit about?"
            className="input-glass resize-none h-20"
          />
        </div>

        {/* Emoji picker */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Icon</label>
          <div className="flex flex-wrap gap-2">
            {habitEmojis.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                  emoji === e
                    ? 'bg-indigo-500/20 border border-indigo-500/50 scale-110'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {habitColors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-all ${
                  color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-950 scale-110' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Frequency + Target */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Frequency</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="input-glass">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Target</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={targetCount}
                onChange={(e) => setTargetCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="input-glass w-20"
                min="1"
              />
              <input
                type="text"
                value={targetUnit}
                onChange={(e) => setTargetUnit(e.target.value)}
                placeholder="unit"
                className="input-glass flex-1"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} type="button" className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            {editHabit ? 'Save Changes' : 'Create Habit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
