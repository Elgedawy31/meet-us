import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

type Data = {
  email: string;
  password: string;
};

interface UserInfo {
  id: number;
  name: string;
  email: string;
  roles: string[];
  imageUrl: string | null;
  organizationId: number;
  isEmployee: boolean;
  shopId: number;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  userInfo: UserInfo | null; // Define a more specific type if possible
  loading: boolean;
  error: string | null;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setUserInfo: (userInfo: UserInfo | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (data: Data) => Promise<void>;
  logout: () => void;
  _hasHydrated: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  userInfo: null,
  loading: false,
  error: null,
  _hasHydrated: false,
  setToken: (token) => set({ token }),
  setRefreshToken: (refreshToken) => set({ refreshToken }),
  setUserInfo: (userInfo) => set({ userInfo }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post('/api/login', data);
  
      if (res.data.success) {
        const userInfoRes = await axios.get('/api/user-info');
        if (userInfoRes.data.success) {
          set({ userInfo: userInfoRes.data.userInfo });
          toast.success('Login successful!');
        } else {
          throw new Error(userInfoRes.data.message || 'Failed to fetch user info after login');
        }
      } else {
        throw new Error(res.data.message || 'Login failed');
      }
    } catch (error: unknown) {
      console.error('An error occurred while logging in:', error);
      let errorMessage = 'Login failed. Please try again.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error; // Re-throw the error so the component can catch it
    } finally {
      set({ loading: false });
    }
  },
  
  logout: async () => {
    set({ loading: true, error: null });
    try {
      await axios.post('/api/logout');
      set({ userInfo: null }); // Only clear userInfo
      toast.success('Logged out successfully!');
    } catch (error: unknown) {
      console.error('An error occurred during logout:', error);
      let errorMessage = 'Logout failed. Please try again.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
}));
  
  // Hydrate token and userInfo from cookies/localStorage on client
  if (typeof window !== 'undefined') {
    // Initial authentication check will be handled by a client-side fetch to /api/user-info
    const initializeAuth = async () => {
      try {
        const res = await axios.get('/api/user-info');
        if (res.data.success) {
          useAuthStore.setState({ userInfo: res.data.userInfo, _hasHydrated: true });
        } else {
          useAuthStore.setState({ userInfo: null, _hasHydrated: true });
        }
      } catch (error) {
        console.error('Failed to fetch user info during hydration:', error);
        useAuthStore.setState({ userInfo: null, _hasHydrated: true });
      }
    };
    initializeAuth();
  }
