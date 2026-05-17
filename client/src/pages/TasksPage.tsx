import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Modal from '@/components/Modal';
import { PageLoader, EmptyState } from '@/components/LoadingSpinner';
import { taskApi } from '@/services/endpoints';

const priorities = ['low', 'medium', 'high', 'urgent'] as const;
const statuses = ['todo', 'in-progress', 'completed', 'overdue'] as const;

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
  overdue: 'badge-danger',
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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    applyTaskStatusUpdate(draggableId, destination.droppableId);
  };

  const applyTaskStatusUpdate = (taskId: string, newStatus: string) => {
    queryClient.setQueryData(['tasks', search, filterStatus], (oldData: any) => {
      if (!oldData?.data?.data) return oldData;
      return {
        ...oldData,
        data: {
          ...oldData.data,
          data: oldData.data.data.map((task: any) => 
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        }
      };
    });

    updateMutation.mutate({
      id: taskId,
      data: { status: newStatus },
    });
  };



  const today = new Date().toISOString().split('T')[0];
  const tasks = (data || []).map((t: any) => {
    if (t.status !== 'completed' && t.dueDate && t.dueDate.split('T')[0] < today) {
      return { ...t, status: 'overdue' };
    }
    return t;
  });

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

      {/* Kanban Board */}
      {tasks.length === 0 && !search && !filterStatus ? (
        <EmptyState
          icon={<HiOutlineFilter className="w-12 h-12" />}
          title="No tasks found"
          description="Create your first task to get started"
          action={<button onClick={openCreate} className="btn-primary">Create Task</button>}
        />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-4 items-start min-h-[60vh]">
            {(filterStatus ? [filterStatus] : statuses).map((status) => {
              const columnTasks = tasks.filter((t: any) => t.status === status);
              return (
                <div key={status} className="bg-gray-50/80 dark:bg-dark-300/30 rounded-2xl p-4 flex flex-col gap-3 border border-gray-100 dark:border-dark-400">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-gray-700 dark:text-gray-200 capitalize flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${status === 'todo' ? 'bg-amber-400' : status === 'in-progress' ? 'bg-blue-400' : status === 'completed' ? 'bg-green-400' : 'bg-red-400'}`} />
                      {status.replace('-', ' ')}
                    </h2>
                    <span className="bg-white dark:bg-dark-400 text-xs py-1 px-2.5 rounded-full font-bold text-gray-500 shadow-sm">
                      {columnTasks.length}
                    </span>
                  </div>
                  
                  <Droppable droppableId={status} isDropDisabled={status === 'overdue'}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 min-h-[150px] transition-all duration-200 rounded-xl ${snapshot.isDraggingOver ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
                      >
                        {columnTasks.map((task: any, index: number) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{ ...provided.draggableProps.style }}
                                  className={`mb-3 glass-card p-4 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'ring-2 ring-primary-500 shadow-xl opacity-90 scale-[1.02]' : ''}`}
                                >
                                {/* Task Card Content */}
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <h3 className={`font-semibold text-sm text-gray-900 dark:text-white leading-tight ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                                      {task.title}
                                    </h3>
                                    <div className="flex items-center shrink-0">
                                      <button onClick={() => openEdit(task)} className="p-1.5 text-gray-400 hover:text-primary-500 transition-colors">
                                        <HiOutlinePencil className="w-3.5 h-3.5" />
                                      </button>
                                      <button onClick={() => deleteMutation.mutate(task.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                        <HiOutlineTrash className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {task.description && (
                                    <p className="text-xs text-gray-500 dark:text-dark-200 line-clamp-2">{task.description}</p>
                                  )}
                                  
                                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50 dark:border-dark-400">
                                    <span className={`badge text-[10px] px-2 py-0.5 ${priorityColors[task.priority]}`}>{task.priority}</span>
                                    {task.dueDate && (
                                      <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                        🗓️ {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
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
