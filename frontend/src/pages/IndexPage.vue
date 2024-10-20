<template>
  <q-page class="row items-center justify-center q-pa-md">
    <div class="welcome-message column q-pa-md q-gutter-md text-center">
      <q-icon name="chat" :size="iconSize" class="q-mb-md" />
      <h1 class="text-h3 text-h4-xs q-mb-sm">Welcome to ZapoChat</h1>
      <p class="text-subtitle1 text-body1-xs">
        Please select a chat room from the left or type a command to get
        started.
      </p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const iconSize = ref('100px');

if ($q.screen.xs) {
  iconSize.value = '70px';
} else if ($q.screen.sm) {
  iconSize.value = '80px';
} else {
  iconSize.value = '100px';
}
</script>

<style scoped>
.welcome-message {
  max-width: 600px;
  width: 100%;
}
</style>
