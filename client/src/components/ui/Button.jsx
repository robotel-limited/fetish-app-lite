import { motion } from 'framer-motion';

/**
 * Reusable button component with glassmorphism styling
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {'primary'|'ghost'|'danger'} props.variant
 * @param {boolean} props.loading
 * @param {boolean} props.disabled
 * @param {Function} props.onClick
 * @param {string} props.className
 * @param {string} props.type
 * @returns {JSX.Element}
 */
export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  const base = 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-400 hover:shadow-lg hover:shadow-indigo-500/25',
    ghost: 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10',
    danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
