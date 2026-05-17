import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineClipboardList,
  HiOutlineCurrencyDollar,
  HiOutlineKey,
  HiOutlineClock,
  HiOutlineHeart,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineMenu,
} from 'react-icons/hi';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import Modal from '@/components/Modal';
import { FullScreenLoader } from '@/components/LoadingSpinner';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome, color: 'text-primary-500' },
  { path: '/dashboard/tasks', label: 'Tasks', icon: HiOutlineClipboardList, color: 'text-accent-500' },
  { path: '/dashboard/expenses', label: 'Expenses', icon: HiOutlineCurrencyDollar, color: 'text-primary-500' },
  { path: '/dashboard/passwords', label: 'Password Vault', icon: HiOutlineKey, color: 'text-amber-500' },
  { path: '/dashboard/time-tracker', label: 'Time Tracker', icon: HiOutlineClock, color: 'text-orange-500' },
  { path: '/dashboard/food-tracker', label: 'Food Tracker', icon: HiOutlineHeart, color: 'text-rose-500' },
  { path: '/dashboard/reports', label: 'Reports', icon: HiOutlineChartBar, color: 'text-accent-500' },
  { path: '/dashboard/settings', label: 'Settings', icon: HiOutlineCog, color: 'text-gray-500' },
];

export const SIDEBAR_W_OPEN = 260;
export const SIDEBAR_W_CLOSED = 68;

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const confirmLogout = async () => {
    setIsLogoutModalOpen(false);
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar — uses dvh so it always fills the true visible area on mobile */}
      <motion.aside
        animate={{ width: sidebarOpen ? SIDEBAR_W_OPEN : SIDEBAR_W_CLOSED }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className="fixed left-0 top-0 z-50 flex flex-col overflow-hidden
          bg-white dark:bg-dark-700
          border-r border-gray-200/60 dark:border-dark-500/50
          shadow-lg shadow-black/5 dark:shadow-black/20"
        style={{
          minWidth: SIDEBAR_W_CLOSED,
          // dvh = dynamic viewport height — accounts for mobile browser toolbars
          height: '100dvh',
        }}
      >
        {/* ── Header ── */}
        <div className="h-16 flex-shrink-0 flex items-center border-b border-gray-200/60 dark:border-dark-500/50 overflow-hidden">
          {sidebarOpen ? (
            /* Expanded */
            <div className="flex items-center w-full px-4 gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white font-bold text-base">A</span>
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="font-display font-bold text-base text-gray-900 dark:text-white leading-tight whitespace-nowrap">LifeSync</p>
                <p className="text-xs text-gray-500 dark:text-dark-200 whitespace-nowrap">Productivity Hub</p>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-500 transition-colors flex-shrink-0"
              >
                <HiOutlineMenu className="w-5 h-5 text-gray-500 dark:text-dark-200" />
              </button>
            </div>
          ) : (
            /* Collapsed — hamburger centered */
            <div className="w-full flex items-center justify-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-500 transition-colors"
              >
                <HiOutlineMenu className="w-5 h-5 text-gray-500 dark:text-dark-200" />
              </button>
            </div>
          )}
        </div>

        {/* ── Nav — scrolls internally ── */}
        <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-2 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
              className={({ isActive }) =>
                `relative flex items-center h-11 mb-0.5 rounded-xl font-medium transition-all duration-200 group
                ${isActive
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-dark-100 hover:bg-gray-100 dark:hover:bg-dark-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary-500 rounded-full" />
                  )}

                  {/* Icon zone: fixed 44px so icons line up perfectly */}
                  <span className="flex-shrink-0 flex items-center justify-center" style={{ width: 44 }}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </span>

                  {/* Label fades in/out */}
                  <AnimatePresence initial={false}>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm whitespace-nowrap overflow-hidden pr-3"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip when collapsed */}
                  {!sidebarOpen && (
                    <span className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-900 dark:bg-dark-600
                      text-white text-xs rounded-lg opacity-0 group-hover:opacity-100
                      pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── User + Logout — always pinned, never scrolls ── */}
        <div className="flex-shrink-0 overflow-hidden border-t border-gray-200/60 dark:border-dark-500/50 py-2 px-2">
          {/* User info row — only when expanded */}
          <AnimatePresence initial={false}>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3 px-3 py-2 mb-1 rounded-xl bg-gray-50 dark:bg-dark-600/50 overflow-hidden"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-white font-semibold text-xs">
                    {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-200 truncate">
                    {user?.email}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logout */}
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="relative flex items-center h-11 w-full rounded-xl font-medium
              text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20
              transition-all duration-200 group"
          >
            {/* Icon zone: same 44px as nav items so it aligns */}
            <span className="flex-shrink-0 flex items-center justify-center" style={{ width: 44 }}>
              <HiOutlineLogout className="w-5 h-5" />
            </span>

            <AnimatePresence initial={false}>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm whitespace-nowrap overflow-hidden pr-3"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>

            {!sidebarOpen && (
              <span className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-900 dark:bg-dark-600
                text-white text-xs rounded-lg opacity-0 group-hover:opacity-100
                pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                Logout
              </span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Logout modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
        maxWidth="max-w-sm"
      >
        <div className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to log out of your account?
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsLogoutModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-500 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-400 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={confirmLogout}
            className="px-4 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/30 font-medium"
          >
            Logout
          </button>
        </div>
      </Modal>

      {/* Logout loading overlay */}
      <FullScreenLoader isVisible={isLoggingOut} message="Logging you out..." />
    </>
  );
}
