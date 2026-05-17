import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineX, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { FullScreenLoader } from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: 'Weak', color: 'bg-rose-500', width: '20%' };
  if (score <= 2) return { label: 'Fair', color: 'bg-orange-500', width: '40%' };
  if (score <= 3) return { label: 'Good', color: 'bg-amber-500', width: '60%' };
  if (score <= 4) return { label: 'Strong', color: 'bg-primary-500', width: '80%' };
  return { label: 'Very Strong', color: 'bg-primary-400', width: '100%' };
}

export default function LoginModal() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  
  const { login, register, resetPassword, user } = useAuthStore();
  const { isLoginModalOpen, setLoginModalOpen } = useUIStore();
  const navigate = useNavigate();

  const handleClose = () => {
    setLoginModalOpen(false);
    setIsRegister(false);
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegister) {
        await register(email, password, displayName);
        const name = displayName.split(' ')[0] || email.split('@')[0];
        toast.success(`Welcome, ${name}! Your account is ready 🎉`);
      } else {
        await login(email, password);
        // user is set in store after login resolves
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
      } else if (err.message && err.message.includes('502')) {
        errorMessage = 'Unable to connect to the server. Please try again later.';
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Scroll container — keeps modal above keyboard on mobile */}
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 py-8">
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl flex flex-col md:flex-row z-10 overflow-hidden rounded-[2rem] shadow-2xl border border-white/10 dark:border-dark-500/50"
          >
            {/* Left Side (Branding/Hero) */}
            <div className="hidden md:flex md:w-5/12 relative flex-col justify-between p-10 bg-gradient-to-br from-primary-600 via-primary-700 to-dark-900 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20 shadow-lg">
                  <span className="text-white font-bold text-2xl font-display">A</span>
                </div>
                <h2 className="text-4xl font-display font-bold mb-4 leading-tight">
                  {isRegister ? 'Join the\nProductivity\nRevolution.' : 'Welcome\nBack to\nLifeSync.'}
                </h2>
                <p className="text-primary-100 text-lg">
                  {isRegister 
                    ? 'Create your account to unlock all premium features and organize your daily life.' 
                    : 'We missed you! Log in to pick up right where you left off.'}
                </p>
              </div>

              <div className="relative z-10">
                <p className="text-sm text-primary-200">
                  Built by <span className="text-white font-medium">Aaron M. Cañada</span>
                </p>
              </div>
            </div>

            {/* Right Side (Form) */}
            <div className="flex-1 p-8 sm:p-10 relative bg-white dark:bg-dark-800">
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-dark-600 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>

              <div className="max-w-sm mx-auto mt-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-display">
                  {isRegister ? 'Create Account' : 'Sign In'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  {isRegister ? 'Fill in your details below to get started.' : 'Enter your email and password to access your dashboard.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {isRegister && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                      <div className="relative">
                        <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <input
                          type="text"
                          placeholder="e.g. Aaron M. Cañada"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all"
                          required={isRegister}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                    <div className="relative">
                      <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {isRegister && password.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Password strength</span>
                          <span className={`text-xs font-semibold ${
                            passwordStrength.label === 'Weak' ? 'text-rose-500' :
                            passwordStrength.label === 'Fair' ? 'text-orange-500' :
                            passwordStrength.label === 'Good' ? 'text-amber-500' :
                            'text-primary-500'
                          }`}>{passwordStrength.label}</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-dark-600 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: passwordStrength.width }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {!isRegister && (
                    <div className="flex justify-end mt-1">
                      <button
                        type="button"
                        onClick={handleResetPassword}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 mt-4 rounded-xl font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isLoading ? 'Please wait...' : isRegister ? 'Create My Account' : 'Sign In Now'}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {isRegister ? 'Already have an account? ' : "Don't have an account yet? "}
                    <button
                      onClick={() => setIsRegister(!isRegister)}
                      className="font-bold text-primary-600 dark:text-primary-400 hover:underline transition-all"
                    >
                      {isRegister ? 'Sign in here' : 'Sign up for free'}
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
