<template>
  <q-scroll-area class="fit">
    <q-list padding class="rounded-borders">
      <q-item-label header>Private Chats</q-item-label>
      <template v-for="room in chatRooms" :key="room.id">
        <chat-room :room="room"></chat-room>
      </template>

      <q-separator spaced/>

      <q-item-label header>Invitations</q-item-label>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="question_mark"/>
        </q-item-section>
        <q-item-section>
          Humbukhumbuk humbuk
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import ChatRoom from 'components/ChatRoom.vue';
import {Room} from 'components/models';

const chatRooms: Room[] = [
  { id: 1, name: 'Private Chat 1' },
  { id: 2, name: 'Private Chat 2' },
  { id: 3, name: 'Public Chat 1' },
  { id: 4, name: 'Public Chat 2' },
]

</script>

<style scoped>

</style>
