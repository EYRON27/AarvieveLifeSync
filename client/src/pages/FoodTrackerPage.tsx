import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import { PageLoader, EmptyState } from '@/components/LoadingSpinner';
import { foodApi } from '@/services/endpoints';

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
const mealEmojis: Record<string, string> = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍿' };

export default function FoodTrackerPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', mealType: 'lunch' as string, date: selectedDate, notes: '' });

  const queryClient = useQueryClient();

  const { data: entries, isLoading } = useQuery({
    queryKey: ['food-entries'],
    queryFn: () => foodApi.getAll({ limit: 50 }),
    select: (res) => res.data.data,
  });

  const { data: summary } = useQuery({
    queryKey: ['food-summary', selectedDate],
    queryFn: () => foodApi.getSummary(selectedDate),
    select: (res) => res.data.data,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => foodApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-entries'] });
      queryClient.invalidateQueries({ queryKey: ['food-summary'] });
      toast.success('Meal logged!');
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => foodApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-entries'] });
      queryClient.invalidateQueries({ queryKey: ['food-summary'] });
      toast.success('Deleted!');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      calories: parseInt(form.calories) || 0,
      protein: parseFloat(form.protein) || 0,
      carbs: parseFloat(form.carbs) || 0,
      fat: parseFloat(form.fat) || 0,
    });
  };

  const calorieGoal = 2000;
  const caloriePercent = Math.min(100, Math.round(((summary?.totalCalories || 0) / calorieGoal) * 100));

  if (isLoading) return <PageLoader />;

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="page-title">Food Tracker</h1>
        <button onClick={() => { setForm({ ...form, date: selectedDate }); setModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <HiOutlinePlus className="w-5 h-5" /> Log Meal
        </button>
      </div>

      {/* Date Picker & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorie Ring */}
        <div className="glass-card p-6 text-center">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input-field mb-4 text-center" />
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" strokeWidth="12" stroke="currentColor" fill="none" className="text-gray-200 dark:text-dark-500" />
              <circle cx="80" cy="80" r="70" strokeWidth="12" stroke="url(#gradient)" fill="none"
                strokeDasharray={`${caloriePercent * 4.4} 440`}
                strokeLinecap="round" className="transition-all duration-700" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#5c7cfa" />
                  <stop offset="100%" stopColor="#f06595" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{summary?.totalCalories || 0}</p>
              <p className="text-xs text-gray-500 dark:text-dark-200">/ {calorieGoal} cal</p>
            </div>
          </div>
          <p className="mt-3 text-sm font-medium text-gray-600 dark:text-dark-100">{caloriePercent}% of daily goal</p>
        </div>

        {/* Macros */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="section-title mb-4">Macronutrients</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Protein', value: summary?.totalProtein || 0, color: 'from-blue-500 to-blue-600', unit: 'g' },
              { label: 'Carbs', value: summary?.totalCarbs || 0, color: 'from-amber-500 to-amber-600', unit: 'g' },
              { label: 'Fat', value: summary?.totalFat || 0, color: 'from-rose-500 to-rose-600', unit: 'g' },
            ].map((macro) => (
              <div key={macro.label} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-dark-600">
                <p className={`text-2xl font-bold bg-gradient-to-r ${macro.color} bg-clip-text text-transparent`}>
                  {macro.value.toFixed(1)}{macro.unit}
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-200 mt-1">{macro.label}</p>
              </div>
            ))}
          </div>

          {/* Meal breakdown */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mealTypes.map((type) => {
              const mealData = summary?.byMealType?.[type];
              return (
                <div key={type} className="p-3 rounded-xl bg-gray-50 dark:bg-dark-600 text-center">
                  <span className="text-xl">{mealEmojis[type]}</span>
                  <p className="text-sm font-medium capitalize text-gray-700 dark:text-dark-100 mt-1">{type}</p>
                  <p className="text-xs text-gray-500 dark:text-dark-200">{mealData?.calories || 0} cal · {mealData?.count || 0} items</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Entries */}
      <div className="glass-card p-6">
        <h3 className="section-title mb-4">Recent Meals</h3>
        {(entries || []).length === 0 ? (
          <EmptyState icon={<span className="text-4xl">🍽️</span>} title="No meals logged" description="Start tracking your nutrition" />
        ) : (
          <div className="space-y-3">
            {(entries || []).map((entry: any) => (
              <motion.div key={entry.id} layout className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-500/50 transition-colors">
                <span className="text-xl">{mealEmojis[entry.mealType] || '🍽️'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white">{entry.name}</p>
                  <p className="text-xs text-gray-500 dark:text-dark-200">{entry.mealType} · {entry.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{entry.calories} cal</p>
                  <p className="text-xs text-gray-400">P:{entry.protein}g C:{entry.carbs}g F:{entry.fat}g</p>
                </div>
                <button onClick={() => deleteMutation.mutate(entry.id)} className="btn-ghost p-1 text-red-500">
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Log Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Meal">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Food name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Calories" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} className="input-field" required min="0" />
            <select value={form.mealType} onChange={(e) => setForm({ ...form, mealType: e.target.value })} className="input-field">
              {mealTypes.map((t) => <option key={t} value={t}>{mealEmojis[t]} {t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input type="number" placeholder="Protein (g)" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} className="input-field" step="0.1" min="0" />
            <input type="number" placeholder="Carbs (g)" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} className="input-field" step="0.1" min="0" />
            <input type="number" placeholder="Fat (g)" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} className="input-field" step="0.1" min="0" />
          </div>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Log Meal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
