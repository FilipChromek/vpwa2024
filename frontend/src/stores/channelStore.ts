import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Channel, User } from 'components/models';
import websocketService from 'src/services/websocketService';
import { Notify } from 'quasar';
import { useChatStore } from 'stores/chatStore';
import { Socket } from 'socket.io-client';

export const useChannelStore = defineStore('channelStore', () => {
  const channels = ref<Channel[]>([]);
  const pendingChannels = ref([]);
  const token = ref<string | null>(localStorage.getItem('token'));
  const chatStore = useChatStore();

  let socket: Socket | null = null;

  const connectToChannels = () => {
    if (!socket) {
      socket = websocketService.connect('/channels', {
        auth: { token: token.value },
      });

      console.log('im in channel connect socket', socket);

      socket.on('connect', () => {
        console.log('Socket channel connected');
        loadChannels();
      });

      socket.on('disconnect', () => {
        console.log('Socket channel disconnected');
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

      socket.on('loadedChannels', (loadedChannels: Channel[]) => {
        channels.value = loadedChannels;
        console.log('Channels loaded:', loadedChannels);
      });

      socket.on(
        'channelUsers',
        (data: { channelId: number; users: User[] }) => {
          console.log('Channel users updated:', data);
          chatStore.channelUsers[data.channelId] = data.users;
        }
      );

      socket.on('channelAdded', (channel: Channel) => {
        console.log('Channel added:', channel);
        loadChannels();
        Notify.create({
          message: `Channel "${channel.name}" added successfully!`,
          color: 'positive',
          timeout: 3000,
          position: 'top-right',
        });
      });

      socket.on('channelDeleted', ({ channelId }: { channelId: number }) => {
        console.log('Channel deleted:', channelId);
        loadChannels();
        Notify.create({
          message: 'Channel deleted successfully!',
          color: 'positive',
          timeout: 3000,
          position: 'top-right',
        });
      });
    }
  };

  const loadChannels = () => {
    if (socket) {
      socket.emit('loadChannels');
    }
  };

  const addChannel = (name: string, isPrivate: boolean) => {
    if (socket) {
      socket.emit('addChannel', { name, isPrivate });
    }
  };

  const removeChannel = (channelId: number) => {
    if (socket) {
      console.log('Removing channel:', channelId);
      socket.emit('removeChannel', { channelId });
    }
  };

  const findOrCreateChannel = (name: string, isPrivate: boolean) => {
    if (socket) {
      socket.emit('findOrCreateChannel', { name, isPrivate });
    }
  };

  const publicChannels = computed(() =>
    channels.value.filter((channel) => !channel.isPrivate)
  );

  const privateChannels = computed(() =>
    channels.value.filter((channel) => channel.isPrivate)
  );

  return {
    channels,
    privateChannels,
    publicChannels,
    pendingChannels,
    connectToChannels,
    loadChannels,
    addChannel,
    removeChannel,
    findOrCreateChannel,
  };
});
