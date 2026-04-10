import { create } from "zustand";

export const useRestaurantStore = create((set) => ({
  restaurant: null,
  isLoading: false,
  error: null,

  setRestaurant: (restaurant) => set({ restaurant, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
