import React from 'react';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';

interface TimeModalsProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  form: any;
  setForm: (form: any) => void;
  manualMutation: any;
  startTimerModalOpen: boolean;
  setStartTimerModalOpen: (open: boolean) => void;
  startTimerForm: any;
  setStartTimerForm: (form: any) => void;
  handleStartTimerSubmit: (e: React.FormEvent) => void;
}

export default function TimeModals({
  modalOpen, setModalOpen, form, setForm, manualMutation,
  startTimerModalOpen, setStartTimerModalOpen, startTimerForm, setStartTimerForm, handleStartTimerSubmit
}: TimeModalsProps) {
  return (
    <>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Manual Time Entry">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (new Date(form.endTime) < new Date(form.startTime)) {
            toast.error('End time cannot be earlier than start time');
            return;
          }
          manualMutation.mutate(form);
        }} className="space-y-4">
          <input type="text" placeholder="What did you work on?" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
          <input type="text" placeholder="Project" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="input-field" />
          <div className="grid grid-cols-2 gap-3">
            <input type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="input-field" required />
            <input type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="input-field" required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add Entry</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={startTimerModalOpen} onClose={() => setStartTimerModalOpen(false)} title="Start Timer">
        <form onSubmit={handleStartTimerSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="What are you working on?" 
            value={startTimerForm.title} 
            onChange={(e) => setStartTimerForm({ ...startTimerForm, title: e.target.value })} 
            className="input-field" 
            required 
            autoFocus
          />
          <input 
            type="text" 
            placeholder="Project name (optional)" 
            value={startTimerForm.project} 
            onChange={(e) => setStartTimerForm({ ...startTimerForm, project: e.target.value })} 
            className="input-field" 
          />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setStartTimerModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Start</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
