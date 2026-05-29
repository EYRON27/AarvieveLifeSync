import React from 'react';
import { HiOutlineTag, HiOutlineUser, HiOutlineLockClosed, HiOutlineGlobe, HiOutlineAnnotation } from 'react-icons/hi';
import Modal from '@/components/Modal';
import { vaultCategories, categoryIcons } from './utils';

interface PasswordModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  form: any;
  setForm: (form: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function PasswordModal({ modalOpen, setModalOpen, form, setForm, handleSubmit }: PasswordModalProps) {
  return (
    <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <HiOutlineTag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Service name" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field pl-12" required />
        </div>
        <div className="relative">
          <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Username / Email" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="input-field pl-12" required />
        </div>
        <div>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field pl-12" required />
          </div>
        </div>
        <div className="relative">
          <HiOutlineGlobe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Website URL (optional)" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="input-field pl-12" />
        </div>
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
          {vaultCategories.map((c) => <option key={c} value={c}>{categoryIcons[c]} {c}</option>)}
        </select>
        <div className="relative">
          <HiOutlineAnnotation className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <textarea placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field pl-12 min-h-[60px] resize-none" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">Save Password</button>
        </div>
      </form>
    </Modal>
  );
}
