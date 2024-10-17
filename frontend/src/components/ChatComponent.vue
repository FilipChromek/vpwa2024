<template>
  <q-page class="row items-stretch">
    <q-btn @click="loadMoreMessages" label="Load More Messages" flat />

    <div ref="chatContainer" @scroll="handleScroll" class="chat-container q-pa-md col-12 justify-end bg-grey-2">
      <q-chat-message
        v-for="(message, index) in messages"
        :key="index"
        :name="message.name"
        :text="message.text"
        :avatar="message.avatar"
        :sent="message.isSent"
        />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Message } from 'components/models';

const props = defineProps<{
  messages: Message[]
}>();
const emit = defineEmits(['loadMoreMessages']);
const loadMoreMessages = () => {
  console.log(10);
  emit('loadMoreMessages');
}
const chatContainer = ref<HTMLElement | null>(null);
  const handleScroll = () => {
   // console.log(5);
  if (chatContainer.value?.scrollTop === 0) { // Optional chaining to check if chatContainer is defined
    emit('loadMoreMessages'); // Emit event to load more messages when user reaches the top
  }
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    setTimeout(() => {
      window.scrollTo(0, chatContainer.value!.scrollHeight)
    }, 0)
  }
}

watch(() => props.messages, () => {
  //scrollToBottom()
}, { deep: true })

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
