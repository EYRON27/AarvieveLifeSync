import React from 'react';
import Modal from '@/components/Modal';
import { mealTypes, mealEmojis } from './utils';

interface FoodModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  form: any;
  setForm: (form: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function FoodModal({ modalOpen, setModalOpen, form, setForm, handleSubmit }: FoodModalProps) {
  return (
    <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Meal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Food name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="Calories" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} className="input-field" required min="0" />
          <select value={form.mealType} onChange={(e) => setForm({ ...form, mealType: e.target.value })} className="input-field">
            {mealTypes.map((t) => <option key={t} value={t}>{mealEmojis[t]} {t}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <input type="number" placeholder="Protein (g)" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} className="input-field" step="0.1" min="0" />
          <input type="number" placeholder="Carbs (g)" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} className="input-field" step="0.1" min="0" />
          <input type="number" placeholder="Fat (g)" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} className="input-field" step="0.1" min="0" />
        </div>
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required max={new Date().toISOString().split('T')[0]} />
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">Log Meal</button>
        </div>
      </form>
    </Modal>
  );
}
