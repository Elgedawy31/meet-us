import { create } from 'zustand';
import Cookies from 'js-cookie';
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
      const res = await axios.post('https://api-yeshtery.dev.meetusvr.com/v1/yeshtery/token', {
        ...data,
        isEmployee: true,
      });

      console.log(res.data);

      set({
        token: res.data.token,
        refreshToken: res.data.refresh,
        userInfo: res.data.userInfo as UserInfo,
      });
      Cookies.set('token', res.data.token, { expires: 7 });
      Cookies.set('refresh', res.data.refresh, { expires: 30 }); // Refresh token typically has a longer expiry
      localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo));

      // Fetch user info
      try {
        const userInfoRes = await axios.get('https://api-yeshtery.dev.meetusvr.com/v1/user/info', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${res.data.token}`,
          },
        });
        set({ userInfo: userInfoRes.data as UserInfo });
        localStorage.setItem('userInfo', JSON.stringify(userInfoRes.data));
      } catch (userInfoError: unknown) {
        console.error('An error occurred while fetching user info:', userInfoError);
        let userInfoErrorMessage = 'Failed to fetch user information.';
        if (axios.isAxiosError(userInfoError) && userInfoError.response?.data?.message) {
          userInfoErrorMessage = userInfoError.response.data.message;
        }
        set({ error: userInfoErrorMessage });
        toast.error(userInfoErrorMessage);
        // Clear tokens and user info if fetching user info fails
        Cookies.remove('token');
        Cookies.remove('refresh');
        localStorage.removeItem('userInfo');
        set({ token: null, refreshToken: null, userInfo: null });
        throw userInfoError; // Re-throw to propagate the error
      }
      
      toast.success('Login successful!');
    } catch (error: unknown) {
      console.error('An error occurred while logging in:', error);
      let errorMessage = 'Login failed. Please try again.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error; // Re-throw the error so the component can catch it
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    set({ token: null, refreshToken: null, userInfo: null });
    Cookies.remove('token');
    Cookies.remove('refresh');
    localStorage.removeItem('userInfo');
    toast.success('Logged out successfully!');
  },
}));

// Hydrate token and userInfo from cookies/localStorage on client
if (typeof window !== 'undefined') {
  const tokenFromCookie = Cookies.get('token');
  const refreshTokenFromCookie = Cookies.get('refresh');
  const userInfoFromLocalStorage = localStorage.getItem('userInfo');

  const initialState: Partial<AuthState> = {};

  if (tokenFromCookie) {
    initialState.token = tokenFromCookie;
  }
  if (refreshTokenFromCookie) {
    initialState.refreshToken = refreshTokenFromCookie;
  }
  if (userInfoFromLocalStorage) {
    initialState.userInfo = JSON.parse(userInfoFromLocalStorage) as UserInfo;
  }
  useAuthStore.setState(initialState);
  useAuthStore.setState({ _hasHydrated: true });
}
