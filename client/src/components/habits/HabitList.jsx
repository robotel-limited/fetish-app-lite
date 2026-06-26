import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import HabitCard from './HabitCard';
import HabitForm from './HabitForm';
import { useHabits } from '../../hooks/useHabits';
import toast from 'react-hot-toast';

/**
 * List of habits with create/edit/delete and progress logging
 * @returns {JSX.Element}
 */
export default function HabitList() {
  const { habits, loading, error, createHabit, updateHabit, deleteHabit, logProgress, fetchHabits } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editHabit, setEditHabit] = useState(null);

  const handleCreate = async (data) => {
    await createHabit(data);
    toast.success('Habit created!');
  };

  const handleEdit = async (data) => {
    if (!editHabit) return;
    await updateHabit(editHabit.id, data);
    toast.success('Habit updated!');
    setEditHabit(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this habit?')) return;
    await deleteHabit(id);
    toast.success('Habit deleted');
  };

  const handleLog = async (habitId) => {
    try {
      const result = await logProgress(habitId);
      const streak = result?.streak || 0;
      if (streak > 0 && streak % 7 === 0) {
        toast.success(`🔥 ${streak}-day streak! Keep it up!`);
      } else {
        toast.success('Progress logged!');
      }
      fetchHabits();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to log progress');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 rounded shimmer" />
                <div className="h-3 w-1/2 rounded shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchHabits} className="btn-primary text-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header with create button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-lg font-semibold text-gray-300">Your Habits ({habits.length})</h2>
        <button onClick={() => { setEditHabit(null); setShowForm(true); }} className="btn-primary text-sm w-full sm:w-auto">
          + New Habit
        </button>
      </div>

      {/* Empty state */}
      {habits.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">📋</p>
          <h3 className="text-xl font-semibold text-white mb-2">No habits yet</h3>
          <p className="text-gray-400 mb-6">Create your first habit to start tracking your progress!</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Create Your First Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onLog={handleLog}
                onEdit={(h) => { setEditHabit(h); setShowForm(true); }}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit form modal */}
      <HabitForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditHabit(null); }}
        onSubmit={editHabit ? handleEdit : handleCreate}
        editHabit={editHabit}
      />
    </div>
  );
}
