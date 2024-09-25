<template>
  <q-page class="page-container">
    <chat-component class="chat-section">
    </chat-component>
  </q-page>
</template>

<script setup lang="ts">
import ChatComponent from 'components/ChatComponent.vue';

defineOptions({
  name: 'IndexPage'
});
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column; /* Stack elements vertically */
}
</style>
