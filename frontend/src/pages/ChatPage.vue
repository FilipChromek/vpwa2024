<template>
  <chat-component :messages="chatStore.messages" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useChatStore } from 'stores/chatStore';
import ChatComponent from 'components/ChatComponent.vue';

const chatStore = useChatStore();

onMounted(() => {
  const channelId = parseInt($route.params.id as string, 10);
  chatStore.connectToChannel(channelId);
});
</script>
