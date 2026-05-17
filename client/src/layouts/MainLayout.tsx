import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar, { SIDEBAR_W_OPEN, SIDEBAR_W_CLOSED } from './Sidebar';
import Topbar from './Topbar';
import { useUIStore } from '@/store/uiStore';

export default function MainLayout() {
  const { sidebarOpen } = useUIStore();

  // On mobile the sidebar overlays content (position: fixed), so we must NOT
  // shift the content area — doing so pushes it off-screen and creates a
  // horizontal scrollbar. Only apply the margin on desktop (≥ 1024 px).
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const marginLeft = isDesktop ? (sidebarOpen ? SIDEBAR_W_OPEN : SIDEBAR_W_CLOSED) : SIDEBAR_W_CLOSED;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-800 overflow-x-hidden">
      <Sidebar />

      {/* Content area — on desktop shifts right with sidebar; on mobile stays fixed */}
      <motion.div
        animate={{ marginLeft }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className="min-h-screen flex flex-col overflow-x-hidden"
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
