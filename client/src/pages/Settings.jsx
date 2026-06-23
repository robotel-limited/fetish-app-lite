import { motion } from 'framer-motion';

/**
 * Settings page
 * @returns {JSX.Element}
 */
export default function Settings() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-3xl mx-auto"
    >
      <h1 className="text-3xl font-bold gradient-text mb-8">Settings</h1>

      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Preferences</h2>
          <p className="text-sm text-gray-400 mb-4">Customize your app experience</p>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div>
                <p className="text-sm font-medium text-white">Email Notifications</p>
                <p className="text-xs text-gray-500">Get reminders to log your habits</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-indigo-500 relative cursor-pointer">
                <div className="w-4 h-4 rounded-full bg-white absolute top-1 right-1" />
              </div>
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div>
                <p className="text-sm font-medium text-white">Dark Mode</p>
                <p className="text-xs text-gray-500">Always on — we love the dark side</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-indigo-500 relative opacity-60">
                <div className="w-4 h-4 rounded-full bg-white absolute top-1 right-1" />
              </div>
            </label>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Account</h2>
          <p className="text-sm text-gray-400 mb-4">Account management options</p>

          <div className="space-y-3">
            <button className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm text-gray-300">
              Export my data
            </button>
            <button className="w-full text-left p-4 rounded-xl bg-red-500/5 hover:bg-red-500/10 transition-colors text-sm text-red-400">
              Delete account
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
