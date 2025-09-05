import { create } from 'zustand';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  login: (token: string, rememberMe: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null, // Initialize as null on server
  setToken: (token) => set({ token }),
  login: (token, rememberMe) => {
    set({ token });
    if (rememberMe) {
      Cookies.set('token', token, { expires: 7 }); // Expires in 7 days
    } else {
      Cookies.set('token', token); // Session cookie
    }
  },
  logout: () => {
    set({ token: null });
    Cookies.remove('token');
  },
}));

// Client-side hydration of the token
if (typeof window !== 'undefined') {
  const tokenFromCookie = Cookies.get('token');
  if (tokenFromCookie) {
    useAuthStore.setState({ token: tokenFromCookie });
  }
}
