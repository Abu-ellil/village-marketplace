import { create } from 'zustand';

interface ToastState {
  message: string;
  isVisible: boolean;
  show: (message: string) => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>()((set) => ({
  message: '',
  isVisible: false,
  show: (message) => {
    set({ message, isVisible: true });
    setTimeout(() => set({ isVisible: false }), 3000); // Auto-hide after 3 seconds
  },
  hide: () => set({ isVisible: false }),
}));
