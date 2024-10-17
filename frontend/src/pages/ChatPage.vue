<template>
  <chat-component :messages="chatRoomMessages" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useChatStore } from 'stores/store';
import ChatComponent from 'components/ChatComponent.vue';

const chatStore = useChatStore();
const route = useRoute();

const chatRoomMessages = computed(() => {
  const chatRoomId = parseInt(route.params.id as string, 10);
  const selectedChatRoom = chatStore.chatRooms.find(
    (room) => room.id === chatRoomId
  );
  return selectedChatRoom ? selectedChatRoom.messages : [];
});
</script>
