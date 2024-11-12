<template>
  <chat-component :messages="chatStore.messages" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useChatStore } from 'stores/chatStore';
import ChatComponent from 'components/ChatComponent.vue';
import { useRoute } from 'vue-router';

const chatStore = useChatStore();
const route = useRoute();

onMounted(() => {
  const channelId = parseInt(route.params.id as string, 10);
  console.log('channelId', channelId);
  chatStore.connectToChannel(channelId);
});
</script>
