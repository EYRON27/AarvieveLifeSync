import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiMenu } from 'react-icons/hi';
import { useUIStore } from '@/store/uiStore';
import LoginModal from '@/components/LoginModal';

export default function PublicLayout() {
  const location = useLocation();
  const { setLoginModalOpen } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
  ];

  return (
    <div className="min-h-screen bg-[#080810] text-white flex flex-col">

      {/* Premium Floating Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
        <div 
          className="flex items-center justify-between h-14 px-4 sm:px-6 rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          style={{ background: 'rgba(12, 12, 22, 0.6)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5c7cfa] to-[#22b8cf] flex items-center justify-center shadow-[0_0_15px_rgba(92,124,250,0.4)] group-hover:shadow-[0_0_20px_rgba(92,124,250,0.6)] transition-all duration-300">
              <span className="text-white font-bold text-sm tracking-wider">A</span>
            </div>
            <span className="font-semibold text-[15px] text-white/90 group-hover:text-white transition-colors tracking-tight">
              AarvieveLifeSync
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.03]">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-white bg-white/[0.1] shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right: Login + Mobile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLoginModalOpen(true, 'login')}
              className="hidden md:flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
              id="login-btn"
            >
              Sign in
            </button>
            <button
              onClick={() => setLoginModalOpen(true, 'register')}
              className="hidden md:flex items-center justify-center px-5 py-2 rounded-xl text-sm font-semibold text-[#080810] bg-white hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Get started
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.05] transition-colors text-white/80"
              id="mobile-menu-toggle"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <HiOutlineX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/70 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 34 }}
              className="fixed top-0 right-0 bottom-0 w-64 z-[70] md:hidden flex flex-col border-l border-white/[0.07]"
              style={{ background: '#0e0e1a' }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <span className="font-semibold text-sm text-white/80">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors">
                  <HiOutlineX className="w-4 h-4 text-white/60" />
                </button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === item.path
                        ? 'bg-white/[0.08] text-white'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="px-3 py-4 border-t border-white/[0.06] space-y-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); setLoginModalOpen(true, 'login'); }}
                  className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-white/[0.08] hover:bg-white/[0.13] border border-white/[0.08] transition-all"
                >
                  Sign in
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); setLoginModalOpen(true, 'register'); }}
                  className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-[#080810] bg-white hover:bg-white/90 transition-all"
                >
                  Get started free
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col pt-28">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-10 mt-auto" style={{ background: '#080810' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#5c7cfa] to-[#22b8cf] flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">A</span>
              </div>
              <span className="text-sm font-medium text-white/60">AarvieveLifeSync</span>
            </div>
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} AarvieveLifeSync · Built by{' '}
              <span className="text-white/50">Aaron M. Cañada</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal />
    </div>
  );
}
