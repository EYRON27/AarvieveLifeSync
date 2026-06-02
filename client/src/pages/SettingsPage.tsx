import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineCog, HiOutlineUser, HiOutlineMoon, HiOutlineSun, HiOutlineCurrencyDollar, HiOutlineTrash, HiOutlineExclamationCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { authApi } from '@/services/endpoints';
import { CURRENCIES } from '@/utils/currency';
import { updateProfile } from 'firebase/auth';
import { firebaseAuth } from '@/services/firebase';

export default function SettingsPage() {
  const { user, dbUser, setDbUser, setUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState(dbUser?.displayName || user?.displayName || '');
  const [currency, setCurrency] = useState(dbUser?.preferences?.currency || 'USD');
  const [saving, setSaving] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update backend
      const preferences = { ...dbUser?.preferences, currency };
      const res = await authApi.updateProfile({ displayName, preferences });
      setDbUser(res.data.data);

      // Update Firebase Auth profile
      if (firebaseAuth.currentUser) {
        await updateProfile(firebaseAuth.currentUser, { displayName });
        // Force Zustand update to trigger UI re-render with a cloned reference
        setUser({ ...firebaseAuth.currentUser } as any);
      }

      // Invalidate queries that might depend on currency
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'Delete my Account') return;
    setDeleting(true);
    try {
      await authApi.deleteAccount();
      toast.success('Account deleted successfully.');
      setShowDeleteModal(false);
      logout();
      navigate('/');
    } catch (e) {
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="flex items-center gap-3 mb-8">
        <HiOutlineCog className="w-8 h-8 text-primary-500" />
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <HiOutlineUser className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {(dbUser?.displayName || user?.displayName)?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{dbUser?.displayName || user?.displayName || 'User'}</p>
              <p className="text-sm text-gray-500 dark:text-dark-200">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-dark-100 mb-1 block">Display Name</label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-dark-100 mb-1 block">Email</label>
              <input type="email" value={user?.email || ''} disabled className="input-field opacity-60" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-dark-100 mb-1 block">Preferred Currency</label>
              <div className="relative">
                <HiOutlineCurrencyDollar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Theme</p>
              <p className="text-sm text-gray-500 dark:text-dark-200">Toggle between light and dark mode</p>
            </div>
            <button onClick={toggleTheme}
              className="relative w-16 h-8 rounded-full bg-gray-200 dark:bg-dark-500 transition-colors p-1">
              <motion.div
                animate={{ x: theme === 'dark' ? 32 : 0 }}
                className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center"
              >
                {theme === 'dark' ? <HiOutlineMoon className="w-3.5 h-3.5 text-white" /> : <HiOutlineSun className="w-3.5 h-3.5 text-white" />}
              </motion.div>
            </button>
          </div>
        </motion.div>

        {/* About */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h2>
          <p className="text-sm text-gray-500 dark:text-dark-200">
            AarvieveLifeSync v1.0.0 — A centralized personal productivity platform.
          </p>
          <p className="text-sm text-gray-400 dark:text-dark-300 mt-2">
            Built with React, Express, Firebase, and love ❤️
          </p>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 border-red-500/20">
          <div className="flex items-center gap-3 mb-4">
            <HiOutlineTrash className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-dark-200 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={() => {
              setDeleteConfirmation('');
              setShowDeleteModal(true);
            }}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold rounded-lg transition-colors border border-red-500/20"
          >
            Delete my Account
          </button>
        </motion.div>
      </div>

      {/* Delete Account Modal */}
      {createPortal(
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-[#1a1a2e] border border-red-500/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col"
              >
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <HiOutlineExclamationCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Delete Account</h3>
                </div>

                <div className="p-6">
                  <p className="text-sm text-white/70 mb-4">
                    This action is <span className="font-bold text-red-400">irreversible</span>. This will permanently delete your account and remove all your data from our servers.
                  </p>
                  <p className="text-sm text-white/70 mb-4">
                    Please type <strong className="text-white select-all">Delete my Account</strong> to confirm.
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="Delete my Account"
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-white/20"
                  />
                </div>

                <div className="p-4 border-t border-white/10 bg-black/20 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleting}
                    className="px-5 py-2.5 rounded-xl font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmation !== 'Delete my Account' || deleting}
                    className="px-5 py-2.5 rounded-xl font-bold bg-red-500 hover:bg-red-600 disabled:bg-red-500/30 disabled:text-white/40 text-white transition-all shadow-lg shadow-red-500/20"
                  >
                    {deleting ? 'Deleting...' : 'Confirm'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
