<template>
  <div ref="chatContainer" class="chat-container q-pa-md col-12 bg-grey-2">
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
import { ref, onMounted, watch } from 'vue'

interface Message {
  name: string;
  text: string[];
  avatar: string;
  isSent: boolean;
}

const props = defineProps<{
  messages: Message[]
}>();

const chatContainer = ref<HTMLElement | null>(null)

// Function to scroll to the bottom
const scrollToBottom = () => {
  const container = chatContainer.value
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

// Watch for new messages and scroll to the bottom
watch(() => props.messages, () => {
  scrollToBottom()
}, { deep: true })

// Scroll to the bottom on mount
onMounted(() => {
  scrollToBottom()
})

</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
}
</style>
