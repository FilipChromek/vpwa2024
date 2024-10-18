<template>
  <p style="color: black">Adam Kačmár and 2 others are typing...</p>
  <q-input
    v-model="newMessage"
    @keyup.enter="sendMessage"
    placeholder="Type a message..."
    rounded
    outlined
    class="terminal"
    input
    :input-style="{ fontSize: '16px' }"
  >
    <template v-slot:prepend>
      <q-icon name="send" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
/*
const scrollToBottom = () => {
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight });
  }, 0);
};
 */

// import {useRoute} from 'vue-router';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useChatStore } from 'stores/store';

const chatStore = useChatStore();
const route = useRoute();

const newMessage = ref('');

// const route = useRoute()
const checkForCommand = () => {
  const message = newMessage.value;

  if (message.substring(0, 5) === '/join') {
    const parameter = message.substring(5).trim();
    let typ = 'private';
    if (parameter == 'public') {
      typ = 'public';
    }
    console.log(typ);
    //create channel public or private

    return true;
  } else if (message.substring(0, 5) === '/list') {
    return true;
  }
  return false;
};

const sendMessage = () => {
  if (newMessage.value.trim()) {
    if (checkForCommand()) {
      return;
    }
    const chatRoomId = parseInt(route.params.id as string, 10);
    chatStore.sendMessage(newMessage.value, chatRoomId);
    // scrollToBottom();
  }
  newMessage.value = '';
};
</script>

<style scoped></style>
