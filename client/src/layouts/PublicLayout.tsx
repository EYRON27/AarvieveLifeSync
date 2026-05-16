import { Link, Outlet, useLocation } from 'react-router-dom';
import { useUIStore } from '@/store/uiStore';
import LoginModal from '@/components/LoginModal';

export default function PublicLayout() {
  const location = useLocation();
  const { setLoginModalOpen } = useUIStore();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white selection:bg-primary-500/30 flex flex-col">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-dark-900/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/30">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="font-display font-bold text-xl hidden sm:block">AarvieveLifeSync</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.path ? 'text-primary-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setLoginModalOpen(true)}
                className="px-6 py-2.5 rounded-xl font-semibold text-white gradient-primary hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 active:scale-95"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 pt-20 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-dark-900/50 backdrop-blur-md py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-display font-semibold">AarvieveLifeSync</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} AarvieveLifeSync. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made by <span className="text-primary-400 font-medium">Aaron M. Cañada</span>
          </p>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal />
    </div>
  );
}
