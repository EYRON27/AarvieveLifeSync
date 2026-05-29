import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { HiOutlineFilter } from 'react-icons/hi';
import { formatCurrency } from '@/utils/currency';

interface ExpenseSummaryCardsProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
  totalExpenses: number;
  averageDaily: number;
  currency: string;
  pieData: any[];
  pieTotal: number;
}

export default function ExpenseSummaryCards({
  selectedCategory, setSelectedCategory, timeRange, setTimeRange, 
  totalExpenses, averageDaily, currency, pieData, pieTotal
}: ExpenseSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="glass-card p-6 lg:col-span-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-title">
              {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Total` : 'Total Spent'}
            </h3>
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="bg-transparent border border-gray-200 dark:border-dark-400 rounded-lg px-2 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none">
              <option value="daily" className="bg-white dark:bg-dark-600 text-gray-900 dark:text-white">Daily</option>
              <option value="weekly" className="bg-white dark:bg-dark-600 text-gray-900 dark:text-white">Weekly</option>
              <option value="monthly" className="bg-white dark:bg-dark-600 text-gray-900 dark:text-white">Monthly</option>
              <option value="yearly" className="bg-white dark:bg-dark-600 text-gray-900 dark:text-white">Yearly</option>
              <option value="all" className="bg-white dark:bg-dark-600 text-gray-900 dark:text-white">All Time</option>
            </select>
          </div>
          <p className="text-4xl font-display font-bold gradient-text">{formatCurrency(totalExpenses, currency)}</p>
          <p className="text-sm text-gray-500 dark:text-dark-200 mt-2">Avg {formatCurrency(averageDaily, currency)}/day</p>
        </div>
        {selectedCategory && (
          <button onClick={() => setSelectedCategory(null)} className="mt-4 text-sm font-medium text-primary-500 hover:text-primary-600 self-start flex items-center gap-1">
            <HiOutlineFilter className="w-4 h-4" /> Clear Filter
          </button>
        )}
      </div>
      <div className="glass-card p-6 lg:col-span-2">
        <h3 className="section-title mb-4">By Category <span className="text-sm font-normal text-gray-500 ml-2">(Click to filter)</span></h3>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie 
                data={pieData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value"
                onClick={(data) => setSelectedCategory(selectedCategory === data.name ? null : data.name)}
                cursor="pointer"
                className="focus:outline-none"
              >
                {pieData.map((entry, i) => (
                  <Cell 
                    key={i} 
                    fill={entry.fill} 
                    style={{ opacity: selectedCategory ? (selectedCategory === entry.name ? 1 : 0.3) : 1, transition: 'opacity 0.2s' }}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number, name: string) => [`${formatCurrency(v, currency)} (${((v / pieTotal) * 100).toFixed(1)}%)`, name]}
                contentStyle={{ backgroundColor: 'rgba(15,15,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#ffffff', fontSize: '13px', fontWeight: 600 }}
                itemStyle={{ color: '#ffffff' }}
                labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : <div className="h-[200px] flex items-center justify-center text-gray-400">No data</div>}
      </div>
    </div>
  );
}
