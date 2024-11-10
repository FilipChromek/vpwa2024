<template>
  <q-scroll-area class="fit">
    <q-list padding class="rounded-borders">
      <template v-if="pendingRooms.length > 0">
        <div class="flex flex-row justify-between q-px-md">
          <h3 class="text-subtitle2">Invitations</h3>
        </div>
        <template v-for="room in pendingRooms" :key="room.id">
          <chat-room
            :channel="room"
            @remove="chatStore.removePendingChatRoom(room.id, router)"
          ></chat-room>
        </template>
      </template>
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
      <template v-for="channel in privateChannels" :key="channel.id">
        <chat-room
          :channel="channel"
          @remove="chatStore.removeChatRoom(channel.id, router)"
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
      <template v-for="channel in publicChannels" :key="channel.id">
        <chat-room
          :channel="channel"
          @remove="chatStore.removeChatRoom(channel.id, router)"
        ></chat-room>
      </template>

      <q-separator spaced />
    </q-list>

    <q-dialog v-model="isAddPrivateChatDialogOpen">
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

    <q-dialog v-model="isAddPublicChatDialogOpen">
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
import { computed, onMounted } from 'vue';
import { useChatStore } from 'stores/store';
import { useRouter } from 'vue-router';
import { useChannelStore } from 'stores/channelStore';

const chatStore = useChatStore();
const channelStore = useChannelStore();
const router = useRouter();

onMounted(() => {
  channelStore.loadChannels();
});

const pendingRooms = computed(() => chatStore.pendingRooms);

const privateChannels = channelStore.privateChannels;
const publicChannels = channelStore.publicChannels;

// const isAddPrivateChatDialogOpen = ref(false);
// const newPrivateChatRoomName = ref('');
//
// const isAddPublicChatDialogOpen = ref(false);
// const newPublicChatRoomName = ref('');
//
// const openAddPrivateChatDialog = () => {
//   isAddPrivateChatDialogOpen.value = true;
// };
//
// const openAddPublicChatDialog = () => {
//   isAddPublicChatDialogOpen.value = true;
// };
//
// const addPrivateChatRoom = () => {
//   if (newPrivateChatRoomName.value.trim()) {
//     chatStore.addChatRoom(newPrivateChatRoomName.value, 'private', router);
//     newPrivateChatRoomName.value = '';
//     isAddPrivateChatDialogOpen.value = false;
//   }
// };
//
// const addPublicChatRoom = () => {
//   if (newPublicChatRoomName.value.trim()) {
//     chatStore.addChatRoom(newPublicChatRoomName.value, 'public', router);
//     newPublicChatRoomName.value = '';
//     isAddPublicChatDialogOpen.value = false;
//   }
// };
</script>

<style scoped></style>
