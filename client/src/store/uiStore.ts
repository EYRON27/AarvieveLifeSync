import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  isLoginModalOpen: boolean;
  loginModalMode: 'login' | 'register';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLoginModalOpen: (open: boolean, mode?: 'login' | 'register') => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  isLoginModalOpen: false,
  loginModalMode: 'login',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setLoginModalOpen: (open, mode) => set((state) => ({ 
    isLoginModalOpen: open, 
    loginModalMode: mode || state.loginModalMode 
  })),
}));
