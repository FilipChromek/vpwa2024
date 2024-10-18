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
          @click="openAddPrivateChatDialog"
        />
      </div>
      <template v-for="room in privateChatRooms" :key="room.id">
        <chat-room
          :room="room"
          @remove="chatStore.removeChatRoom(room.id)"
        ></chat-room>
      </template>

      <q-separator spaced />

      <div class="flex flex-row justify-between q-px-md">
        <h3 class="text-subtitle2">Public Chats</h3>
        <q-btn
          dense
          flat
          round
          icon="add"
          color="primary"
          @click="openAddPublicChatDialog"
        />
      </div>
      <template v-for="room in publicChatRooms" :key="room.id">
        <chat-room
          :room="room"
          @remove="chatStore.removeChatRoom(room.id)"
        ></chat-room>
      </template>

      <q-separator spaced />

      <q-item-label header>Invitations</q-item-label>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="question_mark" />
        </q-item-section>
        <q-item-section> Humbukhumbuk humbuk </q-item-section>
      </q-item>

      <q-separator spaced />

      <q-item>
        <q-item-section>
          <q-item-label>{{ userName }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-select
            v-model="selectedStatus"
            label="Status"
            :options="statusOptions"
            outlined
            placeholder="Choose status"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="isAddPrivateChatDialogOpen" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Add New Private Chat</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newPrivateChatRoomName"
            rounded
            outlined
            placeholder="Enter chat room name..."
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add" color="primary" @click="addPrivateChatRoom" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isAddPublicChatDialogOpen" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Add New Public Chat</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newPublicChatRoomName"
            rounded
            outlined
            placeholder="Enter chat room name..."
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add" color="primary" @click="addPublicChatRoom" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-scroll-area>
</template>

<script setup lang="ts">
import ChatRoom from 'components/ChatRoom.vue';
import { ref, computed } from 'vue';
import { useChatStore } from 'stores/store';

const chatStore = useChatStore();

const privateChatRooms = computed(() =>
  chatStore.chatRooms.filter((room) => room.type === 'private')
);

const publicChatRooms = computed(() =>
  chatStore.chatRooms.filter((room) => room.type === 'public')
);

const isAddPrivateChatDialogOpen = ref(false);
const newPrivateChatRoomName = ref('');

const isAddPublicChatDialogOpen = ref(false);
const newPublicChatRoomName = ref('');

const openAddPrivateChatDialog = () => {
  isAddPrivateChatDialogOpen.value = true;
};

const openAddPublicChatDialog = () => {
  isAddPublicChatDialogOpen.value = true;
};

const addPrivateChatRoom = () => {
  if (newPrivateChatRoomName.value.trim()) {
    chatStore.addChatRoom(newPrivateChatRoomName.value, 'private');
    newPrivateChatRoomName.value = '';
    isAddPrivateChatDialogOpen.value = false;
  }
};

const addPublicChatRoom = () => {
  if (newPublicChatRoomName.value.trim()) {
    chatStore.addChatRoom(newPublicChatRoomName.value, 'public');
    newPublicChatRoomName.value = '';
    isAddPublicChatDialogOpen.value = false;
  }
};

const userName = ref('Filip Chromek'); // Replace with dynamic data if necessary
const selectedStatus = ref('Online');
const statusOptions = ref(['Online', 'Away', 'Do not disturb', 'Offline']);
</script>

<style scoped></style>
