<template>
  <p style="color: black; padding-left: 10px">
    <i>Adam Kačmár and 2 others are typing...</i>
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

    <q-menu v-model="isUserListOpen" no-focus no-parent-event anchor="bottom left">
      <q-list>
        <q-item
          v-for="(person, index) in filteredPeople"
          :key="person.id"
          :class="{ 'bg-primary text-white': highlightedIndex === index }"
          clickable
          @click="tagPerson(person.name)"
        >
          <q-item-section>{{
            person.name + ' (@' + person.nickname + ')'
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
          <q-item v-for="person in chatStore.people" :key="person.id">
            <q-item-section>{{ person.name }}</q-item-section>
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
import { useChatStore } from 'stores/store';
import { useRouter } from 'vue-router';

const chatStore = useChatStore();
const route = useRoute();
const router = useRouter();

const newMessage = ref('');
const isPeopleListOpen = ref(false);
const isUserListOpen = ref(false);
const filteredPeople = ref(chatStore.people);
const highlightedIndex = ref(0);
// const tagInProgress = ref(false);

const openPeopleList = () => {
  isPeopleListOpen.value = true;
};

const onInput = () => {
  const message = newMessage.value;

  if (message.endsWith('@')) {
    isUserListOpen.value = true;
  }

  if (isUserListOpen.value) {
    const searchPerson = message.split('@').pop();

    filteredPeople.value = chatStore.people.filter((person) =>
      person.name.toLowerCase().includes(searchPerson!.toLowerCase())
    );

    isUserListOpen.value = filteredPeople.value.length > 0;
  }
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
    tagPerson(selectedPerson.name);
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
  const message = newMessage.value;

  if (message.substring(0, 5) === '/join') {
    const parameter = message.substring(5).split(' ');
    const name = parameter[1];
    if (parameter[2] == 'public') {
      chatStore.addChatRoom(name, 'public');
    } else {
      chatStore.addChatRoom(name, 'private');
    }
    const newRoomId = chatStore.chatRooms[chatStore.chatRooms.length - 1].id;
    router.push(`/chat/${newRoomId}`);
    newMessage.value = '';
    return true;
  } else if (message.substring(0, 5) === '/list') {
    openPeopleList();
    newMessage.value = '';
    return true;
  } else if (message.substring(0, 5) === '/quit') {
    chatStore.removeChatRoom(parseInt(route.params.id as string, 10));
    newMessage.value = '';
    return true;
  } else if (message.substring(0, 7) === '/cancel') {
    chatStore.removeChatRoom(parseInt(route.params.id as string, 10));
    newMessage.value = '';
    return true;
  } else if (message.substring(0, 7) === '/invite') {
    newMessage.value = '';
    return true;
  } else if (message.substring(0, 7) === '/revoke') {
    newMessage.value = '';
    return true;
  } else if (message.substring(0, 5) === '/kick') {
    newMessage.value = '';
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
  isUserListOpen.value = false;
};

watch(
  () => newMessage.value,
  (newVal) => {
    if (!newVal.includes('@')) {
      isUserListOpen.value = false;
    }
  }
);
</script>

<style scoped></style>
