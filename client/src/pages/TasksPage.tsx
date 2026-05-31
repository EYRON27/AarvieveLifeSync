import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiOutlinePlus, HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { DropResult } from '@hello-pangea/dnd';
import { PageLoader, EmptyState } from '@/components/LoadingSpinner';
import { taskApi } from '@/services/endpoints';
import TaskKanbanBoard from '@/components/tasks/TaskKanbanBoard';
import TaskModal from '@/components/tasks/TaskModal';
import { statuses } from '@/components/tasks/utils';

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

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text" placeholder="Search tasks..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-field pl-12" id="search-tasks"
          />
        </div>
        <select
          value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field w-full sm:w-48" id="filter-status"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {tasks.length === 0 && !search && !filterStatus ? (
        <EmptyState
          icon={<HiOutlineFilter className="w-12 h-12" />} title="No tasks found"
          description="Create your first task to get started"
          action={<button onClick={openCreate} className="btn-primary">Create Task</button>}
        />
      ) : (
        <TaskKanbanBoard
          tasks={tasks} filterStatus={filterStatus} onDragEnd={onDragEnd}
          openEdit={openEdit} deleteTask={(id) => deleteMutation.mutate(id)}
        />
      )}

      <TaskModal
        modalOpen={modalOpen} closeModal={closeModal} editingTask={editingTask}
        handleSubmit={handleSubmit} form={form} setForm={setForm}
      />
    </div>
  );
}
