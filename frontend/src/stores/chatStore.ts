import { defineStore } from 'pinia';
import { Message, User } from 'components/models';
import { ref } from 'vue';
import { Socket } from 'socket.io-client';
import websocketService from 'src/services/websocketService';
import { useAuthStore } from 'stores/authStore';
import { Notify } from 'quasar';

export const useChatStore = defineStore('chatStore', () => {
  const messages = ref<Message[]>([]);
  const writingMessages = ref<Message[]>([]);
  const channelUsers = ref<Record<number, User[]>>({});

  let socket: Socket | null = null;
  const authStore = useAuthStore();

  const connectToChannel = (channelId: number) => {
    messages.value.splice(0, messages.value.length);
    if (socket) {
      writingMessage('');
      socket.off('messagesLoaded');
      socket.off('message');
      socket.off('writing');
      socket.off('error');
      socket.off('channelUsers');
      websocketService.disconnect(`/channels/${channelId}`);
      socket = null;
    }

    const token = localStorage.getItem('token');
    socket = websocketService.connect(`/channels/${channelId}`, {
      auth: { token },
    });

    console.log('im in chat connect socket', socket);

    socket.on('connect', () => {
      console.log('Socket connected:', socket!.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
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
      'messagesLoaded',
      (loadedMessages: Message[], channel_id: number) => {
        console.log('Channel users: ', channelUsers.value);
        console.log('Loaded messages: ', loadedMessages, channelId, channel_id);
        if (channel_id != channelId) {
          return;
        }
        loadedMessages.forEach((message) => {
          messages.value.unshift(message);
        });
      }
    );

    socket.on(
      'channelUsers',
      ({ channelId, users }: { channelId: number; users: User[] }) => {
        channelUsers.value[channelId] = users;
      }
    );

    socket.on('message', (message: Message) => {
      console.log('New message (listening):', message);
      messages.value.push(message);
    });

    socket.on('writing', (messages: Message[]) => {
      console.log('Writing message: ', messages);

      writingMessages.value.splice(0, writingMessages.value.length);

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
    console.log('Lazy-loading messages:', from, to);
    if (socket) {
      socket.emit('loadMessages', from, to, channel_id);
    }
  };

  return {
    messages,
    channelUsers,
    connectToChannel,
    addMessage,
    writingMessage,
    writingMessages,
    loadMessages
  };
});
