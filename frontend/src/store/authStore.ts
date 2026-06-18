'use client';
import { create } from 'zustand';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    set({ token: null, user: null });
  },
  hydrate: () => {
    const token = localStorage.getItem('admin_token');
    const raw = localStorage.getItem('admin_user');
    if (token && raw) {
      try {
        const user = JSON.parse(raw) as AuthUser;
        set({ token, user });
      } catch { /* ignore */ }
    }
  },
}));
