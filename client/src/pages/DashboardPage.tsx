import { useQuery } from '@tanstack/react-query';
import { PageLoader } from '@/components/LoadingSpinner';
import { dashboardApi } from '@/services/endpoints';
import { useAuthStore } from '@/store/authStore';
import StatsGrid from '@/components/dashboard/StatsGrid';
import TaskDistributionChart from '@/components/dashboard/TaskDistributionChart';
import RecentActivityList from '@/components/dashboard/RecentActivityList';
import QuickStatsBottom from '@/components/dashboard/QuickStatsBottom';

export default function DashboardPage() {
  const { user, dbUser } = useAuthStore();
  const firstName = (dbUser?.displayName || user?.displayName)?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
  const currency = dbUser?.preferences?.currency || 'USD';

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
    { name: 'Todo', value: stats.tasks.total - stats.tasks.completed - stats.tasks.inProgress, fill: '#f59e0b' },
    { name: 'In Progress', value: stats.tasks.inProgress, fill: '#06b6d4' },
    { name: 'Completed', value: stats.tasks.completed, fill: '#10b981' },
    { name: 'Overdue', value: stats.tasks.overdue, fill: '#f43f5e' },
  ].filter((d) => d.value > 0);

  const caloriePercent = Math.min(100, Math.round((stats.foodTracker.todayCalories / stats.foodTracker.calorieGoal) * 100));

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-gray-500 dark:text-dark-200 mt-1">
            Welcome back, <span className="font-semibold text-primary-400">{firstName}</span>! Here's your productivity overview.
          </p>
        </div>
      </div>

      <StatsGrid stats={stats} currency={currency} caloriePercent={caloriePercent} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskDistributionChart taskChartData={taskChartData} />
        <RecentActivityList activity={activity} currency={currency} />
      </div>

      <QuickStatsBottom stats={stats} />
    </div>
  );
}
