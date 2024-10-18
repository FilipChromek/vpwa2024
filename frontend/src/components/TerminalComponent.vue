<template>
  <p style="color: black; padding-left: 10px">
    <i>Adam Kačmár and 2 others are typing...</i>
  </p>
  <div class="row items-center q-gutter-md">
    <q-input
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="Type a message..."
      rounded
      outlined
      input
      style="flex-grow: 1"
      :input-style="{ fontSize: '16px' }"
    >
      <template v-slot:prepend>
        <q-icon name="send" />
      </template>
    </q-input>

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

    <q-dialog v-model="isPeopleListOpen" persistent>
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

// import {useRoute} from 'vue-router';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useChatStore } from 'stores/store';

const chatStore = useChatStore();
const route = useRoute();

const newMessage = ref('');
const isPeopleListOpen = ref(false);

const openPeopleList = () => {
  isPeopleListOpen.value = true;
};


// const route = useRoute()
const checkForCommand = () => {
  const message = newMessage.value;

  if (message.substring(0, 5) === '/join') {
    const parameter = message.substring(5).split(' ');
    const name = parameter[1];
    
    if (parameter[2] == 'public') {
      chatStore.addChatRoom(name, 'public');
    }
    else{
      chatStore.addChatRoom(name, 'private');

    }
    newMessage.value = '';
    
    return true;
  } else if (message.substring(0, 5) === '/list') {
    openPeopleList();
    newMessage.value = '';
    return true;
  }
  else if (message.substring(0, 5) === '/quit') {
    chatStore.removeChatRoom(parseInt(route.params.id as string, 10))
    newMessage.value = '';
    return true;
  }
  else if (message.substring(0, 7) === '/cancel') {
    chatStore.removeChatRoom(parseInt(route.params.id as string, 10))
    newMessage.value = '';
    return true;
  }
  else if (message.substring(0, 7) === '/invite') {
    
    newMessage.value = '';
    return true;
  }
  else if (message.substring(0, 7) === '/revoke') {
   
    newMessage.value = '';
    return true;
  }
  else if (message.substring(0, 5) === '/kick') {
    
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
};
</script>

<style scoped></style>
