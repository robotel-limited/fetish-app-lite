import { motion } from 'framer-motion';
import HabitList from '../components/habits/HabitList';

/**
 * Habits management page
 * @returns {JSX.Element}
 */
export default function Habits() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Habits</h1>
        <p className="text-gray-400 mt-1">Create, track, and manage your daily habits</p>
      </div>
      <HabitList />
    </motion.div>
  );
}
