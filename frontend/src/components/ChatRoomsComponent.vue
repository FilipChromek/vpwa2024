<template>
  <q-scroll-area class="fit">
    <q-list padding class="rounded-borders">
      <template v-if="channelStore.invitations.length > 0">
        <div class="flex flex-row justify-between q-px-md">
          <h3 class="text-subtitle2">Invitations</h3>
        </div>
        <template
          v-for="invitation in channelStore.invitations"
          :key="invitation.id"
        >
          <q-item>
            <q-item-section>
              <div>{{ invitation.name }}</div>
            </q-item-section>
            <q-item-section side>
              <q-btn
                dense
                flat
                label="Accept"
                color="positive"
                @click="channelStore.acceptInvitation(invitation.id)"
              />
              <q-btn
                dense
                flat
                label="Decline"
                color="negative"
                @click="channelStore.declineInvitation(invitation.id)"
              />
            </q-item-section>
          </q-item>
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

      <template
        v-for="channel in channelStore.privateChannels"
        :key="channel.id"
      >
        <chat-room
          :channel="channel"
          @remove="channelStore.removeChannel(channel.id)"
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
      <template
        v-for="channel in channelStore.publicChannels"
        :key="channel.id"
      >
        <chat-room
          :channel="channel"
          @remove="channelStore.removeChannel(channel.id)"
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
            v-model="newChannelName"
            rounded
            outlined
            placeholder="Enter chat room name..."
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add" color="primary" @click="addPrivateChat" />
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
            v-model="newChannelName"
            rounded
            outlined
            placeholder="Enter chat room name..."
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add" color="primary" @click="addPublicChat" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-scroll-area>
</template>

<script setup lang="ts">
import ChatRoom from 'components/ChatRoom.vue';
import { onMounted, ref } from 'vue';
import { useChannelStore } from 'stores/channelStore';

const channelStore = useChannelStore();

onMounted(() => {
  channelStore.connectToChannels();
});

const isAddPrivateChatDialogOpen = ref(false);
const isAddPublicChatDialogOpen = ref(false);

const newChannelName = ref<string>('');

const openAddPrivateChatDialog = () => {
  isAddPrivateChatDialogOpen.value = true;
};

const openAddPublicChatDialog = () => {
  isAddPublicChatDialogOpen.value = true;
};

const addPrivateChat = () => {
  if (newChannelName.value.trim()) {
    channelStore.findOrCreateChannel(newChannelName.value, true);
    newChannelName.value = '';
    isAddPrivateChatDialogOpen.value = false;
  }
};

const addPublicChat = () => {
  if (newChannelName.value.trim()) {
    channelStore.findOrCreateChannel(newChannelName.value, false);
    newChannelName.value = '';
    isAddPublicChatDialogOpen.value = false;
  }
};
</script>

<style scoped></style>
