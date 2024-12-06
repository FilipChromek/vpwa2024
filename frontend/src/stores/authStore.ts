import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { api } from 'boot/axios';
import { User } from 'components/models';
import { Socket } from 'socket.io-client';
import websocketService from 'src/services/websocketService';
import { useChatStore } from 'stores/chatStore';
import { Notify } from 'quasar';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const isAuthenticated = ref(false);
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const chatStore = useChatStore();

  let socket: Socket | null = null;

  const connectSocket = () => {
    if (!socket) {
      socket = websocketService.connect('/auth', {
        auth: { token: token.value },
      });

      console.log('im in auth connect socket', socket);

      socket.on('connect', () => {
        console.log('Socket auth connected');
      });

      socket.on('disconnect', () => {
        console.log('Socket auth disconnected');
      });

      socket.on('error', (error: { message: string }) => {
        console.error('Error received:', error);
        Notify.create({
          message: `Error: ${error.message}`,
          color: 'negative',
          timeout: 3000,
          position: 'top-right',
        });
      });

      socket.on(
        'userStatusUpdate',
        (data: { userId: number; status: string }) => {
          console.log('User status updated:', data);
          for (const channelId in chatStore.channelUsers) {
            const users = chatStore.channelUsers[channelId];
            const user = users.find((u) => u.id === data.userId);
            if (user) {
              user.status = data.status; // Update the user's status
              console.log(
                `Updated status for user ${user.id} in channel ${channelId}`
              );
            }
          }
        }
      );

      socket.connect();
    }
  };

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
      connectSocket();
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
      connectSocket();
      changeStatus('Online');
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const changeStatus = (newStatus: string) => {
    if (socket) {
      socket.emit('changeStatus', newStatus);
    }
  };

  const logout = async () => {
    // await api.post('/logout');
    token.value = null;
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    changeStatus('Offline');
    if (socket) {
      socket.disconnect();
      socket = null;
    }
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
        connectSocket();
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
    changeStatus,
  };
});
