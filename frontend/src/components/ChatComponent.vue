<template>
  <div class="q-pa-md chat-container">
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
import { ref } from 'vue'

const messages = ref([
  {
    name: 'Me',
    text: ['Hey, how are you?'],
    avatar: 'https://cdn.quasar.dev/img/michael-avatar.png',
    isSent: true  // Sent message (aligned to right)
  },
  {
    name: 'Martin Hnatko',
    text: ['wassupski'],
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    isSent: false  // Received message (aligned to left)
  },
  {
    name: 'Me',
    text: ['All good here!'],
    avatar: 'https://cdn.quasar.dev/img/michael-avatar.png',
    isSent: true  // Sent message (aligned to right)
  },
  {
    name: 'Martin Hnatko',
    text: ['Same here, working on some projects.'],
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    isSent: false  // Received message (aligned to left)
  }
])
</script>

<style scoped>
.chat-container {
  height: 100%;  /* Use full height available from the parent */
  overflow-y: auto;  /* Enable scrolling for chat messages */
}
</style>
