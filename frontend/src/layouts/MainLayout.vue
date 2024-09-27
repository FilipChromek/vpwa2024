<template>
  <q-layout view="hHh LpR lFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          ZapoChat
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above v-model="leftDrawerOpen"
      side="left"
      bordered
      :width="250"
      class="bg-secondary"
    >
      <drawer-chat-room />
    </q-drawer>

    <q-page-container
      class="flex flex-col">
      <chat-component :messages="messages" class="flex-grow-1 full-height overflow-auto"/>
    </q-page-container>

    <q-footer elevated
              class="bg-grey-3 q-pa-md">
      <q-input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
        rounded
        outlined
        class="terminal"
        input
        :input-style="{ fontSize: '16px' }">
        <template v-slot:prepend>
          <q-icon name="send"/>
        </template>
      </q-input>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import ChatComponent from 'components/ChatComponent.vue';
import DrawerChatRoom from 'components/DrawerChatRoom.vue';

const leftDrawerOpen = ref(false)

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
    text: ['cusbusautobus'],
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    isSent: false  // Received message (aligned to left)
  },
  {
    name: 'Me',
    text: ['trapny si jak klinec'],
    avatar: 'https://cdn.quasar.dev/img/michael-avatar.png',
    isSent: true  // Sent message (aligned to right)
  },
  {
    name: 'Martin Hnatko',
    text: ['fuhafuha'],
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    isSent: false  // Received message (aligned to left)
  },
])

// New message input field
const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      name: 'Me',
      text: [newMessage.value], // Message content
      avatar: 'https://cdn.quasar.dev/img/michael-avatar.png',
      isSent: true, // Sent by me
    })

    // Clear the input field after sending
    newMessage.value = ''
  }
}

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>

<style scoped>
.terminal {
  margin: auto;
  display: block;
  width: 100%;
}
</style>

