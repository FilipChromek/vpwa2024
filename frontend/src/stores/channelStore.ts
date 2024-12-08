import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Channel, User } from 'components/models';
import websocketService from 'src/services/websocketService';
import { Notify } from 'quasar';
import { useChatStore } from 'stores/chatStore';
import { Socket } from 'socket.io-client';

export const useChannelStore = defineStore('channelStore', () => {
  const channels = ref<Channel[]>([]);
  const invitations = ref<Channel[]>([]);
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
        loadInvitations();
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

      socket.on('loadedInvitations', (pending: Channel[]) => {
        invitations.value = pending;
      });

      socket.on(
        'channelUsers',
        ({ channelId, users }: { channelId: number; users: User[] }) => {
          chatStore.channelUsers[channelId] = users;
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
          message: 'Channel deleted.',
          color: 'positive',
          timeout: 3000,
          position: 'top-right',
        });
      });

      socket.on('invitationReceived', () => {
        loadInvitations();
        Notify.create({
          message: 'You have been invited to a new channel.',
          color: 'positive',
          timeout: 3000,
          position: 'top-right',
        });
      });

      socket.on('invitationSent', () => {
        Notify.create({
          message: 'Invitation sent.',
          color: 'positive',
          timeout: 3000,
          position: 'top-right',
        });
      });

      socket.on('invitationAccepted', () => {
        loadInvitations();
        loadChannels();
        Notify.create({
          message: 'You have successfully joined the channel!',
          color: 'positive',
          timeout: 3000,
          position: 'top-right',
        });
      });

      socket.on('invitationDeclined', () => {
        loadInvitations();
        Notify.create({
          message: 'Invitation declined.',
          color: 'warning',
          timeout: 3000,
          position: 'top-right',
        });
      });

      socket.on('revokeReceived', () => {
        loadChannels();
        Notify.create({
          message: 'You have been revoked from a channel.',
          color: 'warning',
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

  const loadInvitations = () => {
    if (socket) {
      socket.emit('loadInvitations');
    }
  };

  const inviteUser = (channelId: number, username: string) => {
    if (socket) {
      socket.emit('inviteUser', { channelId, username });
    }
  };

  const revokeUser = (channelId: number, username: string) => {
    if (socket) {
      socket.emit('revokeUser', { channelId, username });
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

  const acceptInvitation = (invitationId: number) => {
    if (socket) {
      const accept = true;
      socket.emit('handleInvitation', { invitationId, accept });
    }
  };

  const declineInvitation = (invitationId: number) => {
    if (socket) {
      const accept = false;
      socket.emit('handleInvitation', { invitationId, accept });
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
    invitations,
    connectToChannels,
    loadChannels,
    loadInvitations,
    inviteUser,
    revokeUser,
    addChannel,
    removeChannel,
    findOrCreateChannel,
    acceptInvitation,
    declineInvitation,
  };
});
