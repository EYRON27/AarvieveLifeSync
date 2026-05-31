import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineEye, HiOutlineEyeOff, HiArrowLeft } from 'react-icons/hi';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/endpoints';
import toast from 'react-hot-toast';
import { useRef } from 'react';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP Flow State
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'none' | 'email' | 'otp' | 'new-password'>('none');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegister) {
        await register(email, password, displayName);
        toast.success('Account created successfully!');
      } else {
        await login(email, password);
        toast.success('Welcome back!');
      }
      navigate('/dashboard');
    } catch (err: any) {
      let errorMessage = err.message || 'Invalid email or password. Please try again.';
      if (err.message && err.message.includes('502')) {
        errorMessage = 'Unable to connect to the server. Please try again later.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password. Please try again.';
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-dark-800 to-dark-900 p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-xl shadow-primary-500/30 mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white">AarvieveLifeSync</h1>
          <p className="text-primary-200 mt-2">Your personal productivity hub</p>
        </div>

        {/* Form card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            {forgotPasswordStep !== 'none' 
              ? 'Reset Password' 
              : isRegister 
                ? 'Create Account' 
                : 'Welcome Back'}
          </h2>

          {forgotPasswordStep === 'none' ? (
            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <div className="relative">
                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/10
                        text-white placeholder-gray-400 focus:outline-none focus:border-primary-400
                        focus:ring-4 focus:ring-primary-500/20 transition-all"
                      required={isRegister}
                      id="register-name"
                    />
                  </div>
                )}

                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/10
                      text-white placeholder-gray-400 focus:outline-none focus:border-primary-400
                      focus:ring-4 focus:ring-primary-500/20 transition-all"
                    required
                    id="login-email"
                  />
                </div>

                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/10 border border-white/10
                      text-white placeholder-gray-400 focus:outline-none focus:border-primary-400
                      focus:ring-4 focus:ring-primary-500/20 transition-all"
                    required
                    minLength={6}
                    id="login-password"
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                    {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </div>

                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => setForgotPasswordStep('email')}
                    className="text-sm text-primary-300 hover:text-primary-200 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-semibold text-white gradient-primary
                    hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  id="login-submit"
                >
                  {isLoading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-sm text-primary-300 hover:text-white transition-colors"
                  id="toggle-auth-mode"
                >
                  {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <button onClick={() => setForgotPasswordStep('none')} className="mb-6 flex items-center text-sm text-primary-300 hover:text-white transition-colors">
                <HiArrowLeft className="w-4 h-4 mr-1" /> Back to login
              </button>
              
              {forgotPasswordStep === 'email' && (
                <form onSubmit={handleRequestOTP} className="space-y-4">
                  <p className="text-sm text-gray-400 mb-6">Enter your email address and we'll send you a 6-digit verification code.</p>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/20 transition-all"
                      required
                    />
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl font-semibold text-white gradient-primary hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]">
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </form>
              )}

              {forgotPasswordStep === 'otp' && (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <p className="text-sm text-gray-400 mb-6">Enter the 6-digit code sent to<br/><span className="text-white font-medium">{email}</span></p>
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
                        className="w-11 h-14 text-center rounded-xl bg-white/10 border border-white/10 text-white text-xl font-bold focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/20 transition-all"
                        required
                      />
                    ))}
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl font-semibold text-white gradient-primary hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]">
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </button>
                </form>
              )}

              {forgotPasswordStep === 'new-password' && (
                <form onSubmit={handleResetWithOTP} className="space-y-4">
                  <p className="text-sm text-gray-400 mb-6">Enter your new password below.</p>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/20 transition-all"
                      required
                      minLength={6}
                    />
                    <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                      {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/20 transition-all"
                      required
                      minLength={6}
                    />
                    <button type="button" tabIndex={-1} onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                      {showConfirmPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                    </button>
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl font-semibold text-white gradient-primary hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]">
                    {isLoading ? 'Updating...' : 'Reset Password'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
