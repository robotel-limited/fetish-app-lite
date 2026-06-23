import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/habits', label: 'Habits', icon: '✅' },
];

/**
 * Top navigation bar with glassmorphism
 * @returns {JSX.Element}
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-bold">
              F
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:block">Fetish App</span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-white bg-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-white/10 rounded-xl"
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors">
                  <img
                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.displayName}&background=6366f1&color=fff`}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full ring-2 ring-indigo-500/50"
                  />
                  <span className="text-sm text-gray-300 hidden sm:block">{user.displayName}</span>
                </Link>
                <button onClick={logout} className="btn-ghost text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/" className="btn-primary text-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
