<template>
  <div class="q-pa-md bg-grey-2 chat-container">
    <q-chat-message
      v-for="(message, index) in messages"
      :key="index"
      :name="message.name"
      :text="message.text"
      :avatar="message.avatar"
      :sent="message.isSent"
      />
  </div>
</template>

<script setup lang="ts">
interface Message {
  name: string;
  text: string[];
  avatar: string;
  isSent: boolean;
}
defineProps<{
  messages: Message[]
}>();

</script>

<style scoped>
.chat-container {
  height: 100%;  /* Use full height available from the parent */
  overflow-y: auto;  /* Enable scrolling for chat messages */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
