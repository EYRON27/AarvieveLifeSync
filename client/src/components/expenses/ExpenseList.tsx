import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { EmptyState } from '@/components/LoadingSpinner';
import { formatCurrency } from '@/utils/currency';
import { categoryEmoji } from './utils';

interface ExpenseListProps {
  expenses: any[];
  selectedCategory: string | null;
  currency: string;
  openCreate: () => void;
  openEdit: (expense: any) => void;
  deleteExpense: (id: string) => void;
}

export default function ExpenseList({
  expenses, selectedCategory, currency, openCreate, openEdit, deleteExpense
}: ExpenseListProps) {
  if (expenses.length === 0) {
    return <EmptyState icon={<span className="text-4xl">💰</span>} title="No expenses" description="Start tracking your spending" action={<button onClick={openCreate} className="btn-primary">Add Expense</button>} />;
  }

  const filtered = expenses.filter((e) => !selectedCategory || e.category === selectedCategory);

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {filtered.map((exp: any) => (
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
                <button onClick={() => deleteExpense(exp.id)} className="btn-ghost p-2 text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center p-8 text-gray-500">No expenses in this category for the selected period.</div>
        )}
      </AnimatePresence>
    </div>
  );
}
