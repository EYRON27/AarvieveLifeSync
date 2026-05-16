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
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setUser: (user: FirebaseUser | null) => void;
  clearError: () => void;
  initializeAuth: () => () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      try {
        await authApi.syncUser({
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName,
        });
      } catch {
        // Backend sync failed, but Firebase auth succeeded — continue
      }
      set({ user: cred.user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Login failed', isLoading: false });
      throw err;
    }
  },

  register: async (email, password, displayName) => {
    try {
      set({ isLoading: true, error: null });
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(cred.user, { displayName });
      try {
        await authApi.syncUser({ uid: cred.user.uid, email, displayName });
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
    set({ user: null, isAuthenticated: false });
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
          await authApi.syncUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          });
        } catch {
          // Backend may be unreachable during dev
        }
      }
      set({ user, isAuthenticated: !!user, isLoading: false });
    });
    return unsubscribe;
  },
}));
