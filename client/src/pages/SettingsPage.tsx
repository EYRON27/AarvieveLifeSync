import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCog, HiOutlineUser, HiOutlineMoon, HiOutlineSun, HiOutlineCurrencyDollar } from 'react-icons/hi';
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
      </div>
    </div>
  );
}
