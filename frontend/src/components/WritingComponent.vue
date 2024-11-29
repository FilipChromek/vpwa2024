<template>
    <div>
      <div v-for="message in writingMessages" :key="message.userId">
        <span @click="toggleMessageVisibility(message.userId)">
          {{ message.author.username }} 
        </span>
        is typing 
        <i v-if="visibleMessages.includes(message.userId)">
          {{ message.content }}
        </i>
      </div>
    </div>
  </template>
  
  <script>
  import { useChatStore } from 'stores/chatStore';
  import { computed, ref } from 'vue';
  
  export default {
    name: 'WritingMessages',
    setup() {
    
      const chatStore = useChatStore();
  
      
      const writingMessages = computed(() => chatStore.writingMessages);
  
     
      const visibleMessages = ref([]);
  
      const toggleMessageVisibility = (userId) => {
        if (visibleMessages.value.includes(userId)) {
          visibleMessages.value = visibleMessages.value.filter((id) => id !== userId);
        } else {
          visibleMessages.value.push(userId);
        }
      };
  
      return {
        writingMessages,
        visibleMessages,
        toggleMessageVisibility,
      };
    },
  };
  </script>
  
  <style scoped>
  i {
    font-style: italic;
    color: gray;
  }
  span {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
  }
  </style>
  