import { motion } from 'framer-motion';

/**
 * Glassmorphism card component
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 * @param {object} props.style - Extra styles
 * @returns {JSX.Element}
 */
export default function Card({ children, className = '', style, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-6 glass-hover ${className}`}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}
