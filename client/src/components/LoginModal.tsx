import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineX, HiOutlineEye, HiOutlineEyeOff, HiOutlineCurrencyDollar } from 'react-icons/hi';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { FullScreenLoader } from '@/components/LoadingSpinner';
import { CURRENCIES } from '@/utils/currency';
import toast from 'react-hot-toast';

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: 'Weak', color: '#f43f5e', width: '20%' };
  if (score <= 2) return { label: 'Fair', color: '#f97316', width: '40%' };
  if (score <= 3) return { label: 'Good', color: '#f59e0b', width: '60%' };
  if (score <= 4) return { label: 'Strong', color: '#5c7cfa', width: '80%' };
  return { label: 'Very Strong', color: '#22b8cf', width: '100%' };
}

export default function LoginModal() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [currency, setCurrency] = useState('PHP');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  
  const { login, register, resetPassword } = useAuthStore();
  const { isLoginModalOpen, setLoginModalOpen, loginModalMode } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoginModalOpen) {
      setIsRegister(loginModalMode === 'register');
    }
  }, [isLoginModalOpen, loginModalMode]);

  const handleClose = () => {
    setLoginModalOpen(false);
    // don't immediately clear state so the closing animation looks clean
    setTimeout(() => {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setDisplayName('');
      setCurrency('PHP');
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match. Please try again.');
          setIsLoading(false);
          return;
        }
        await register(email, password, displayName, currency);
        const name = displayName.split(' ')[0] || email.split('@')[0];
        toast.success(`Welcome, ${name}! Your account is ready 🎉`);
      } else {
        await login(email, password);
        const storedUser = useAuthStore.getState().user;
        const name = storedUser?.displayName?.split(' ')[0] || storedUser?.email?.split('@')[0] || '';
        toast.success(name ? `Welcome back, ${name}! 👋` : 'Welcome back!');
      }
      handleClose();
      navigate('/dashboard');
    } catch (err: any) {
      const code = err.code || '';
      let errorMessage = err.message || 'Something went wrong. Please try again.';
      
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Try registering first.';
      } else if (code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Try signing in instead.';
      } else if (code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      } else if (code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/Password sign-in is not enabled. Contact support.';
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Enter your email first');
      return;
    }
    try {
      await resetPassword(email);
      toast.success('Password reset email sent!');
    } catch {
      toast.error('Failed to send reset email');
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const modalContent = (
    <AnimatePresence>
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-[900px] flex flex-col md:flex-row z-10 overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl"
            style={{ background: '#0e0e1a' }}
          >
            {/* Left Side (Branding/Hero) */}
            <div className="hidden md:flex md:w-[45%] relative flex-col justify-between p-10 border-r border-white/[0.05] overflow-hidden" style={{ background: '#080810' }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" style={{ background: 'rgba(92,124,250,0.15)' }} />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" style={{ background: 'rgba(34,184,207,0.1)' }} />
              
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5c7cfa] to-[#22b8cf] flex items-center justify-center mb-8 shadow-lg">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <h2 className="text-3xl font-bold mb-4 tracking-tight text-white">
                  {isRegister ? 'Join the productivity revolution.' : 'Welcome back to LifeSync.'}
                </h2>
                <p className="text-white/40 text-sm leading-relaxed">
                  {isRegister 
                    ? 'Create your free account to unlock all premium features and master your day.' 
                    : 'We missed you! Log in to pick up right where you left off.'}
                </p>
              </div>

              <div className="relative z-10">
                <p className="text-xs text-white/30">
                  Built by <span className="text-white/50 font-medium">Aaron M. Cañada</span>
                </p>
              </div>
            </div>

            {/* Right Side (Form) */}
            <div className="flex-1 p-8 sm:p-10 relative">
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>

              <div className="max-w-sm mx-auto mt-2">
                <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                  {isRegister ? 'Create Account' : 'Sign In'}
                </h3>
                <p className="text-white/40 text-sm mb-8">
                  {isRegister ? 'Fill in your details below to get started.' : 'Enter your credentials to access your dashboard.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isRegister && (
                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type="text"
                          placeholder="Aaron M. Cañada"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/20 border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#5c7cfa] focus:bg-white/[0.02] transition-all"
                          required={isRegister}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/20 border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#5c7cfa] focus:bg-white/[0.02] transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-black/20 border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#5c7cfa] focus:bg-white/[0.02] transition-all"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                      </button>
                    </div>
                    {isRegister && password.length > 0 && (
                      <div className="mt-2.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] text-white/40 uppercase tracking-wider">Strength</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: passwordStrength.color }}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: passwordStrength.width, backgroundColor: passwordStrength.color }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {isRegister && (
                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                      <div className="relative">
                        <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/20 border ${
                            confirmPassword && password !== confirmPassword 
                              ? 'border-[#f43f5e]' 
                              : 'border-white/[0.08] focus:border-[#5c7cfa]'
                          } text-white text-sm placeholder-white/20 focus:outline-none focus:bg-white/[0.02] transition-all`}
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                  )}

                  {isRegister && (
                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Currency</label>
                      <div className="relative">
                        <HiOutlineCurrencyDollar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0e0e1a] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#5c7cfa] focus:bg-white/[0.02] transition-all appearance-none"
                        >
                          {CURRENCIES.map((c) => (
                            <option key={c.code} value={c.code}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {!isRegister && (
                    <div className="flex justify-end mt-1">
                      <button
                        type="button"
                        onClick={handleResetPassword}
                        className="text-xs font-medium text-white/40 hover:text-white transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 mt-6 rounded-lg font-semibold text-sm text-[#080810] bg-white hover:bg-white/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {isLoading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
                  </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-white/[0.05]">
                  <p className="text-sm text-white/40">
                    {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                    <button
                      onClick={() => setIsRegister(!isRegister)}
                      className="font-semibold text-white hover:text-white/80 transition-colors"
                    >
                      {isRegister ? 'Sign in' : 'Sign up'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return (
    <>
      {createPortal(modalContent, document.body)}
      <FullScreenLoader
        isVisible={isLoading}
        message={isRegister ? 'Creating your account...' : 'Signing you in...'}
      />
    </>
  );
}
