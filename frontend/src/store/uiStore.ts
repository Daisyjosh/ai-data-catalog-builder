import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  darkMode: boolean
  notifications: any[]
  setSidebarOpen: (open: boolean) => void
  setDarkMode: (dark: boolean) => void
  addNotification: (notification: any) => void
  removeNotification: (id: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  darkMode: false,
  notifications: [],
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setDarkMode: (dark) => set({ darkMode: dark }),
  addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
  removeNotification: (id) => set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),
}))
