import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const sidebarLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/habits', label: 'Habits', icon: '✅' },
  { path: '/profile', label: 'Profile', icon: '👤' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

/**
 * Sidebar navigation with glassmorphism
 * @returns {JSX.Element}
 */
export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 glass border-r border-white/10 hidden md:block z-30">
      <div className="p-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-xl border border-indigo-500/20"
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                />
              )}
              <span className="relative z-10 text-lg">{link.icon}</span>
              <span className="relative z-10">{link.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-dot"
                  className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-400"
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl mb-1">🔥</p>
          <p className="text-xs text-gray-400">Keep your streak alive!</p>
        </div>
      </div>
    </aside>
  );
}
