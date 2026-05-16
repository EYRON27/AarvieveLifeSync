import { HiOutlineMenu, HiOutlineSun, HiOutlineMoon, HiOutlineBell } from 'react-icons/hi';
import { useThemeStore } from '@/store/themeStore';
import { useUIStore } from '@/store/uiStore';

export default function Topbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-20 glass border-b border-gray-200/50 dark:border-dark-500/50">
      <div className="flex items-center justify-between h-16 px-6">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-500 transition-colors"
          id="toggle-sidebar"
        >
          <HiOutlineMenu className="w-6 h-6 text-gray-600 dark:text-dark-100" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-500 transition-all duration-300"
            id="toggle-theme"
          >
            {theme === 'dark' ? (
              <HiOutlineSun className="w-5 h-5 text-amber-400" />
            ) : (
              <HiOutlineMoon className="w-5 h-5 text-primary-600" />
            )}
          </button>

          <button
            className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-500 transition-colors"
            id="notifications"
          >
            <HiOutlineBell className="w-5 h-5 text-gray-600 dark:text-dark-100" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
