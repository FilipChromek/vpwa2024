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
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      isAuthenticated.value = true;
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
      console.log('Token receiver from server:', token.value);
      isAuthenticated.value = true;
      localStorage.setItem('token', token.value!);
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const changeStatus = async (newStatus: string) => {
    await api.post('/changestatus',{'status':newStatus});
    
  };

  const logout = async () => {
    // await api.post('/logout');
    token.value = null;
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    router.push('/auth/login'); // Redirect to login
  };

  const restoreUser = async () => {
    if (token.value) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      try {
        const response = await api.get('/api/current-user');
        console.log('User restoration response:', response.data);
        user.value = response.data;
        isAuthenticated.value = true;
      } catch (error) {
        console.error('Session restoration failed:', error);
        await logout();
      }
    }
  };

  // const initializeAuth = async () => {
  //   const storedToken = localStorage.getItem('token');
  //   if (storedToken) {
  //     token.value = storedToken;
  //     api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
  //     await restoreUser();
  //   } else {
  //     await logout();
  //   }
  // };
  //
  // initializeAuth();

  return {
    isAuthenticated,
    user,
    token,
    register,
    login,
    logout,
    restoreUser,
    changeStatus
  };
});
