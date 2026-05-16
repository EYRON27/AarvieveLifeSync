import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  isLoginModalOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLoginModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  isLoginModalOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setLoginModalOpen: (open) => set({ isLoginModalOpen: open }),
}));
