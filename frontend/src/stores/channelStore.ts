import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { computed, ref } from 'vue';
import { Channel } from 'components/models';
export const useChannelStore = defineStore('channelStore', () => {
  const channels = ref<Channel[]>([]);
  const pendingChannels = ref([]);

  const loadChannels = async () => {
    try {
      const response = await api.get('/api/channels');
      channels.value = response.data;
      console.log(channels.value);
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
    loadChannels,
    addChannel,
  };
});
