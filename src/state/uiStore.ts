import { create } from "zustand"

interface UIStore {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  selectedCaseId: string | null
  setSelectedCaseId: (id: string | null) => void
  filterPanelOpen: boolean
  setFilterPanelOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  selectedCaseId: null,
  setSelectedCaseId: (id) => set({ selectedCaseId: id }),
  filterPanelOpen: true,
  setFilterPanelOpen: (open) => set({ filterPanelOpen: open }),
}))
