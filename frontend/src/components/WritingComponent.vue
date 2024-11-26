<template>
    <div>
      <div v-for="message in writingMessages" :key="message.userId">
        <i>{{ message.author.username }} is typing {{message.content}}</i>
      </div>
    </div>  
  </template>
  
  <script>
  import { useChatStore } from 'stores/chatStore';
  import { computed } from 'vue';
  
  export default {
    name: 'WritingMessages',
    setup() {
      // Access the chatStore
      const chatStore = useChatStore();
  
      // Create a computed property for writingMessages
      const writingMessages = computed(() => chatStore.writingMessages);
  
      return {
        writingMessages,
      };
    },
  };
  </script>
  
  <style scoped>
  i {
    font-style: italic;
    color: gray;
  }
  </style>
  