import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
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
    <div className="min-h-screen bg-dark-900 text-white selection:bg-primary-500/30 flex flex-col">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-dark-900/60 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow duration-300">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-display font-bold text-lg hidden sm:block group-hover:text-primary-400 transition-colors">
                AarvieveLifeSync
              </span>
            </Link>

            {/* Desktop Nav — Home / About / Services */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right side: Login + Hamburger */}
            <div className="flex items-center gap-2">
              {/* Login Button — desktop only */}
              <button
                onClick={() => setLoginModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white
                  border border-primary-500/60 bg-primary-500/10 hover:bg-primary-500/20
                  hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/20
                  transition-all duration-300 active:scale-95"
                id="login-btn"
              >
                Login
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
                id="mobile-menu-toggle"
                aria-label="Toggle navigation"
              >
                <HiOutlineMenu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Right-side Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer panel sliding from the right */}
            <motion.aside
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 w-72 z-[70] md:hidden
                bg-dark-800/95 backdrop-blur-2xl border-l border-white/[0.08]
                flex flex-col shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <span className="font-display font-semibold text-sm">AarvieveLifeSync</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <HiOutlineMenu className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 + 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3.5 rounded-xl font-medium text-base transition-all duration-200 ${
                        location.pathname === item.path
                          ? 'bg-primary-500/15 text-primary-400 border-l-4 border-primary-500 pl-3'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* CTA at bottom */}
              <div className="px-4 py-5 border-t border-white/[0.06] space-y-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); setLoginModalOpen(true); }}
                  className="group w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-sm
                    bg-gradient-to-r from-primary-500 to-accent-500
                    hover:from-primary-400 hover:to-accent-400
                    text-white shadow-lg shadow-primary-500/25
                    transition-all duration-300 active:scale-95"
                >
                  Sign In to LifeSync
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <p className="text-center text-xs text-gray-500">
                  No account?{' '}
                  <button
                    onClick={() => { setMobileMenuOpen(false); setLoginModalOpen(true); }}
                    className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                  >
                    Create one free
                  </button>
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 flex-1 pt-16 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-dark-900/50 backdrop-blur-md py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
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
