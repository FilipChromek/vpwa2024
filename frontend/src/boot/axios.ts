import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/authStore';

const api = axios.create({
  baseURL: 'http://127.0.0.1:3333', // process.env.API_URL,
  withCredentials: true,
  headers: {},
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  console.log(authStore.token);
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response, // Pass successful responses through unchanged
  (error) => {
    const router = useRouter();

    // Check if error status is 401 (unauthorized)
    if (error.response?.status === 401) {
      router.push({ name: 'login' }); // Redirect to login page
    }

    return Promise.reject(error);
  }
);

export { api };
