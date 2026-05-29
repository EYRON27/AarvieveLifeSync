export const priorities = ['low', 'medium', 'high', 'urgent'] as const;
export const statuses = ['todo', 'in-progress', 'completed', 'overdue'] as const;

export const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export const statusColors: Record<string, string> = {
  todo: 'badge-warning',
  'in-progress': 'badge-info',
  completed: 'badge-success',
  overdue: 'badge-danger',
};
