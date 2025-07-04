import { create } from "zustand"
import type { NavigationTree } from "@/@types/navigation"
import { apiGetMenuItem } from "@/services/MenuItem"

interface NavigationState {
  menuItems: NavigationTree[]
  fetchMenuItems: () => Promise<void>
}

const useNavigationStore = create<NavigationState>()((set, get) => ({
  menuItems: [],

  fetchMenuItems: async () => {
    if (get().menuItems.length > 0) return // Avoid API call if data exists

    try {
      const response = (await apiGetMenuItem()) as { data: NavigationTree[] }
      const menuItems = response.data || []

      // No need to add static menu items since backend now provides Next Numbering
      set({ menuItems })
    } catch (error) {
      console.error("❌ Error fetching menu items:", error)
      set({ menuItems: [] })
    }
  },
}))

export default useNavigationStore

