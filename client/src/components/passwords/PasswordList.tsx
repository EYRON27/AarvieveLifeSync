import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineGlobe, HiOutlineEyeOff, HiOutlineEye, HiOutlineClipboard, HiOutlineTrash } from 'react-icons/hi';
import { EmptyState } from '@/components/LoadingSpinner';
import { categoryIcons } from './utils';

interface PasswordListProps {
  entries: any[];
  revealedPasswords: Record<string, string>;
  handleReveal: (id: string) => void;
  copyToClipboard: (text: string) => void;
  deleteMutation: any;
  setModalOpen: (open: boolean) => void;
}

export default function PasswordList({
  entries, revealedPasswords, handleReveal, copyToClipboard, deleteMutation, setModalOpen
}: PasswordListProps) {
  if (entries.length === 0) {
    return (
      <EmptyState 
        icon={<span className="text-4xl">🔑</span>} 
        title="Vault is empty" 
        description="Add your first password entry" 
        action={<button onClick={() => setModalOpen(true)} className="btn-primary">Add Password</button>} 
      />
    );
  }

  return (
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
  );
}
