import { create } from 'zustand';
import Cookies from 'js-cookie';
import axios from 'axios';

type Data = {
  email: string;
  password: string;
};

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  login: (data: Data) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  
  login: async (data) => {
    try {
      const res = await axios.post('https://api-yeshtery.dev.meetusvr.com/v1/yeshtery/token', {
        ...data,
        isEmployee: true,
      });

      console.log(res.data);

      set({ token: res.data.token });
      Cookies.set('token', res.data.token, { expires: 7 });
    } catch (error) {
      console.error('An error occurred while logging in:', error);
    }
  },

  logout: () => {
    set({ token: null });
    Cookies.remove('token');
  },
}));

// Hydrate token from cookies on client
if (typeof window !== 'undefined') {
  const tokenFromCookie = Cookies.get('token');
  if (tokenFromCookie) {
    useAuthStore.setState({ token: tokenFromCookie });
  }
}
