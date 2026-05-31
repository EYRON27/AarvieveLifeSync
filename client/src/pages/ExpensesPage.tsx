import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiOutlinePlus, HiOutlineSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { PageLoader } from '@/components/LoadingSpinner';
import { expenseApi } from '@/services/endpoints';
import { useAuthStore } from '@/store/authStore';
import ExpenseSummaryCards from '@/components/expenses/ExpenseSummaryCards';
import ExpenseList from '@/components/expenses/ExpenseList';
import ExpenseModal from '@/components/expenses/ExpenseModal';
import { defaultCategories, COLORS, getDatesForRange } from '@/components/expenses/utils';

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

      <ExpenseSummaryCards
        selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
        timeRange={timeRange} setTimeRange={setTimeRange}
        totalExpenses={totalExpenses} averageDaily={averageDaily}
        currency={currency} pieData={pieData} pieTotal={pieTotal}
      />

      <div className="relative">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-12" id="search-expenses" />
      </div>

      <ExpenseList
        expenses={expenses} selectedCategory={selectedCategory} currency={currency}
        openCreate={openCreate} openEdit={openEdit} deleteExpense={(id) => deleteMutation.mutate(id)}
      />

      <ExpenseModal
        modalOpen={modalOpen} closeModal={closeModal} editingExpense={editingExpense}
        handleSubmit={handleSubmit} form={form} setForm={setForm}
        isAddingCategory={isAddingCategory} setIsAddingCategory={setIsAddingCategory}
        uniqueCategories={uniqueCategories}
      />
    </div>
  );
}
