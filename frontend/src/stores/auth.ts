import { defineStore } from 'pinia';

interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    userInfo: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.userInfo?.role === 'admin',
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
    },
    logout() {
      this.token = null;
      this.userInfo = null;
      localStorage.removeItem('token');
    },
  },
});
