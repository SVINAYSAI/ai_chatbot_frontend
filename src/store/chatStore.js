import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  sessionToken: null,
  messages: [],
  isOpen: false,
  isLoading: false,

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  setSessionToken: (token) => set({ sessionToken: token }),

  addMessage: (role, content) =>
    set((state) => ({
      messages: [...state.messages, { role, content, id: Date.now() }]
    })),

  setLoading: (val) => set({ isLoading: val }),

  reset: () => set({ sessionToken: null, messages: [], isLoading: false }),
}));
