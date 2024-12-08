import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/authStore';

const api = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
  headers: {},
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  console.log('Axios token:', authStore.token);
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const router = useRouter();

    if (error.response?.status === 401) {
      router.push('/auth/login');
    }

    return Promise.reject(error);
  }
);

export { api };
