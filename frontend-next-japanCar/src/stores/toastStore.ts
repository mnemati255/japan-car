import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastState = {
  message: string | null;
  type: ToastType;
  setToast: (type: ToastType, message: string) => void;
  clearToast: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: 'info',
  setToast: (type, message) => set({ message, type }),
  clearToast: () => set({ message: null }),
}));
