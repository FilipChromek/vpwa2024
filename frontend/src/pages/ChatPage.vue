<template>
  <chat-component :messages="chatRoomMessages_new" @loadMoreMessages="loadMoreMessages"  />
</template>

<script setup lang="ts">
import { ref,computed,watch } from 'vue';
import { useRoute } from 'vue-router';
import { useChatStore } from 'stores/store';
import ChatComponent from 'components/ChatComponent.vue';
import { Message} from 'components/models';




const chatStore = useChatStore();
const route = useRoute();

const loadLimit = ref(10); // Number of messages to load per chunk
const currentOffset = ref(0); // To track loaded messages
const chatRoomMessages = ref<Message[]>([]);// Messages currently displayed


const chatRoomId = computed(() => parseInt(route.params.id as string, 10));

// Load messages based on the current room and offset
const loadMessages = () => {
  chatStore.getMessages(chatRoomId.value, currentOffset.value, loadLimit.value);
  
  // Prepend new messages to the existing displayedMessages
 // chatRoomMessages.value = [...nextMessages, ...chatRoomMessages.value];
  currentOffset.value += loadLimit.value;
};

// Reset messages and offset when switching rooms
const resetMessages = () => {
  chatRoomMessages.value = [];  // Clear the displayed messages
  currentOffset.value = 0; 
  chatStore.reset_messages();      // Reset the offset
  loadMessages();                // Load the first chunk of messages for the new room
};

// Triggered when user scrolls to top
const loadMoreMessages = () => {
  loadMessages();
};

// Watch for changes in the room ID and reset messages accordingly
watch(chatRoomId, () => {
  resetMessages();  // Reset messages when the room changes
});

// Initial load of messages
resetMessages();
const chatRoomMessages_new = computed(() => {
  return chatStore.messages;
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let chatRoomMessages_old = computed(() => {
  const chatRoomId = parseInt(route.params.id as string, 10);
  const selectedChatRoom = chatStore.chatRooms.find(
    (room) => room.id === chatRoomId
  );
  return selectedChatRoom ? selectedChatRoom.messages : [];
}); 
</script>
