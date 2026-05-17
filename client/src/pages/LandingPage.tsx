import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';

export default function LandingPage() {
  const { setLoginModalOpen } = useUIStore();

  return (
    <section className="flex-1 flex flex-col items-center justify-center pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        {/* Tag badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
          Your all-in-one productivity hub
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
          Master Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-amber-400">
            Daily Life
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          AarvieveLifeSync is your all-in-one personal productivity hub. Manage tasks, track expenses, secure passwords, and more.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setLoginModalOpen(true)}
            className="px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 active:scale-95 w-full sm:w-auto"
          >
            Get Started Free
          </button>
          <Link
            to="/services"
            className="px-8 py-4 rounded-xl font-bold text-lg text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 w-full sm:w-auto text-center"
          >
            Explore Services
          </Link>
        </div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-14"
        >
          {['Tasks', 'Expenses', 'Passwords', 'Time', 'Food'].map((label, i) => {
            const colors = [
              'bg-primary-500/10 text-primary-400 border-primary-500/20',
              'bg-accent-500/10 text-accent-400 border-accent-500/20',
              'bg-amber-500/10 text-amber-400 border-amber-500/20',
              'bg-orange-500/10 text-orange-400 border-orange-500/20',
              'bg-rose-500/10 text-rose-400 border-rose-500/20',
            ];
            return (
              <span
                key={label}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border ${colors[i]}`}
              >
                {label}
              </span>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
