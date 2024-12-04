import { defineStore } from 'pinia';
import { Message, User } from 'components/models';
import { ref } from 'vue';
import { Manager, Socket } from 'socket.io-client';
import { useAuthStore } from 'src/stores/authStore';

export const useChatStore = defineStore('chatStore', () => {
  const messages = ref<Message[]>([]);
  const writingMessages = ref<Message[]>([]);
  const channelUsers = ref<Record<number, User[]>>({});

  const authStore = useAuthStore();
  let socket: Socket | null = null;

  const manager = new Manager('http://localhost:3333', {
    autoConnect: false,
    transports: ['websocket'],
    withCredentials: true,
  });

  const connectToChannel = (channelId: number) => {
    messages.value.splice(0, messages.value.length);
    if (socket) {
      writingMessage('');
      socket.off('messagesLoaded');
      socket.off('message');
      socket.off('writing');
      socket.off('channelUsers');
      socket.disconnect();
    }

    const token = localStorage.getItem('token');
    // console.log('Token retrieved for WebSocket:', token);
    socket = manager.socket(`/channels/${channelId}`, {
      auth: {
        token: token,
      },
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket!.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socket.connect();

    socket.on(
      'messagesLoaded',
      (loadedMessages: Message[], channel_id: number) => {
        console.log('Channel users: ', channelUsers.value);
        console.log('Loaded messages: ', loadedMessages, channelId, channel_id);
        if (channel_id != channelId) {
          return;
        }
        loadedMessages.forEach((sprava) => {
          messages.value.unshift(sprava);
        });
      }
    );

    socket.on(
      'channelUsers',
      ({ channelId, users }: { channelId: number; users: User[] }) => {
        channelUsers.value[channelId] = users;
        console.log(`Users in channel ${channelId}:`, users);
      }
    );

    socket.on('message', (message: Message) => {
      console.log('New message (listening):', message);
      messages.value.push(message);
    });
    socket.on('writing', (messages: Message[]) => {
      console.log('Writing message: ', messages);

      writingMessages.value.splice(0, writingMessages.value.length);

      console.log('aaaaa');

      messages.forEach((message) => {
        if (message.createdBy != authStore.user?.id.toString()) {
          writingMessages.value.push(message);
          console.log('sad', message);
        }
      });
      console.log(writingMessages.value);
    });
    writingMessage('');
  };

  const addMessage = (content: string) => {
    if (socket) {
      socket.emit('addMessage', content);
    }
  };
  const writingMessage = (input: string) => {
    if (socket) {
      socket.emit('writingMessage', input);
    }
  };
  const loadMessages = (from: number, to: number, channel_id: number) => {
    console.log('loadingmessageslazy', from, to);
    if (socket) {
      socket.emit('loadMessages', from, to, channel_id);
    }
  };

  const inviteUser = (channelId: number, username: string) => {
    if (socket) {
      socket.emit(
        'inviteUser',
        username,
        (response: { success: boolean; message?: string }) => {
          if (response.success) {
            console.log(`${username} invited successfully`);
          } else {
            console.error(`Failed to invite ${username}:`, response.message);
          }
        }
      );
    }
  };

  return {
    messages,
    channelUsers,
    connectToChannel,
    addMessage,
    writingMessage,
    writingMessages,
    loadMessages,
    inviteUser,
  };
});
