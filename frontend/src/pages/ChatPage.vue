<template>
  <chat-component :messages="chatRoomMessages" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ChatComponent from 'components/ChatComponent.vue'

// Sample chat room data
const chatRooms = [
  {
    id: 1,
    name: 'Private Chat 1',
    messages: [
      { name: 'Me', text: ['Hey there!'], avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', isSent: true },
      { name: 'Friend', text: ['Hello!'], avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', isSent: false },
    ],
  },
  {
    id: 2,
    name: 'Private Chat 2',
    messages: [
      { name: 'Me', text: ['This is Private Chat 2.'], avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', isSent: true },
      { name: 'Colleague', text: ['Nice to chat with you here.'], avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', isSent: false },
    ],
  },
  {
    id: 3,
    name: 'Public Chat 1',
    messages: [
      { name: 'Me', text: ['Welcome to Public Chat 1!'], avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', isSent: true },
      { name: 'Participant', text: ['Thanks!'], avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', isSent: false },
    ],
  },
]

const route = useRoute()

const chatRoomMessages = computed(() => {
  const chatRoomId = parseInt(route.params.id as string, 10) // Get the room ID from the URL
  const selectedChatRoom = chatRooms.find(room => room.id === chatRoomId) // Find the room with that ID
  return selectedChatRoom ? selectedChatRoom.messages : [] // Return messages or empty array if not found
})

</script>

