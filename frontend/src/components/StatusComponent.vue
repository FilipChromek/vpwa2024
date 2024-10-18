<template>
  <q-item>
    <q-item-section>
      <q-item-label header>{{ userName }}</q-item-label>
    </q-item-section>
    <q-item-section>
      <q-select
        v-model="selectedStatus"
        label="Status"
        :options="statusOptions"
        outlined
        placeholder="Choose status"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const userName = ref('Filip Chromek'); // Replace with dynamic data if necessary
const selectedStatus = ref('Online');
const statusOptions = ref(['Online', 'Away', 'DND', 'Offline']);
</script>

<style scoped></style>
