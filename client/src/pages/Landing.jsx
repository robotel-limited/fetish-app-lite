import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import { useAuth } from '../hooks/useAuth';

/**
 * Landing page with hero section and feature showcase
 * @returns {JSX.Element}
 */
export default function Landing() {
  const { user } = useAuth();

  if (user) return null;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-3xl font-bold mx-auto mb-8"
          >
            F
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Build{' '}
            <span className="gradient-text">Better</span>{' '}
            Habits
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
            Track your daily routines, build unstoppable streaks, and transform your life — one habit at a time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <GoogleLoginButton />
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-2">🔥 Streak tracking</span>
            <span className="flex items-center gap-2">📊 Analytics</span>
            <span className="flex items-center gap-2">🎯 Daily goals</span>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 gradient-text">Everything you need</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🔥', title: 'Streak Tracking', desc: 'Build and maintain streaks with visual progress bars and motivational feedback.' },
              { icon: '📊', title: 'Smart Dashboard', desc: 'See your progress at a glance with beautiful statistics and insights.' },
              { icon: '🎯', title: 'Daily Goals', desc: 'Set targets, log progress, and watch your consistency grow over time.' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-8 text-center glass-hover"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-12 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-4 gradient-text">Ready to transform?</h2>
          <p className="text-gray-400 mb-8">Start tracking your habits today. It's free.</p>
          <GoogleLoginButton />
        </motion.div>
      </section>
    </div>
  );
}
