import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useUIStore } from '@/store/uiStore';

export default function MainLayout() {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-800">
      <Sidebar />

      <motion.div
        animate={{
          marginLeft: sidebarOpen ? 280 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="min-h-screen flex flex-col"
      >
        <Topbar />

        <main className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}
