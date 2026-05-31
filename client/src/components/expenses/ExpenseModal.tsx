import React, { Dispatch, SetStateAction } from 'react';
import Modal from '@/components/Modal';
import { categoryEmoji } from './utils';

interface ExpenseModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  editingExpense: any;
  handleSubmit: (e: React.FormEvent) => void;
  form: any;
  setForm: Dispatch<SetStateAction<any>>;
  isAddingCategory: boolean;
  setIsAddingCategory: Dispatch<SetStateAction<boolean>>;
  uniqueCategories: string[];
}

export default function ExpenseModal({
  modalOpen, closeModal, editingExpense, handleSubmit, form, setForm, isAddingCategory, setIsAddingCategory, uniqueCategories
}: ExpenseModalProps) {
  return (
    <Modal isOpen={modalOpen} onClose={closeModal} title={editingExpense ? 'Edit Expense' : 'Add Expense'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Expense title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
        <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input-field" required step="0.01" min="0" />
        {isAddingCategory ? (
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="New Category Name" 
              value={form.category} 
              onChange={(e) => setForm({ ...form, category: e.target.value.toLowerCase() })} 
              className="input-field flex-1" 
              required 
              autoFocus
            />
            <button 
              type="button" 
              onClick={() => { setIsAddingCategory(false); setForm({ ...form, category: 'food' }); }} 
              className="btn-secondary px-4"
            >
              Cancel
            </button>
          </div>
        ) : (
          <select 
            value={form.category} 
            onChange={(e) => {
              if (e.target.value === 'ADD_NEW') {
                setIsAddingCategory(true);
                setForm({ ...form, category: '' });
              } else {
                setForm({ ...form, category: e.target.value });
              }
            }} 
            className="input-field"
          >
            {uniqueCategories.map((c: any) => (
              <option key={c} value={c} className="bg-white dark:bg-dark-600 text-gray-900 dark:text-white capitalize">
                {categoryEmoji[c] || '🏷️'} {c}
              </option>
            ))}
            <option value="ADD_NEW" className="bg-white dark:bg-dark-600 text-primary-500 font-bold">
              ➕ Add New Category...
            </option>
          </select>
        )}
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required max={new Date().toISOString().split('T')[0]} />
        <textarea placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field min-h-[60px] resize-none" />
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">{editingExpense ? 'Update' : 'Add'}</button>
        </div>
      </form>
    </Modal>
  );
}
