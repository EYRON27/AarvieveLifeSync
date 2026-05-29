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

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.05]" style={{ background: 'rgba(8,8,16,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5c7cfa] to-[#22b8cf] flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <span className="font-semibold text-sm text-white/90 group-hover:text-white transition-colors tracking-tight">
                AarvieveLifeSync
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-150 ${
                    location.pathname === item.path
                      ? 'text-white bg-white/[0.08]'
                      : 'text-white/50 hover:text-white/90 hover:bg-white/[0.05]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right: Login + Mobile */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLoginModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white bg-white/[0.08] hover:bg-white/[0.13] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-200"
                id="login-btn"
              >
                Sign in
              </button>
              <button
                onClick={() => setLoginModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-[#080810] bg-white hover:bg-white/90 transition-all duration-200"
              >
                Get started
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/[0.08] transition-colors text-white/70"
                id="mobile-menu-toggle"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <HiOutlineX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
              </button>
            </div>
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
                  onClick={() => { setMobileMenuOpen(false); setLoginModalOpen(true); }}
                  className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-white/[0.08] hover:bg-white/[0.13] border border-white/[0.08] transition-all"
                >
                  Sign in
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); setLoginModalOpen(true); }}
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
      <main className="relative z-10 flex-1 flex flex-col pt-14">
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
