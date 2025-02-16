import { create } from 'zustand'

const useSidebarStore = create((set) => ({
    isSideBarOpen: false,
    toggleSideBar: () => set((state) => ({isSideBarOpen: !state.isSideBarOpen }))
}))

export default useSidebarStore;