import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineSearch } from 'react-icons/hi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import { PageLoader, EmptyState } from '@/components/LoadingSpinner';
import { expenseApi } from '@/services/endpoints';

const categories = ['food','transport','housing','utilities','entertainment','healthcare','education','shopping','personal','other'];
const categoryEmoji: Record<string, string> = {
  food: '🍔', transport: '🚗', housing: '🏠', utilities: '💡', entertainment: '🎬',
  healthcare: '🏥', education: '📚', shopping: '🛍️', personal: '👤', other: '📦',
};
const COLORS = ['#ff6b6b','#fcc419','#51cf66','#5c7cfa','#f06595','#845ef7','#22b8cf','#ff922b','#20c997','#adb5bd'];

export default function ExpensesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0], notes: '' });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['expenses', search],
    queryFn: () => expenseApi.getAll({ search, limit: 50 }),
    select: (res) => res.data.data,
  });

  const { data: summary } = useQuery({
    queryKey: ['expense-summary'],
    queryFn: () => expenseApi.getSummary(),
    select: (res) => res.data.data,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => expenseApi.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['expenses'] }); queryClient.invalidateQueries({ queryKey: ['expense-summary'] }); toast.success('Expense added!'); closeModal(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => expenseApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['expenses'] }); toast.success('Updated!'); closeModal(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => expenseApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['expenses'] }); toast.success('Deleted!'); },
  });

  const openCreate = () => { setEditingExpense(null); setForm({ title: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0], notes: '' }); setModalOpen(true); };
  const openEdit = (e: any) => { setEditingExpense(e); setForm({ title: e.title, amount: String(e.amount), category: e.category, date: e.date, notes: e.notes || '' }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingExpense(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, amount: parseFloat(form.amount) };
    editingExpense ? updateMutation.mutate({ id: editingExpense.id, data: payload }) : createMutation.mutate(payload);
  };

  const expenses = data || [];

  const pieData = summary?.byCategory ? Object.entries(summary.byCategory)
    .filter(([, v]) => (v as number) > 0)
    .map(([k, v], i) => ({ name: k, value: v as number, fill: COLORS[i % COLORS.length] })) : [];

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
        <div className="glass-card p-6 lg:col-span-1">
          <h3 className="section-title mb-2">Monthly Total</h3>
          <p className="text-4xl font-display font-bold gradient-text">${(summary?.totalExpenses || 0).toFixed(2)}</p>
          <p className="text-sm text-gray-500 dark:text-dark-200 mt-1">Avg ${(summary?.averageDaily || 0).toFixed(2)}/day</p>
        </div>
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="section-title mb-4">By Category</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} contentStyle={{ backgroundColor: 'rgba(30,30,40,0.9)', border: 'none', borderRadius: '12px', color: '#fff' }} />
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
            {expenses.map((exp: any) => (
              <motion.div key={exp.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card-hover p-4">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{categoryEmoji[exp.category] || '📦'}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{exp.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-dark-200">{exp.category} · {exp.date}</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">${exp.amount.toFixed(2)}</p>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(exp)} className="btn-ghost p-2"><HiOutlinePencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteMutation.mutate(exp.id)} className="btn-ghost p-2 text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editingExpense ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Expense title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
          <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input-field" required step="0.01" min="0" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
            {categories.map((c) => <option key={c} value={c}>{categoryEmoji[c]} {c}</option>)}
          </select>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required />
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
