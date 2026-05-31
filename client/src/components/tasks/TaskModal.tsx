import React, { Dispatch, SetStateAction } from 'react';
import Modal from '@/components/Modal';
import { priorities, statuses } from './utils';

interface TaskModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  editingTask: any;
  handleSubmit: (e: React.FormEvent) => void;
  form: any;
  setForm: Dispatch<SetStateAction<any>>;
}

export default function TaskModal({
  modalOpen, closeModal, editingTask, handleSubmit, form, setForm
}: TaskModalProps) {
  return (
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
  );
}
