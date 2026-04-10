import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,          // "super_admin" | "manager" | "staff" | "user"
      isAuthenticated: false,

      login: (token, user, role) =>
        set({ token, user, role, isAuthenticated: true }),

      logout: () =>
        set({ token: null, user: null, role: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" }   // persisted to localStorage
  )
);
