import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineSearch, HiOutlineEye, HiOutlineEyeOff, HiOutlineClipboard, HiOutlineGlobe, HiOutlineLockClosed, HiOutlineTag, HiOutlineAnnotation, HiOutlineUser } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import { PageLoader, EmptyState } from '@/components/LoadingSpinner';
import { passwordApi } from '@/services/endpoints';

const vaultCategories = ['social','email','banking','work','entertainment','shopping','development','other'];
const categoryIcons: Record<string, string> = {
  social: '💬', email: '📧', banking: '🏦', work: '💼', entertainment: '🎮',
  shopping: '🛒', development: '💻', other: '🔐',
};

export default function PasswordVaultPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ title: '', username: '', password: '', website: '', category: 'other', notes: '' });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['passwords', search],
    queryFn: () => passwordApi.getAll({ search, limit: 100 }),
    select: (res) => res.data.data,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => passwordApi.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['passwords'] }); toast.success('Password saved!'); setModalOpen(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => passwordApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['passwords'] }); toast.success('Deleted!'); },
  });

  const handleReveal = async (id: string) => {
    if (revealedPasswords[id]) {
      setRevealedPasswords((prev) => { const n = { ...prev }; delete n[id]; return n; });
      return;
    }
    try {
      const res = await passwordApi.getDecrypted(id);
      setRevealedPasswords((prev) => ({ ...prev, [id]: res.data.data.password }));
      // Auto-hide after 30s
      setTimeout(() => {
        setRevealedPasswords((prev) => { const n = { ...prev }; delete n[id]; return n; });
      }, 30000);
    } catch {
      toast.error('Failed to decrypt');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const entries = data || [];

  if (isLoading) return <PageLoader />;

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Password Vault</h1>
          <p className="text-sm text-gray-500 dark:text-dark-200 mt-1">🔒 All passwords are AES encrypted</p>
        </div>
        <button onClick={() => { setForm({ title: '', username: '', password: '', website: '', category: 'other', notes: '' }); setModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <HiOutlinePlus className="w-5 h-5" /> Add Password
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Search vault..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-12" />
      </div>

      {/* Entries */}
      {entries.length === 0 ? (
        <EmptyState icon={<span className="text-4xl">🔑</span>} title="Vault is empty" description="Add your first password entry" action={<button onClick={() => setModalOpen(true)} className="btn-primary">Add Password</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {entries.map((entry: any) => (
              <motion.div key={entry.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card-hover p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{categoryIcons[entry.category] || '🔐'}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{entry.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-dark-200">{entry.username}</p>
                    {entry.website && (
                      <a href={entry.website.startsWith('http') ? entry.website : `https://${entry.website}`} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-primary-500 hover:underline flex items-center gap-1 mt-1">
                        <HiOutlineGlobe className="w-3 h-3" /> {entry.website}
                      </a>
                    )}
                    {/* Password field */}
                    <div className="mt-3 flex items-center gap-2">
                      <code className="text-sm bg-gray-100 dark:bg-dark-600 px-3 py-1.5 rounded-lg flex-1 font-mono">
                        {revealedPasswords[entry.id] || '••••••••••••'}
                      </code>
                      <button onClick={() => handleReveal(entry.id)} className="btn-ghost p-2">
                        {revealedPasswords[entry.id] ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                      </button>
                      {revealedPasswords[entry.id] && (
                        <button onClick={() => copyToClipboard(revealedPasswords[entry.id])} className="btn-ghost p-2">
                          <HiOutlineClipboard className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <span className={`badge mt-2 bg-gray-100 dark:bg-dark-500 text-gray-600 dark:text-dark-100`}>
                      {entry.category}
                    </span>
                  </div>
                  <button onClick={() => deleteMutation.mutate(entry.id)} className="btn-ghost p-2 text-red-500">
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Modal */}
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
    </div>
  );
}
