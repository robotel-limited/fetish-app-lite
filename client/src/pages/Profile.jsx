import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/helpers';

/**
 * User profile page
 * @returns {JSX.Element}
 */
export default function Profile() {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 max-w-3xl mx-auto"
    >
      <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-6 sm:mb-8">Profile</h1>

      <div className="glass rounded-2xl p-4 sm:p-8">
        <div className="flex items-center gap-6 mb-8">
          <img
            src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.displayName}&background=6366f1&color=fff&size=80`}
            alt={user?.displayName}
            className="w-20 h-20 rounded-2xl ring-2 ring-indigo-500/50"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.displayName}</h2>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5">
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="text-white">{user?.email}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <p className="text-sm text-gray-500 mb-1">Display Name</p>
            <p className="text-white">{user?.displayName}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <p className="text-sm text-gray-500 mb-1">Member Since</p>
            <p className="text-white">{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <p className="text-sm text-gray-500 mb-1">User ID</p>
            <p className="text-white text-sm font-mono truncate">{user?.id || 'N/A'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
