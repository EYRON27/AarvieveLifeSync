import { motion } from 'framer-motion';
import { HiOutlinePlay, HiOutlineStop } from 'react-icons/hi';

interface TimerCardProps {
  running: any;
  elapsed: number;
  formatTime: (seconds: number) => string;
  stopMutation: any;
  openStartTimerModal: () => void;
}

export default function TimerCard({
  running, elapsed, formatTime, stopMutation, openStartTimerModal
}: TimerCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 text-center">
      <p className="text-sm font-medium text-gray-500 dark:text-dark-200 mb-2">
        {running ? `Working on: ${running.title}` : 'Ready to start'}
      </p>
      <p className={`text-6xl font-display font-bold tracking-wider ${running ? 'gradient-text' : 'text-gray-300 dark:text-dark-400'}`}>
        {formatTime(elapsed)}
      </p>
      <div className="mt-6">
        {running ? (
          <button onClick={() => stopMutation.mutate(running.id)}
            className="px-8 py-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-all inline-flex items-center gap-2">
            <HiOutlineStop className="w-5 h-5" /> Stop Timer
          </button>
        ) : (
          <button onClick={openStartTimerModal}
            className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            <HiOutlinePlay className="w-5 h-5" /> Start Timer
          </button>
        )}
      </div>
    </motion.div>
  );
}
