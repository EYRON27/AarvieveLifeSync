import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
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
        let res = await authApi.syncUser({ uid: cred.user.uid, email, displayName, currency: currency || 'USD' });

        // Race condition fix: If onAuthStateChanged created the user first without currency or displayName, update it now
        const needsCurrencyUpdate = currency && res.data.data.preferences?.currency !== currency;
        const needsNameUpdate = displayName && res.data.data.displayName !== displayName;

        if (needsCurrencyUpdate || needsNameUpdate) {
          res = await authApi.updateProfile({
            displayName: displayName || res.data.data.displayName,
            preferences: { ...res.data.data.preferences, currency: currency || res.data.data.preferences?.currency }
          });
        }

        set({ dbUser: res.data.data });
      } catch {
        // Backend sync failed, but Firebase auth succeeded — continue
      }
      set({ user: cred.user, isAuthenticated: true, isLoading: false });
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
      }
      set({ user, isAuthenticated: !!user, isLoading: false });
    });
    return unsubscribe;
  },

  setDbUser: (user) => set({ dbUser: user }),
}));
