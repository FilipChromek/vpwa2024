<template>
  <q-separator spaced />
  <q-item class="q-py-md q-px-sm">
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
import { ref, watch } from 'vue';
import { Notify } from 'quasar';

const userName = ref('Filip Chromek');
const selectedStatus = ref('Online');
const statusOptions = ref(['Online', 'Away', 'DND', 'Offline']);

watch(selectedStatus, (newStatus, oldStatus) => {
  if (newStatus !== oldStatus) {
    Notify.create({
      message: `Status changed to: ${newStatus}`,
      color: 'green',
      timeout: 2000,
      position: 'top-right',
    });
  }
});
</script>

<style scoped></style>
