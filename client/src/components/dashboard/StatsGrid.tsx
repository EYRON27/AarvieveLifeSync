import { motion } from 'framer-motion';
import { HiOutlineClipboardList, HiOutlineCurrencyDollar, HiOutlineClock, HiOutlineHeart } from 'react-icons/hi';
import StatCard from '@/components/StatCard';
import { formatCurrency } from '@/utils/currency';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface StatsGridProps {
  stats: any;
  currency: string;
  caloriePercent: number;
}

export default function StatsGrid({ stats, currency, caloriePercent }: StatsGridProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <motion.div variants={item}>
        <StatCard
          title="Total Tasks"
          value={stats.tasks.total}
          subtitle={`${stats.tasks.completed} completed`}
          icon={<HiOutlineClipboardList className="w-6 h-6" />}
          gradient="from-primary-500 to-primary-700"
        />
      </motion.div>
      <motion.div variants={item}>
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(stats.expenses.monthTotal, currency)}
          subtitle={`Top: ${stats.expenses.topCategory}`}
          icon={<HiOutlineCurrencyDollar className="w-6 h-6" />}
          gradient="from-accent-500 to-accent-700"
        />
      </motion.div>
      <motion.div variants={item}>
        <StatCard
          title="Week Hours"
          value={`${stats.timeTracker.weekHours}h`}
          subtitle={stats.timeTracker.activeTimer ? '🔴 Timer active' : `Top: ${stats.timeTracker.topProject}`}
          icon={<HiOutlineClock className="w-6 h-6" />}
          gradient="from-orange-500 to-orange-700"
        />
      </motion.div>
      <motion.div variants={item}>
        <StatCard
          title="Today's Calories"
          value={stats.foodTracker.todayCalories}
          subtitle={`${caloriePercent}% of goal (${stats.foodTracker.calorieGoal})`}
          icon={<HiOutlineHeart className="w-6 h-6" />}
          gradient="from-rose-500 to-rose-700"
        />
      </motion.div>
    </motion.div>
  );
}
