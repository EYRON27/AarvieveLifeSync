import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/currency';

interface RecentActivityListProps {
  activity: any[];
  currency: string;
}

export default function RecentActivityList({ activity, currency }: RecentActivityListProps) {
  const typeIcons: Record<string, string> = {
    task: '📋', expense: '💰', time: '⏱️', food: '🍽️', password: '🔑',
  };

  return (
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
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {a.title} {a.metadata?.amount ? `- ${formatCurrency(a.metadata.amount as number, currency)}` : ''}
              </p>
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
  );
}
