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
// import {useRoute} from 'vue-router';
import {ref} from 'vue';

const newMessage = ref('')

// const route = useRoute()

const sendMessage = () => {
  if (newMessage.value.trim()) {

  }
  newMessage.value = ''
}

</script>

<style scoped>

</style>
