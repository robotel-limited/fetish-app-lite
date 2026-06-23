import { motion, AnimatePresence } from 'framer-motion';

/**
 * Toast notification component
 * @param {object} props
 * @param {string} props.message
 * @param {'success'|'error'|'info'} props.type
 * @param {boolean} props.show
 * @param {Function} props.onClose
 * @returns {JSX.Element|null}
 */
export default function Toast({ message, type = 'info', show, onClose }) {
  const colors = {
    success: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300',
    error: 'from-red-500/20 to-rose-500/20 border-red-500/30 text-red-300',
    info: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30 text-indigo-300',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          className={`fixed top-20 right-4 z-50 glass rounded-xl p-4 border bg-gradient-to-r ${colors[type]} max-w-sm shadow-xl`}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg">{icons[type]}</span>
            <p className="text-sm flex-1">{message}</p>
            <button onClick={onClose} className="text-white/40 hover:text-white/80">
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
