<template>
  <q-scroll-area class="fit">
    <q-list padding class="rounded-borders">
      <div class="flex flex-row justify-between q-px-md">
        <h3 class="text-subtitle2">Private Chats</h3>
        <q-btn
          dense
          flat
          round
          icon="add"
          color="primary"
          @click="openAddChatDialog"
        />
      </div>
      <template v-for="room in chatRooms" :key="room.id">
        <chat-room :room="room" @remove="removeChatRoom"></chat-room>
      </template>

      <q-separator spaced />

      <q-item-label header>Invitations</q-item-label>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="question_mark" />
        </q-item-section>
        <q-item-section> Humbukhumbuk humbuk </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="isAddChatDialogOpen" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Add New Chat</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newChatRoomName"
            rounded
            outlined
            placeholder="Enter chat room name..."
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add" color="primary" @click="addChatRoom" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-scroll-area>
</template>

<script setup lang="ts">
import ChatRoom from 'components/ChatRoom.vue';
import { Room } from 'components/models';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const chatRooms = ref<Room[]>([
  { id: 1, name: 'Private Chat 1' },
  { id: 2, name: 'Private Chat 2' },
  { id: 3, name: 'Public Chat 1' },
  { id: 4, name: 'Public Chat 2' },
]);

const isAddChatDialogOpen = ref(false);
const newChatRoomName = ref('');

const openAddChatDialog = () => {
  isAddChatDialogOpen.value = true;
};

const addChatRoom = () => {
  if (newChatRoomName.value.trim()) {
    const newRoom: Room = {
      id: chatRooms.value.length + 1,
      name: newChatRoomName.value,
    };
    chatRooms.value.push(newRoom);
    newChatRoomName.value = '';
    isAddChatDialogOpen.value = false;
  }
};

const router = useRouter();
const route = useRoute();

const removeChatRoom = (roomToRemove: Room) => {
  if (
    route.params.id &&
    parseInt(route.params.id as string, 10) === roomToRemove.id
  ) {
    router.push('/');
  }
  chatRooms.value = chatRooms.value.filter(
    (room) => room.id !== roomToRemove.id
  );
};
</script>

<style scoped></style>
