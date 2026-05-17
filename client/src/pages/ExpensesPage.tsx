import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import { PageLoader, EmptyState } from '@/components/LoadingSpinner';
import { expenseApi } from '@/services/endpoints';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/utils/currency';

const defaultCategories = ['food','transport','housing','utilities','entertainment','healthcare','education','shopping','personal','other'];
const categoryEmoji: Record<string, string> = {
  food: '🍔', transport: '🚗', housing: '🏠', utilities: '💡', entertainment: '🎬',
  healthcare: '🏥', education: '📚', shopping: '🛍️', personal: '👤', other: '📦',
};
const COLORS = ['#ff6b6b','#fcc419','#51cf66','#5c7cfa','#f06595','#845ef7','#22b8cf','#ff922b','#20c997','#adb5bd', '#e8590c', '#3bc9db'];

const getDatesForRange = (range: string) => {
  const today = new Date();
  let dateFrom = '';
  const dateTo = today.toISOString().split('T')[0];
  
  if (range === 'daily') {
    dateFrom = dateTo;
  } else if (range === 'weekly') {
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    dateFrom = lastWeek.toISOString().split('T')[0];
  } else if (range === 'monthly') {
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    dateFrom = lastMonth.toISOString().split('T')[0];
  } else if (range === 'yearly') {
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);
    dateFrom = lastYear.toISOString().split('T')[0];
  } else {
    dateFrom = '2000-01-01'; // all time
  }
  return { dateFrom, dateTo };
};

export default function ExpensesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [timeRange, setTimeRange] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0], notes: '' });

  const queryClient = useQueryClient();
  const { dbUser } = useAuthStore();
  const currency = dbUser?.preferences?.currency || 'USD';

  const { dateFrom, dateTo } = getDatesForRange(timeRange);

  const { data, isLoading } = useQuery({
    queryKey: ['expenses', search, dateFrom, dateTo],
    queryFn: () => expenseApi.getAll({ search, dateFrom, dateTo, limit: 1000 }),
    select: (res) => res.data.data,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => expenseApi.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['expenses'] }); toast.success('Expense added!'); closeModal(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => expenseApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['expenses'] }); toast.success('Updated!'); closeModal(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => expenseApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['expenses'] }); toast.success('Deleted!'); },
  });

  const openCreate = () => { setEditingExpense(null); setForm({ title: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0], notes: '' }); setIsAddingCategory(false); setModalOpen(true); };
  const openEdit = (e: any) => { setEditingExpense(e); setForm({ title: e.title, amount: String(e.amount), category: e.category, date: e.date, notes: e.notes || '' }); setIsAddingCategory(false); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingExpense(null); setIsAddingCategory(false); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, amount: parseFloat(form.amount) };
    editingExpense ? updateMutation.mutate({ id: editingExpense.id, data: payload }) : createMutation.mutate(payload);
  };

  const expenses = data || [];

  const { pieData, totalExpenses, averageDaily, uniqueCategories } = useMemo(() => {
    const filteredByCategory = expenses.filter((e: any) => !selectedCategory || e.category === selectedCategory);
    const total = filteredByCategory.reduce((sum: number, e: any) => sum + e.amount, 0);
    
    const byCategory = expenses.reduce((acc: any, e: any) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const chartData = Object.entries(byCategory)
      .filter(([, v]) => (v as number) > 0)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .map(([k, v], i) => ({ name: k, value: v as number, fill: COLORS[i % COLORS.length] }));

    let days = 1;
    if (timeRange === 'weekly') days = 7;
    else if (timeRange === 'monthly') days = 30;
    else if (timeRange === 'yearly') days = 365;
    else if (timeRange === 'all' && expenses.length > 0) {
      const oldest = expenses.reduce((min: string, e: any) => (e.date < min ? e.date : min), new Date().toISOString().split('T')[0]);
      days = Math.max(1, (new Date().getTime() - new Date(oldest).getTime()) / (1000 * 3600 * 24));
    }
    
    return {
      pieData: chartData,
      totalExpenses: total,
      averageDaily: total / days,
      uniqueCategories: Array.from(new Set([...defaultCategories, ...expenses.map((e: any) => e.category)])),
    };
  }, [expenses, selectedCategory, timeRange]);

  const pieTotal = pieData.reduce((sum, d) => sum + d.value, 0);

  if (isLoading) return <PageLoader />;

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="page-title">Expenses</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2" id="add-expense-btn">
          <HiOutlinePlus className="w-5 h-5" /> Add Expense
        </button>
      </div>

      {/* Summary Cards */}
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

      {/* Search */}
      <div className="relative">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-12" id="search-expenses" />
      </div>

      {/* Expense List */}
      {expenses.length === 0 ? (
        <EmptyState icon={<span className="text-4xl">💰</span>} title="No expenses" description="Start tracking your spending" action={<button onClick={openCreate} className="btn-primary">Add Expense</button>} />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {expenses.filter((e: any) => !selectedCategory || e.category === selectedCategory).map((exp: any) => (
              <motion.div key={exp.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card-hover p-4">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{categoryEmoji[exp.category] || '🏷️'}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{exp.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-dark-200 capitalize">{exp.category} · {exp.date}</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(exp.amount, currency)}</p>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(exp)} className="btn-ghost p-2"><HiOutlinePencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteMutation.mutate(exp.id)} className="btn-ghost p-2 text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>
            ))}
            {expenses.filter((e: any) => !selectedCategory || e.category === selectedCategory).length === 0 && (
              <div className="text-center p-8 text-gray-500">No expenses in this category for the selected period.</div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editingExpense ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Expense title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
          <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input-field" required step="0.01" min="0" />
          {isAddingCategory ? (
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="New Category Name" 
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value.toLowerCase() })} 
                className="input-field flex-1" 
                required 
                autoFocus
              />
              <button 
                type="button" 
                onClick={() => { setIsAddingCategory(false); setForm({ ...form, category: 'food' }); }} 
                className="btn-secondary px-4"
              >
                Cancel
              </button>
            </div>
          ) : (
            <select 
              value={form.category} 
              onChange={(e) => {
                if (e.target.value === 'ADD_NEW') {
                  setIsAddingCategory(true);
                  setForm({ ...form, category: '' });
                } else {
                  setForm({ ...form, category: e.target.value });
                }
              }} 
              className="input-field"
            >
              {uniqueCategories.map((c: any) => (
                <option key={c} value={c} className="bg-white dark:bg-dark-600 text-gray-900 dark:text-white capitalize">
                  {categoryEmoji[c] || '🏷️'} {c}
                </option>
              ))}
              <option value="ADD_NEW" className="bg-white dark:bg-dark-600 text-primary-500 font-bold">
                ➕ Add New Category...
              </option>
            </select>
          )}
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required max={new Date().toISOString().split('T')[0]} />
          <textarea placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field min-h-[60px] resize-none" />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{editingExpense ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
