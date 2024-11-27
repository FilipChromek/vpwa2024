import { defineStore } from 'pinia';
import { Message } from 'components/models';
import { ref } from 'vue';
import { Manager, Socket } from 'socket.io-client';
import { useAuthStore } from 'src/stores/authStore';


export const useChatStore = defineStore('chatStore', () => {
  const messages = ref<Message[]>([]);
  const writingMessages = ref<Message[]>([]);
  const authStore = useAuthStore();
  let socket: Socket | null = null;
  const manager = new Manager('http://localhost:3333', {
    autoConnect: false,
    transports: ['websocket'],
    withCredentials: true,
  });

  const connectToChannel = (channelId: number) => {
    if (socket) {
      socket.off('message');
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

    socket.emit('loadMessages');

    socket.once('messagesLoaded', (loadedMessages: Message[]) => {
      console.log('Loaded messages: ', loadedMessages);
      messages.value = loadedMessages;
    });

    socket.on('message', (message: Message) => {
      console.log('New message (listening):', message);
      messages.value.push(message);
    });
    socket.on('writing', (message: Message) => {
      console.log('Writing message: ', message);
      // Remove any existing writing message from the same user
  const existingIndex = writingMessages.value.findIndex(
    (msg) => msg.createdBy === message.createdBy // Use the correct unique identifier
  );
  if (existingIndex !== -1) {
    writingMessages.value.splice(existingIndex, 1); // Remove the old message
  }
  if (message.content!="" && message.createdBy!=authStore.user?.id.toString()){
  // Add the new writing message
  writingMessages.value.push(message);
  }
      
    });
  };

  const addMessage = (content: string) => {
    if (socket) {
      socket.emit('addMessage', content);
    }
  };
  const writingMessage=(vstup:string)=>{
    if (socket) {
      socket.emit('writingMessage', vstup);
    }

  }

  return {
    messages,
    connectToChannel,
    addMessage,
    writingMessage,
    writingMessages
  };
});
