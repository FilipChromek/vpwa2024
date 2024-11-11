import { defineStore } from 'pinia';
import { Message } from 'components/models';
import { ref } from 'vue';
import { io, Socket } from 'socket.io-client';

// export const useChatStore = defineStore('chatStore', () => {
//   const socket: Socket = io('http://localhost:3333/channels/1');
//   const messages = ref<Message[]>([]);
//
//   const loadMessages = () => {
//     socket.emit('loadMessages');
//
//     socket.once('messagesLoaded', (loadedMessages: Message[]) => {
//       messages.value = loadedMessages;
//     });
//   };
//
//   const addMessage = (content: string) => {
//     socket.emit('addMessage', content); // Send message to the server
//   };
//
//   // Listen for any new messages from the server in real time
//   socket.on('message', (message: Message) => {
//     messages.value.push(message); // Add incoming message to the state
//   });
//
//   // Return state and actions to be used outside the store
//   return {
//     messages,
//     loadMessages,
//     addMessage,
//   };
// });

export const useChatStore = defineStore('chatStore', () => {
  const messages = ref<Message[]>([]);
  const socket = ref<Socket | null>(null);

  const connectToChannel = (channelId: number) => {
    // Disconnect from the previous channel if it exists
    if (socket.value) {
      socket.value.disconnect();
    }

    // Connect to the new channel namespace
    socket.value = io(`http://localhost:3333/channels/${channelId}`, {
      withCredentials: true, // Ensure CORS settings if required
      transports: ['websocket'], // Force WebSocket transport
    });

    // Load messages when connected
    socket.value.emit('loadMessages');

    socket.value.on('messagesLoaded', (loadedMessages: Message[]) => {
      messages.value = loadedMessages;
    });

    // Listen for new messages
    socket.value.on('message', (message: Message) => {
      messages.value.push(message);
    });
  };

  const addMessage = (content: string) => {
    if (socket.value) {
      socket.value.emit('addMessage', content);
    }
  };

  return {
    messages,
    connectToChannel,
    addMessage,
  };
});
