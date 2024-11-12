import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { api } from 'boot/axios';
import { User } from 'components/models';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const isAuthenticated = ref(false);
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));

  const register = async (credentials: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await api.post('/register', credentials);
      token.value = response.data.token.token;
      user.value = response.data.user;
      localStorage.setItem('token', token.value!);
      router.push('/');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/login', credentials);
      console.log(response.data);
      token.value = response.data.token.token;
      user.value = response.data.user;
      console.log(token.value);
      isAuthenticated.value = true;
      localStorage.setItem('token', token.value!);
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
      token.value = null;
      user.value = null;
      isAuthenticated.value = false;
      router.push({ name: 'login' }); // Redirect to login
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/api/current-user');
      user.value = response.data.user;
      isAuthenticated.value = true;
    } catch {
      isAuthenticated.value = false;
      token.value = null;
      router.push('/login'); // Redirect to login if not authenticated
    }
  };

  return {
    isAuthenticated,
    user,
    token,
    register,
    login,
    logout,
    checkAuthStatus,
  };
});
