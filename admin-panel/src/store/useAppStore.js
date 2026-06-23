import { create } from "zustand";

export const useAppStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  user: null,
  setUser: (user) => set({ user }),
}));
