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
  HiOutlineX,
} from 'react-icons/hi';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import Modal from '@/components/Modal';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { path: '/dashboard/tasks', label: 'Tasks', icon: HiOutlineClipboardList },
  { path: '/dashboard/expenses', label: 'Expenses', icon: HiOutlineCurrencyDollar },
  { path: '/dashboard/passwords', label: 'Password Vault', icon: HiOutlineKey },
  { path: '/dashboard/time-tracker', label: 'Time Tracker', icon: HiOutlineClock },
  { path: '/dashboard/food-tracker', label: 'Food Tracker', icon: HiOutlineHeart },
  { path: '/dashboard/reports', label: 'Reports', icon: HiOutlineChartBar },
  { path: '/dashboard/settings', label: 'Settings', icon: HiOutlineCog },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -280,
        }}
        className="fixed left-0 top-0 bottom-0 w-[280px] z-50 lg:z-30 flex flex-col
          bg-white/80 dark:bg-dark-700/90 backdrop-blur-2xl
          border-r border-gray-200/50 dark:border-dark-500/50
          shadow-xl shadow-black/5 dark:shadow-black/30"
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                LifeSync
              </h1>
              <p className="text-xs text-gray-500 dark:text-dark-200">Productivity Hub</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-500"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              end={item.path === '/dashboard'}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200/50 dark:border-dark-500/50">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-200 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <HiOutlineLogout className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

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
            className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 font-medium"
          >
            Logout
          </button>
        </div>
      </Modal>
    </>
  );
}
