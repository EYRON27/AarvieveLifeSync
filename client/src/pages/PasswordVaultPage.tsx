import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiOutlinePlus, HiOutlineSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { PageLoader } from '@/components/LoadingSpinner';
import { passwordApi } from '@/services/endpoints';
import PasswordList from '@/components/passwords/PasswordList';
import PasswordModal from '@/components/passwords/PasswordModal';

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

      <div className="relative">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Search vault..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-12" />
      </div>

      <PasswordList 
        entries={entries} 
        revealedPasswords={revealedPasswords} 
        handleReveal={handleReveal} 
        copyToClipboard={copyToClipboard} 
        deleteMutation={deleteMutation} 
        setModalOpen={setModalOpen} 
      />

      <PasswordModal 
        modalOpen={modalOpen} 
        setModalOpen={setModalOpen} 
        form={form} 
        setForm={setForm} 
        handleSubmit={handleSubmit} 
      />
    </div>
  );
}
