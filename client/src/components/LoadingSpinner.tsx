import { motion } from 'framer-motion';

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
