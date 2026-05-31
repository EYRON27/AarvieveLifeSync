import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineX, HiOutlineEye, HiOutlineEyeOff, HiArrowLeft } from 'react-icons/hi';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { authApi } from '@/services/endpoints';
import { FullScreenLoader } from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function LoginModal() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP Flow State
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'none' | 'email' | 'otp' | 'new-password'>('none');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  
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
    setTimeout(() => {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setDisplayName('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setForgotPasswordStep('none');
      setOtp(['', '', '', '', '', '']);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent, type: 'login' | 'register') => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (type === 'register') {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match. Please try again.');
          setIsLoading(false);
          return;
        }
        const trimmedName = displayName.trim();
        await register(email, password, trimmedName, 'PHP');
        const name = trimmedName.split(' ')[0] || email.split('@')[0];
        toast.success(`Account created, ${name}! Please check your email to verify your account before logging in.`, { duration: 8000 });
        setIsRegister(false); // Switch to login view
        setPassword('');
        setConfirmPassword('');
      } else {
        await login(email, password);
        const storedUser = useAuthStore.getState().user;
        const name = storedUser?.displayName?.split(' ')[0] || storedUser?.email?.split('@')[0] || '';
        toast.success(name ? `Welcome back, ${name}! 👋` : 'Welcome back!');
        handleClose();
        navigate('/dashboard');
      }
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
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) {
      toast.error('Please enter your email first');
      return;
    }
    setIsLoading(true);
    try {
      await authApi.requestPasswordResetOTP(email);
      toast.success('OTP sent to your email!');
      setForgotPasswordStep('otp');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the full 6-digit OTP');
      return;
    }
    setIsLoading(true);
    try {
      await authApi.verifyPasswordResetOTP(email, otpString);
      setForgotPasswordStep('new-password');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetWithOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      const otpString = otp.join('');
      await authApi.resetPasswordWithOTP(email, otpString, password);
      toast.success('Password successfully reset! You can now log in.');
      setForgotPasswordStep('none');
      setIsRegister(false);
      setPassword('');
      setConfirmPassword('');
      setOtp(['', '', '', '', '', '']);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // one char max
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const inputClass = "w-full pl-11 pr-11 py-3 rounded-xl bg-black/20 border border-white/[0.08] text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#5c7cfa] focus:bg-white/[0.03] transition-all";
  const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40";
  const eyeClass = "absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/80 transition-colors";

  const modalContent = (
    <AnimatePresence>
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-[850px] min-h-[580px] rounded-[2rem] shadow-2xl overflow-hidden"
              style={{ background: '#0e0e1a', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 z-50 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>

              {forgotPasswordStep !== 'none' ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 relative z-20 min-h-[580px]">
                  <button onClick={() => setForgotPasswordStep('none')} className="absolute top-6 left-6 text-white/50 hover:text-white flex items-center text-sm transition-colors z-50">
                    <HiArrowLeft className="w-4 h-4 mr-1" /> Back to login
                  </button>
                  <div className="w-full max-w-[320px] mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Reset Password</h2>
                    
                    {forgotPasswordStep === 'email' && (
                      <form onSubmit={handleRequestOTP} className="space-y-4 mt-8">
                        <p className="text-sm text-white/60 mb-6">Enter your email address and we'll send you a 6-digit verification code.</p>
                        <div className="relative">
                          <HiOutlineMail className={iconClass} />
                          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-full bg-[#5c7cfa] hover:bg-[#4c6cf0] text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-[#5c7cfa]/20 transition-all active:scale-95 disabled:opacity-70">
                          {isLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                      </form>
                    )}

                    {forgotPasswordStep === 'otp' && (
                      <form onSubmit={handleVerifyOTP} className="space-y-6 mt-8">
                        <p className="text-sm text-white/60 mb-6">Enter the 6-digit code sent to<br/><span className="text-white font-medium">{email}</span></p>
                        <div className="flex justify-between gap-2">
                          {otp.map((digit, idx) => (
                            <input
                              key={idx}
                              ref={el => otpRefs.current[idx] = el}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              className="w-12 h-14 text-center rounded-xl bg-black/20 border border-white/[0.08] text-white text-xl font-bold focus:outline-none focus:border-[#5c7cfa] focus:bg-white/[0.03] transition-all"
                              required
                            />
                          ))}
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-full bg-[#5c7cfa] hover:bg-[#4c6cf0] text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-[#5c7cfa]/20 transition-all active:scale-95 disabled:opacity-70">
                          {isLoading ? 'Verifying...' : 'Verify Code'}
                        </button>
                      </form>
                    )}

                    {forgotPasswordStep === 'new-password' && (
                      <form onSubmit={handleResetWithOTP} className="space-y-4 mt-8">
                        <p className="text-sm text-white/60 mb-6">Enter your new password below.</p>
                        <div className="relative">
                          <HiOutlineLockClosed className={iconClass} />
                          <input type={showPassword ? 'text' : 'password'} placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required minLength={6} />
                          <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)} className={eyeClass}>
                            {showPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className="relative">
                          <HiOutlineLockClosed className={iconClass} />
                          <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} required minLength={6} />
                          <button type="button" tabIndex={-1} onClick={() => setShowConfirmPassword(v => !v)} className={eyeClass}>
                            {showConfirmPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                          </button>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-full bg-[#5c7cfa] hover:bg-[#4c6cf0] text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-[#5c7cfa]/20 transition-all active:scale-95 disabled:opacity-70">
                          {isLoading ? 'Updating...' : 'Reset Password'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ) : (
                <>
              {/* ===== DESKTOP LAYOUT (SLIDING PANELS) ===== */}
              <div className="hidden md:block w-full h-full relative min-h-[580px]">
                
                {/* 1. Sign In Form (Left Half) */}
                <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center p-10 transition-all duration-500 ease-in-out ${isRegister ? 'opacity-0 translate-x-12 pointer-events-none' : 'opacity-100 translate-x-0 z-10'}`}>
                  <div className="w-full max-w-[320px] mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Sign in to LifeSync</h2>
                    <p className="text-sm text-white/40 mb-8">use your email account:</p>
                    <form onSubmit={(e) => handleSubmit(e, 'login')} className="space-y-4">
                      <div className="relative">
                        <HiOutlineMail className={iconClass} />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
                      </div>
                      <div className="relative">
                        <HiOutlineLockClosed className={iconClass} />
                        <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
                        <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)} className={eyeClass}>
                          {showPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="pt-1 pb-4">
                        <button type="button" onClick={() => setForgotPasswordStep('email')} className="text-xs font-medium text-white/40 hover:text-white transition-colors">
                          Forgot your password?
                        </button>
                      </div>
                      <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-full bg-[#5c7cfa] hover:bg-[#4c6cf0] text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-[#5c7cfa]/20 transition-all active:scale-95 disabled:opacity-70">
                        {isLoading ? 'Wait...' : 'Sign In'}
                      </button>
                    </form>
                  </div>
                </div>

                {/* 2. Sign Up Form (Right Half) */}
                <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center p-10 transition-all duration-500 ease-in-out ${!isRegister ? 'opacity-0 -translate-x-12 pointer-events-none' : 'opacity-100 translate-x-0 z-10'}`}>
                  <div className="w-full max-w-[320px] mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
                    <p className="text-sm text-white/40 mb-8">use your email for registration:</p>
                    <form onSubmit={(e) => handleSubmit(e, 'register')} className="space-y-3.5">
                      <div className="relative">
                        <HiOutlineUser className={iconClass} />
                        <input type="text" placeholder="Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClass} required />
                      </div>
                      <div className="relative">
                        <HiOutlineMail className={iconClass} />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
                      </div>
                      <div className="relative">
                        <HiOutlineLockClosed className={iconClass} />
                        <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required minLength={6} />
                        <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)} className={eyeClass}>
                          {showPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="relative">
                        <HiOutlineLockClosed className={iconClass} />
                        <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} required minLength={6} />
                        <button type="button" tabIndex={-1} onClick={() => setShowConfirmPassword(v => !v)} className={eyeClass}>
                          {showConfirmPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="pt-3">
                        <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-full bg-[#5c7cfa] hover:bg-[#4c6cf0] text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-[#5c7cfa]/20 transition-all active:scale-95 disabled:opacity-70">
                          {isLoading ? 'Wait...' : 'Sign Up'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* 3. The Sliding Overlay Panel */}
                <motion.div
                  initial={false}
                  animate={{ x: isRegister ? '0%' : '100%' }}
                  transition={{ type: 'spring', stiffness: 350, damping: 35, ease: 'easeInOut' }}
                  className="absolute top-0 left-0 w-1/2 h-full z-20 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, #5c7cfa 0%, #22b8cf 100%)' }}
                >
                  <div className="relative w-full h-full pointer-events-auto">
                    {/* Overlay Content for Sign Up Mode (Overlay is on Left) */}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white transition-opacity duration-300 ${isRegister ? 'opacity-100 delay-150' : 'opacity-0 pointer-events-none'}`}>
                      <h2 className="text-4xl font-bold mb-4 tracking-tight">Welcome Back!</h2>
                      <p className="text-white/80 text-sm leading-relaxed mb-10 max-w-[250px]">
                        To keep connected with us please login with your personal info
                      </p>
                      <button
                        onClick={() => setIsRegister(false)}
                        className="px-12 py-3.5 rounded-full border border-white/40 hover:border-white text-white font-bold text-sm tracking-widest uppercase hover:bg-white/10 transition-colors active:scale-95"
                      >
                        Sign In
                      </button>
                    </div>

                    {/* Overlay Content for Sign In Mode (Overlay is on Right) */}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white transition-opacity duration-300 ${!isRegister ? 'opacity-100 delay-150' : 'opacity-0 pointer-events-none'}`}>
                      <h2 className="text-4xl font-bold mb-4 tracking-tight">Hello, Friend!</h2>
                      <p className="text-white/80 text-sm leading-relaxed mb-10 max-w-[250px]">
                        Enter your personal details and start your journey with us
                      </p>
                      <button
                        onClick={() => setIsRegister(true)}
                        className="px-12 py-3.5 rounded-full border border-white/40 hover:border-white text-white font-bold text-sm tracking-widest uppercase hover:bg-white/10 transition-colors active:scale-95"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </motion.div>

              </div>

              {/* ===== MOBILE LAYOUT (VERTICAL) ===== */}
              <div className="md:hidden flex flex-col w-full min-h-[650px] relative">
                <div className="flex-1 p-8 flex flex-col justify-center relative z-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isRegister ? 'm-reg' : 'm-log'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="w-full text-center mt-6"
                    >
                      <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {isRegister ? 'Create Account' : 'Sign in to LifeSync'}
                      </h2>
                      <p className="text-sm text-white/40 mb-8">
                        {isRegister ? 'use your email for registration:' : 'use your email account:'}
                      </p>

                      <form onSubmit={(e) => handleSubmit(e, isRegister ? 'register' : 'login')} className="space-y-4">
                        {isRegister && (
                          <div className="relative">
                            <HiOutlineUser className={iconClass} />
                            <input type="text" placeholder="Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClass} required />
                          </div>
                        )}
                        <div className="relative">
                          <HiOutlineMail className={iconClass} />
                          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
                        </div>
                        <div className="relative">
                          <HiOutlineLockClosed className={iconClass} />
                          <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required minLength={6} />
                          <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)} className={eyeClass}>
                            {showPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                          </button>
                        </div>
                        {isRegister && (
                          <>
                            <div className="relative">
                              <HiOutlineLockClosed className={iconClass} />
                              <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} required minLength={6} />
                              <button type="button" tabIndex={-1} onClick={() => setShowConfirmPassword(v => !v)} className={eyeClass}>
                                {showConfirmPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                              </button>
                            </div>

                          </>
                        )}
                        {!isRegister && (
                          <div className="pt-1 pb-2">
                            <button type="button" onClick={() => setForgotPasswordStep('email')} className="text-xs font-medium text-white/40 hover:text-white transition-colors">
                              Forgot your password?
                            </button>
                          </div>
                        )}
                        <div className="pt-4">
                          <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-full bg-[#5c7cfa] hover:bg-[#4c6cf0] text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-[#5c7cfa]/20 transition-all active:scale-95 disabled:opacity-70">
                            {isLoading ? 'Wait...' : (isRegister ? 'Sign Up' : 'Sign In')}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Mobile Bottom Switcher Panel */}
                <div 
                  className="w-full p-8 text-center text-white mt-auto rounded-t-3xl relative z-20"
                  style={{ background: 'linear-gradient(135deg, #5c7cfa 0%, #22b8cf 100%)' }}
                >
                  <h2 className="text-2xl font-bold mb-3 tracking-tight">
                    {isRegister ? 'Welcome Back!' : 'Hello, Friend!'}
                  </h2>
                  <p className="text-white/80 text-sm mb-6">
                    {isRegister ? 'Already have an account?' : 'Don\'t have an account yet?'}
                  </p>
                  <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="w-full py-3.5 rounded-full border border-white/40 hover:border-white text-white font-bold text-sm tracking-widest uppercase hover:bg-white/10 transition-colors active:scale-95"
                  >
                    {isRegister ? 'Sign In' : 'Sign Up'}
                  </button>
                </div>
              </div>
              </>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  let loaderMessage = isRegister ? 'Creating your account...' : 'Signing you in...';
  if (forgotPasswordStep === 'email') loaderMessage = 'Sending OTP...';
  if (forgotPasswordStep === 'otp') loaderMessage = 'Verifying OTP...';
  if (forgotPasswordStep === 'new-password') loaderMessage = 'Resetting Password...';

  return (
    <>
      {createPortal(modalContent, document.body)}
      <FullScreenLoader
        isVisible={isLoading}
        message={loaderMessage}
      />
    </>
  );
}
