import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { useThemeStore } from '@/store/themeStore';

export default function Topbar() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-20 glass border-b border-gray-200/50 dark:border-dark-500/50">
      <div className="flex items-center justify-end h-16 px-6">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-dark-500 transition-all duration-300 group"
          id="toggle-theme"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <HiOutlineSun className="w-5 h-5 text-amber-400 group-hover:text-amber-500 transition-colors" />
          ) : (
            <HiOutlineMoon className="w-5 h-5 text-accent-600 group-hover:text-accent-700 transition-colors" />
          )}
        </button>
      </div>
    </header>
  );
}
