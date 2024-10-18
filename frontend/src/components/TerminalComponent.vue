<template>
  <q-input
    v-model="newMessage"
    @keyup.enter="sendMessage"
    placeholder="Type a message..."
    rounded
    outlined
    class="terminal"
    input
    :input-style="{ fontSize: '16px' }">
    <template v-slot:prepend>
      <q-icon name="send"/>
    </template>
  </q-input>
</template>

<script setup lang="ts">


const scrollToBottom = () => {
  setTimeout(() => {
  window.scrollTo({ top: document.body.scrollHeight });
}, 0);
};

// import {useRoute} from 'vue-router';
import {ref} from 'vue';
import { useRoute } from 'vue-router';
import { useChatStore } from 'stores/store';


const chatStore = useChatStore();
const route = useRoute();


const newMessage = ref('')

// const route = useRoute()
const checkforcommand = () => {
  const message = newMessage.value;

  if (message.substring(0, 5) === '/join') {
    const parameter = message.substring(5,).trim();
    let typ = 'private';
    if (parameter == 'public'){
      typ = 'public';
    }
    console.log(typ);
    //create channel public or private
    
    
    return true;
}

  else if (message.substring(0, 5) === '/list'){
    return true;

  }
    return false;

}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    

    if (checkforcommand()){
        return;

    }

    const chatRoomId = parseInt(route.params.id as string, 10);
    const selectedChatRoom = chatStore.chatRooms.find(
      (room) => room.id === chatRoomId
    );
    
    if (selectedChatRoom) {
      //console.log(1);
      //selectedChatRoom.messages.push();
      chatStore.send_message({
        name: 'Me',
        text: [newMessage.value.trim()],
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        isSent: true,
      },chatRoomId)



      
    }
    scrollToBottom();
  }

  newMessage.value = ''; // clear the input after sending
};



</script>

<style scoped>

</style>
