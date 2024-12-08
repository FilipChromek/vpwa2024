<template>
  <p style="color: black; padding-left: 10px">
    <WritingComponent></WritingComponent>
  </p>
  <div class="row items-center q-gutter-md">
    <q-input
      v-model="newMessage"
      @keyup="onInput"
      @keydown.down.prevent="highlightNextPerson"
      @keydown.up.prevent="highlightPreviousPerson"
      @keyup.enter.prevent="handleEnterKey"
      placeholder="Type a message..."
      rounded
      outlined
      input
      autofocus
      style="flex-grow: 1"
      :input-style="{ fontSize: '16px' }"
    >
      <template v-slot:prepend>
        <q-icon name="send" />
      </template>
    </q-input>

    <q-menu
      v-model="isUserListOpen"
      no-focus
      no-parent-event
      anchor="bottom left"
    >
      <q-list>
        <q-item
          v-for="(person, index) in filteredPeople"
          :key="person.id"
          :class="{ 'bg-primary text-white': highlightedIndex === index }"
          clickable
          @click="tagPerson(person.name)"
        >
          <q-item-section>{{
            person.first_name +
            ' ' +
            person.last_name +
            ' (@' +
            person.username +
            ')'
          }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>

    <q-btn
      dense
      flat
      round
      size="lg"
      icon="people"
      @click="openPeopleList"
      style="background: #38003c"
      text-color="white"
      class="q-ml-sm"
    />

    <q-dialog v-model="isPeopleListOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">People in this Channel</div>
        </q-card-section>

        <q-list>
          <q-item v-for="person in filteredPeople" :key="person.id">
            <q-item-section>
              <q-badge :color="person.status === 'Online' ? 'green' : 'red'">
                {{ person.status }}
              </q-badge>
              {{ person.first_name }} {{ person.last_name }} (@{{
                person.username
              }})
            </q-item-section>
          </q-item>
        </q-list>

        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
/*
const scrollToBottom = () => {
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight });
  }, 0);
};
 */

import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useChatStore } from 'stores/chatStore';
import { useChannelStore } from 'stores/channelStore';
import WritingComponent from './WritingComponent.vue';
import { User } from 'components/models';
import { Notify } from 'quasar';

const chatStore = useChatStore();
const channelStore = useChannelStore();
const route = useRoute();

const newMessage = ref('');
const isPeopleListOpen = ref(false);
const isUserListOpen = ref(false);
const filteredPeople = ref<User[]>([]);
const highlightedIndex = ref(0);

const openPeopleList = () => {
  const channelId = parseInt(route.params.id as string, 10);
  filteredPeople.value = chatStore.channelUsers[channelId] || [];
  isPeopleListOpen.value = true;
};

const onInput = () => {
  const message = newMessage.value;

  if (message.endsWith('@')) {
    isUserListOpen.value = true;
  }

  if (isUserListOpen.value) {
    const searchPerson = message.split('@').pop();

    const channelId = parseInt(route.params.id as string, 10);
    const activeChannelUsers = chatStore.channelUsers[channelId] || [];

    filteredPeople.value = activeChannelUsers.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchPerson!) ||
        user.username.toLowerCase().includes(searchPerson!)
    );

    console.log('filteredPeople: ', filteredPeople.value);

    isUserListOpen.value = filteredPeople.value.length > 0;
  }

  console.log('filteredPeople: ', filteredPeople.value);
};

const highlightNextPerson = () => {
  if (
    filteredPeople.value.length > 0 &&
    highlightedIndex.value < filteredPeople.value.length - 1
  ) {
    highlightedIndex.value++;
  }
};

const highlightPreviousPerson = () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--;
  }
};

const handleEnterKey = () => {
  if (isUserListOpen.value && highlightedIndex.value >= 0) {
    const selectedPerson = filteredPeople.value[highlightedIndex.value];
    tagPerson(selectedPerson.username);
  } else {
    sendMessage();
  }
};

const tagPerson = (name: string) => {
  const messageParts = newMessage.value.split('@');
  messageParts.pop();
  newMessage.value = `${messageParts.join('@')}@${name} `;
  isUserListOpen.value = false;
};

const checkForCommand = () => {
  const message = newMessage.value.trim();
  const parts = message.split(' ');
  const command = parts[0];
  const channelId = parseInt(route.params.id as string, 10);

  switch (command) {
    case '/join': {
      const channelName = parts.slice(1, -1).join(' ').trim();
      const isPrivate = parts[parts.length - 1] === 'private';
      if (!channelName) {
        Notify.create({
          message: 'Please specify a channel name.',
          color: 'negative',
          timeout: 3000,
          position: 'top-right',
        });
        return false;
      }
      channelStore.findOrCreateChannel(channelName, isPrivate);
      newMessage.value = '';
      return true;
    }

    case '/invite': {
      const username = parts[1];
      if (!username) {
        return false;
      }
      channelStore.inviteUser(channelId, username);
      newMessage.value = '';
      return true;
    }

    case '/revoke': {
      const username = parts[1];
      if (!username) {
        return false;
      }
      channelStore.revokeUser(channelId, username);
      newMessage.value = '';
      return true;
    }

    case '/kick': {
      const username = parts[1];
      if (!username) {
        return false;
      }
      channelStore.kickUser(channelId, username);
      newMessage.value = '';
      return true;
    }

    case '/quit': {
      channelStore.removeChannel(channelId);
      newMessage.value = '';
      return true;
    }

    case '/cancel': {
      channelStore.removeChannel(channelId);
      newMessage.value = '';
      return true;
    }

    case '/list': {
      openPeopleList();
      isPeopleListOpen.value = true;
      newMessage.value = '';
      return true;
    }

    default:
      return false;
  }
};

const sendMessage = () => {
  if (newMessage.value.trim()) {
    if (checkForCommand()) {
      return;
    }
    // const chatRoomId = parseInt(route.params.id as string, 10);
    chatStore.addMessage(newMessage.value);
    // scrollToBottom();
  }
  newMessage.value = '';
  isUserListOpen.value = false;
};
const writingMessage = () => {
  chatStore.writingMessage(newMessage.value);
};
watch(
  () => newMessage.value,
  (newVal) => {
    if (!newVal.includes('@')) {
      isUserListOpen.value = false;
    }
    writingMessage();
  }
);
</script>

<style scoped></style>
