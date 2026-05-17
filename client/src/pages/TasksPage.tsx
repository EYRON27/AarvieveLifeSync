import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import { PageLoader, EmptyState } from '@/components/LoadingSpinner';
import { taskApi } from '@/services/endpoints';

const priorities = ['low', 'medium', 'high', 'urgent'] as const;
const statuses = ['todo', 'in-progress', 'completed', 'cancelled'] as const;

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const statusColors: Record<string, string> = {
  todo: 'badge-warning',
  'in-progress': 'badge-info',
  completed: 'badge-success',
  cancelled: 'badge-danger',
};

export default function TasksPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium' as string, status: 'todo' as string, dueDate: '', tags: '',
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', search, filterStatus],
    queryFn: () => taskApi.getAll({ search, status: filterStatus || undefined, limit: 50 }),
    select: (res) => res.data.data,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => taskApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created!');
      closeModal();
    },
    onError: () => toast.error('Failed to create task'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => taskApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated!');
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted!');
    },
  });

  const openCreate = () => {
    setEditingTask(null);
    setForm({ title: '', description: '', priority: 'medium', status: 'todo', dueDate: '', tags: '' });
    setModalOpen(true);
  };

  const openEdit = (task: any) => {
    setEditingTask(task);
    setForm({
      title: task.title, description: task.description || '',
      priority: task.priority, status: task.status,
      dueDate: task.dueDate?.split('T')[0] || '',
      tags: (task.tags || []).join(', '),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      dueDate: form.dueDate || null,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
    };

    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const tasks = data || [];

  if (isLoading) return <PageLoader />;

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="page-title">Tasks</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2" id="create-task-btn">
          <HiOutlinePlus className="w-5 h-5" /> New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-12"
            id="search-tasks"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field w-full sm:w-48"
          id="filter-status"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <EmptyState
          icon={<HiOutlineFilter className="w-12 h-12" />}
          title="No tasks found"
          description="Create your first task to get started"
          action={<button onClick={openCreate} className="btn-primary">Create Task</button>}
        />
      ) : (
        <motion.div className="space-y-3">
          <AnimatePresence>
            {tasks.map((task: any) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="glass-card-hover p-5"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() =>
                      updateMutation.mutate({
                        id: task.id,
                        data: { status: task.status === 'completed' ? 'todo' : 'completed' },
                      })
                    }
                    className="mt-1 w-5 h-5 rounded-md border-2 border-gray-300 dark:border-dark-400
                      text-primary-500 focus:ring-primary-500 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-semibold text-gray-900 dark:text-white ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                        {task.title}
                      </h3>
                      <span className={`badge ${priorityColors[task.priority]}`}>{task.priority}</span>
                      <span className={statusColors[task.status]}>{task.status}</span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-500 dark:text-dark-200 mt-1 line-clamp-2">{task.description}</p>
                    )}
                    {task.dueDate && (
                      <p className="text-xs text-gray-400 mt-2">
                        📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(task)} className="btn-ghost p-2">
                      <HiOutlinePencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteMutation.mutate(task.id)} className="btn-ghost p-2 text-red-500">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editingTask ? 'Edit Task' : 'New Task'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" placeholder="Task title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-field" required id="task-title-input"
          />
          <textarea
            placeholder="Description (optional)" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field min-h-[80px] resize-none" rows={3}
          />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input-field">
              {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="input-field" min={new Date().toISOString().split('T')[0]} />
          <input type="text" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1" id="task-submit-btn">
              {editingTask ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
