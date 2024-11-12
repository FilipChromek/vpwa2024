import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { computed, ref } from 'vue';
import { Channel, User } from 'components/models';
import { useAuthStore } from 'stores/authStore';
export const useChannelStore = defineStore('channelStore', () => {
  const channels = ref<Channel[]>([]);
  const pendingChannels = ref([]);
  const channelUsers = ref<User[]>([]);
  const authStore = useAuthStore();

  const loadChannels = async () => {
    try {
      console.log('Before loading channels');
      const response = await api.get('/api/channels');
      console.log('After loading channels');
      channels.value = response.data;
      // console.log(channels.value);
    } catch (error) {
      console.error(error);
    }
  };

  const addChannel = async (name: string, isPrivate: boolean) => {
    try {
      console.log('Adding channel:', name, isPrivate);
      await api.post('/api/channels', { name, isPrivate });
      await loadChannels();
    } catch (error) {
      console.error(error);
    }
  };

  const removeChannel = async (channelId: number) => {
    try {
      const channel = channels.value.find((c) => c.id === channelId);
      console.log('Removing channel:', channelId);
      if (!channel) {
        console.error('Channel not found');
        return;
      }

      if (channel.createdBy === authStore.user?.id) {
        await api.delete(`/api/channels/${channelId}`);
        console.log(`Channel ${channelId} deleted by owner`);
      } else {
        await api.delete(`/api/channels/${channelId}/remove-user`, {
          data: { userId: authStore.user?.id },
        });
        console.log(`User removed from channel ${channelId}`);
      }

      await loadChannels();
    } catch (error) {
      console.error('Error removing channel:', error);
    }
  };

  const inviteUser = async (channelId: number, username: string) => {
    try {
      await api.post(`/api/channels/${channelId}/invite`, { username });
      console.log(`${username} invited to channel ${channelId}`);
    } catch (error) {
      console.error('Failed to invite user:', error);
    }
  };

  const revokeUser = async (channelId: number, username: string) => {
    try {
      await api.post(`/api/channels/${channelId}/revoke`, { username });
      console.log(`${username} removed from channel ${channelId}`);
    } catch (error) {
      console.error('Failed to revoke user:', error);
    }
  };

  const listChannelUsers = async (channelId: number) => {
    try {
      const response = await api.get(`/api/channels/${channelId}/users`);
      channelUsers.value = response.data; // Store the users in a reactive array
    } catch (error) {
      console.error('Failed to fetch channel users:', error);
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
    channelUsers,
    privateChannels,
    publicChannels,
    pendingChannels,
    loadChannels,
    addChannel,
    removeChannel,
    inviteUser,
    revokeUser,
    listChannelUsers,
  };
});
