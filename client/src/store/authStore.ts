import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { firebaseAuth } from '@/services/firebase';
import { authApi } from '@/services/endpoints';

interface AuthState {
  user: FirebaseUser | null;
  dbUser: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, currency?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setUser: (user: FirebaseUser | null) => void;
  clearError: () => void;
  initializeAuth: () => () => void;
  setDbUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  dbUser: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      
      if (!cred.user.emailVerified) {
        await signOut(firebaseAuth);
        throw new Error('Please verify your email before logging in. Check your inbox.');
      }

      try {
        const res = await authApi.syncUser({
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName,
        });
        set({ dbUser: res.data.data });
      } catch {
        // Backend sync failed, but Firebase auth succeeded — continue
      }
      set({ user: cred.user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Login failed', isLoading: false });
      throw err;
    }
  },

  register: async (email, password, displayName, currency) => {
    try {
      set({ isLoading: true, error: null });
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(cred.user, { displayName });
      try {
        // Always call syncUser first (may race with onAuthStateChanged)
        const syncRes = await authApi.syncUser({ uid: cred.user.uid, email, displayName, currency: currency || 'PHP' });
        // Then always force-update profile to guarantee correct name + currency
        const existingPrefs = syncRes.data.data?.preferences || {};
        const res = await authApi.updateProfile({
          displayName,
          preferences: { ...existingPrefs, currency: currency || 'PHP' }
        });
        set({ dbUser: res.data.data });
      } catch {
        // Backend sync failed, but Firebase auth succeeded — continue
      }

      await sendEmailVerification(cred.user);
      await signOut(firebaseAuth);

      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    await signOut(firebaseAuth);
    set({ user: null, dbUser: null, isAuthenticated: false });
  },

  resetPassword: async (email) => {
    try {
      set({ error: null });
      await sendPasswordResetEmail(firebaseAuth, email);
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user, isLoading: false });
  },

  clearError: () => set({ error: null }),

  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        if (!user.emailVerified) {
          await signOut(firebaseAuth);
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        try {
          const res = await authApi.syncUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          });
          set({ dbUser: res.data.data });
        } catch {
          // Backend may be unreachable during dev
        }
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
    return unsubscribe;
  },

  setDbUser: (user) => set({ dbUser: user }),
}));
