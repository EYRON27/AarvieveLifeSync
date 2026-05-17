import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className={`${sizes[size]} border-3 border-primary-200 dark:border-dark-400 border-t-primary-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

/** Full-screen overlay loader for auth transitions (login / register / logout) */
export function FullScreenLoader({ isVisible, message = 'Please wait...' }: { isVisible: boolean; message?: string }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="fullscreen-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center
            bg-dark-900/90 backdrop-blur-md"
        >
          {/* Outer spinning ring */}
          <div className="relative flex items-center justify-center mb-6">
            <motion.div
              className="w-20 h-20 rounded-full border-4 border-primary-500/20 border-t-primary-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            />
            {/* Inner pulsing logo */}
            <motion.div
              className="absolute w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500
                flex items-center justify-center shadow-lg shadow-primary-500/40"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-white font-bold text-xl font-display">A</span>
            </motion.div>
          </div>

          {/* Message */}
          <motion.p
            className="text-white font-medium text-base tracking-wide"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {message}
          </motion.p>

          {/* Subtle dot trail */}
          <div className="flex gap-1.5 mt-3">
            {[0, 0.2, 0.4].map((delay) => (
              <motion.div
                key={delay}
                className="w-1.5 h-1.5 rounded-full bg-primary-400"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity, delay, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto border-4 border-primary-200 dark:border-dark-400 border-t-primary-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="mt-4 text-gray-500 dark:text-dark-200 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <div className="p-4 rounded-2xl bg-gray-100 dark:bg-dark-600 mb-4">
        <div className="w-12 h-12 text-gray-400 dark:text-dark-200">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-dark-100">{title}</h3>
      <p className="text-gray-500 dark:text-dark-200 mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
