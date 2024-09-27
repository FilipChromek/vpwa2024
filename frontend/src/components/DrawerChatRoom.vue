<template>
  <q-scroll-area class="fit">
    <q-list padding class="rounded-borders">
      <q-item-label header>Chat Rooms</q-item-label>
      <template v-for="index in 10" :key="index">
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="chat"/>
          </q-item-section>
          <q-item-section>
            Index
          </q-item-section>
        </q-item>
      </template>

      <q-separator spaced/>

      <q-item-label header>Invitations</q-item-label>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="question_mark"/>
        </q-item-section>
        <q-item-section>
          Humbuk
        </q-item-section>
        <q-item-section>
          <q-icon name="done"/>
          <q-icon name="close"/>
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
