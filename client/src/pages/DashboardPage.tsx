import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { PageLoader } from '@/components/LoadingSpinner';
import { dashboardApi, authApi } from '@/services/endpoints';
import { useAuthStore } from '@/store/authStore';
import StatsGrid from '@/components/dashboard/StatsGrid';
import TaskDistributionChart from '@/components/dashboard/TaskDistributionChart';
import RecentActivityList from '@/components/dashboard/RecentActivityList';
import QuickStatsBottom from '@/components/dashboard/QuickStatsBottom';

export default function DashboardPage() {
  const { user, dbUser, setDbUser } = useAuthStore();
  const firstName = (dbUser?.displayName || user?.displayName)?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
  const currency = dbUser?.preferences?.currency || 'USD';

  const [showTerms, setShowTerms] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    // Show terms if not accepted locally
    if (user && !localStorage.getItem(`dashboardTermsAccepted_${user.uid}`)) {
      setShowTerms(true);
    }
  }, [user]);

  const handleAcceptTerms = () => {
    if (!agreeToTerms) return;
    if (user) {
      localStorage.setItem(`dashboardTermsAccepted_${user.uid}`, 'true');
    }
    setShowTerms(false);
  };

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

      {/* Dashboard Terms Modal */}
      {createPortal(
        <AnimatePresence>
          {showTerms && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-[#1a1a2e] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Welcome to Aarvieve LifeSync! 🎉</h3>
                  <p className="text-sm text-white/60 mt-1">Please confirm you understand our terms before continuing.</p>
                </div>

                <div className="p-6 overflow-y-auto text-sm text-white/70 space-y-5 custom-scrollbar flex-1">
                  <div>
                    <h4 className="font-semibold text-white text-base mb-1">1. Data Security & Encryption</h4>
                    <p>At LifeSync, we prioritize the security of your data. All sensitive information, including your passwords and financial records, are encrypted both in transit and at rest using industry-standard encryption protocols.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-base mb-1">2. Privacy</h4>
                    <p>We will never sell, rent, or share your personal data with third parties. Your data is your own, and we only process it to provide the LifeSync services to you.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-base mb-1">3. User Responsibilities</h4>
                    <p>You are responsible for maintaining the confidentiality of your account password. If you believe your account has been compromised, you must notify us immediately.</p>
                  </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-black/20 shrink-0">
                  <div className="flex items-start mb-6">
                    <div className="flex items-center h-5 mt-0.5">
                      <div
                        onClick={() => setAgreeToTerms(!agreeToTerms)}
                        className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${agreeToTerms ? 'bg-[#5c7cfa] border-[#5c7cfa]' : 'bg-black/20 border-white/20'}`}
                      >
                        {agreeToTerms && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="ml-3 text-left">
                      <span
                        onClick={() => setAgreeToTerms(!agreeToTerms)}
                        className="text-sm font-medium text-white/90 cursor-pointer select-none"
                      >
                        I have read and agree to the Terms of Service.
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleAcceptTerms}
                    disabled={!agreeToTerms}
                    className="w-full py-3.5 bg-[#5c7cfa] hover:bg-[#4c6cf0] disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg"
                  >
                    Understand
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
