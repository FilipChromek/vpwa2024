<template>
  <chat-component :messages="chatStore.messages" :key="route.params.id" />
</template>

<script setup lang="ts">
//import { onMounted } from 'vue';
import { useChatStore } from 'stores/chatStore';
import ChatComponent from 'components/ChatComponent.vue';
import { useRoute } from 'vue-router';
//import { useRoute } from 'vue-router';

const chatStore = useChatStore();
const route = useRoute();
</script>
