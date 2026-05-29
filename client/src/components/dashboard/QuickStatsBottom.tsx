import { HiOutlineKey, HiOutlineChartBar, HiOutlineClock } from 'react-icons/hi';

interface QuickStatsBottomProps {
  stats: any;
}

export default function QuickStatsBottom({ stats }: QuickStatsBottomProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="glass-card p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-amber-500/10">
          <HiOutlineKey className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.passwords.totalEntries}</p>
          <p className="text-sm text-gray-500 dark:text-dark-200">Saved Passwords</p>
        </div>
      </div>
      <div className="glass-card p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-accent-500/10">
          <HiOutlineChartBar className="w-6 h-6 text-accent-500" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.foodTracker.todayMeals}</p>
          <p className="text-sm text-gray-500 dark:text-dark-200">Meals Today</p>
        </div>
      </div>
      <div className="glass-card p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-orange-500/10">
          <HiOutlineClock className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.timeTracker.todayHours}h</p>
          <p className="text-sm text-gray-500 dark:text-dark-200">Today's Focus Time</p>
        </div>
      </div>
    </div>
  );
}
