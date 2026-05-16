import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  gradient?: string;
  trend?: { value: number; label: string };
}

export default function StatCard({ title, value, subtitle, icon, gradient = 'from-primary-500 to-primary-700', trend }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="glass-card p-6 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
        <div className={`w-full h-full rounded-full bg-gradient-to-br ${gradient} blur-2xl`} />
      </div>

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-dark-200">{title}</p>
          <p className="text-3xl font-display font-bold mt-1 text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-400 dark:text-dark-200 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${trend.value >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-gray-400 dark:text-dark-200">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <div className="text-white w-6 h-6">{icon}</div>
        </div>
      </div>
    </motion.div>
  );
}
