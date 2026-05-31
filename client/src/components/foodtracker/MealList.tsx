import { motion } from 'framer-motion';
import { HiOutlineTrash } from 'react-icons/hi';
import { EmptyState } from '@/components/LoadingSpinner';
import { mealEmojis } from './utils';

interface MealListProps {
  entries: any[];
  deleteMutation: any;
}

export default function MealList({ entries, deleteMutation }: MealListProps) {
  return (
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
  );
}
