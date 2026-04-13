import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  coverphoto?: string | null;
  bio?: string | null;
  username?: string; 
};

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (data) => set((state) => ({ 
        user: state.user ? { ...state.user, ...data} : null,
      })),
      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: "auth-user",
    }
  )
);
