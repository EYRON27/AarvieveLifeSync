import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyChartProps {
  summary: any;
}

export default function WeeklyChart({ summary }: WeeklyChartProps) {
  if (!summary?.weeklyTrend) return null;

  return (
    <div className="glass-card p-6">
      <h3 className="section-title mb-4">Weekly Overview</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold gradient-text">{summary.totalHours}h</p>
          <p className="text-sm text-gray-500 dark:text-dark-200">This Week</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.averageDaily}h</p>
          <p className="text-sm text-gray-500 dark:text-dark-200">Daily Avg</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{Object.keys(summary.byProject || {}).length}</p>
          <p className="text-sm text-gray-500 dark:text-dark-200">Projects</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={summary.weeklyTrend}>
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: 'rgba(30,30,40,0.9)', border: 'none', borderRadius: '12px', color: '#fff' }} />
          <Bar dataKey="hours" fill="#5c7cfa" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
