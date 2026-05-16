import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  HiOutlineClipboardList, HiOutlineCurrencyDollar, HiOutlineClock,
  HiOutlineHeart, HiOutlineKey, HiOutlineChartBar,
} from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '@/components/StatCard';
import { PageLoader } from '@/components/LoadingSpinner';
import { dashboardApi } from '@/services/endpoints';

const COLORS = ['#5c7cfa', '#f06595', '#51cf66', '#fcc419', '#ff922b', '#845ef7', '#22b8cf', '#ff6b6b'];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { data: statsRes, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
    select: (res) => res.data.data,
  });

  const { data: activityRes } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: () => dashboardApi.getActivity(),
    select: (res) => res.data.data,
  });

  if (isLoading) return <PageLoader />;

  const stats = statsRes || {
    tasks: { total: 0, completed: 0, overdue: 0, inProgress: 0 },
    expenses: { monthTotal: 0, weekTotal: 0, todayTotal: 0, topCategory: 'N/A' },
    timeTracker: { todayHours: 0, weekHours: 0, activeTimer: false, topProject: 'N/A' },
    foodTracker: { todayCalories: 0, calorieGoal: 2000, todayMeals: 0 },
    passwords: { totalEntries: 0 },
  };

  const activity = activityRes || [];

  const taskChartData = [
    { name: 'Todo', value: stats.tasks.total - stats.tasks.completed - stats.tasks.inProgress, fill: '#fcc419' },
    { name: 'In Progress', value: stats.tasks.inProgress, fill: '#5c7cfa' },
    { name: 'Completed', value: stats.tasks.completed, fill: '#51cf66' },
    { name: 'Overdue', value: stats.tasks.overdue, fill: '#ff6b6b' },
  ].filter((d) => d.value > 0);

  const caloriePercent = Math.min(100, Math.round((stats.foodTracker.todayCalories / stats.foodTracker.calorieGoal) * 100));

  const typeIcons: Record<string, string> = {
    task: '📋', expense: '💰', time: '⏱️', food: '🍽️', password: '🔑',
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-gray-500 dark:text-dark-200 mt-1">Welcome back! Here's your productivity overview.</p>
        </div>
      </div>

      {/* Stats Grid */}
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
            gradient="from-blue-500 to-blue-700"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Monthly Expenses"
            value={`$${stats.expenses.monthTotal.toFixed(2)}`}
            subtitle={`Top: ${stats.expenses.topCategory}`}
            icon={<HiOutlineCurrencyDollar className="w-6 h-6" />}
            gradient="from-emerald-500 to-emerald-700"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Week Hours"
            value={`${stats.timeTracker.weekHours}h`}
            subtitle={stats.timeTracker.activeTimer ? '🔴 Timer active' : `Top: ${stats.timeTracker.topProject}`}
            icon={<HiOutlineClock className="w-6 h-6" />}
            gradient="from-violet-500 to-violet-700"
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="section-title mb-4">Task Distribution</h3>
          {taskChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={taskChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 30, 40, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-400">No tasks yet</div>
          )}
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {taskChartData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.fill }} />
                <span className="text-gray-600 dark:text-dark-100">{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="section-title mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-[320px] overflow-y-auto">
            {activity.length > 0 ? activity.map((a: any) => (
              <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-500/50 transition-colors">
                <span className="text-xl">{typeIcons[a.type] || '📌'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{a.title}</p>
                  <p className="text-xs text-gray-400 dark:text-dark-200">
                    {new Date(a.timestamp).toLocaleDateString()} · {a.action}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-400">No recent activity</div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats Bottom */}
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
          <div className="p-3 rounded-xl bg-cyan-500/10">
            <HiOutlineChartBar className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.foodTracker.todayMeals}</p>
            <p className="text-sm text-gray-500 dark:text-dark-200">Meals Today</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10">
            <HiOutlineClock className="w-6 h-6 text-violet-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.timeTracker.todayHours}h</p>
            <p className="text-sm text-gray-500 dark:text-dark-200">Today's Focus Time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
