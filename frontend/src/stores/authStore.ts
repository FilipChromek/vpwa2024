import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { api } from 'boot/axios';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const isAuthenticated = ref(false);
  const user = ref(null);
  const token = ref<string | null>(null);

  // TODO toto tu dorobit
  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/login', credentials);
      token.value = response.data.token;
      user.value = response.data.user;
      isAuthenticated.value = true;
      router.push('/'); // Redirect to the dashboard or main page
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
    login,
    logout,
    checkAuthStatus,
  };
});
