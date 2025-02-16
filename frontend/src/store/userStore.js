import { create } from "zustand";
import { persist } from "zustand/middleware";

const userStore = create(
  persist(
    (set) => ({
      user: null,

      // ✅ Fetch user data from backend
      fetchUser: async () => {
        try {
          const response = await fetch("/api/auth/user", {
            credentials: "include",
          });
          const data = await response.json();

          if (data && !data.error) {
            set({ user: data }); // ✅ Store user data
          } else {
            console.warn("No user found");
            set({ user: null }); // ✅ Ensure user is null if request fails
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          set({ user: null });
        }
      },

      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
      getStorage: () => localStorage,
    }
  )
);

export default userStore;
